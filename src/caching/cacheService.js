"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachingService = void 0;
const cacheConfig_1 = require("../config/cacheConfig");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const cachingService = {
    registerSessionToCache: (sessionId, registrationRequest) => {
        console.log(`Caching the userName to the cache with registrationRequest ${JSON.stringify(registrationRequest)}`);
        const decodedToken = jwt_decode_1.default.jwtDecode(registrationRequest.token);
        if (decodedToken.sub) {
            cacheConfig_1.webSocketCache.set(decodedToken.sub, sessionId);
        }
        else {
            console.error("Decoded token does not contain 'sub' field.");
        }
    },
    getSessionIdByUserEmail: (email) => {
        return cacheConfig_1.webSocketCache.get(email);
    }
};
exports.cachingService = cachingService;
