"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachingService = void 0;
const cacheConfig_1 = require("../config/cacheConfig");
const jwtDecode = require("jwt-decode").jwtDecode;
const cachingService = {
    registerSessionToCache: (sessionId, registrationRequest) => {
        console.log(`Caching the userName to the cache with registrationRequest ${JSON.stringify(registrationRequest)}`);
        const decodedToken = jwtDecode(registrationRequest.token);
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
