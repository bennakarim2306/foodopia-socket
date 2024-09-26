"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const jwtDecode = require("jwt-decode").jwtDecode;
const cacheService = require("./caching/cacheService").cachingService;
const contactNotificationApi_1 = require("./rest/v1/contactNotificationApi");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const contactNotificationApi = new contactNotificationApi_1.ContactNotificationApi(app, io);
io.on('connect', (socket) => {
    console.log('a user connected to session ' + socket.id);
    socket.on("message", msg => {
        console.log("received message from app");
        socket.emit("response from server", "hello there --- your message is " + msg + " from sessionid " + socket.id);
    });
    socket.on("register-client", registrationMsg => {
        console.log("received a registration request of data");
        cacheService.registerSessionToCache(socket.id, { token: registrationMsg.token });
        socket.emit("register-server", "hello there --- your message is " + registrationMsg + " from sessionid " + socket.id);
    });
    socket.on("private-message", msgRequest => {
        const sendTo = cacheService.getSessionIdByUserEmail(msgRequest.to);
        console.log(`received private-message to ${msgRequest.to} with content: ${msgRequest.message} and sessionId: ${sendTo}`);
        socket.to(sendTo).emit("private-message-from-server", { from: jwtDecode(msgRequest.token), message: msgRequest.message });
    });
    socket.on("confirm-contact-request", contactRequest => {
        const sendTo = cacheService.getSessionIdByUserEmail(contactRequest.to);
        console.log(`received confirm-contact-request to ${contactRequest.to} with content: ${contactRequest.message} and sessionId: ${sendTo}`);
    });
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
