"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactNotificationApi = void 0;
const express_1 = __importDefault(require("express"));
const cacheService_1 = require("../../caching/cacheService");
const util_1 = __importDefault(require("util"));
class ContactNotificationApi {
    constructor(app, io) {
        this.app = app;
        this.io = io;
        this.init();
    }
    init() {
        this.app.use(express_1.default.json());
        this.app.post("/rest/v1/contact-notification", (req, res) => {
            const contactNotification = req.body;
            console.log(`received body ${util_1.default.inspect(contactNotification, { depth: null })}`);
            const sessionIds = cacheService_1.cachingService.getSessionIdByUserEmail(contactNotification.receiver);
            console.log(`received contact notification for ${contactNotification.receiver} with sessionId: ${sessionIds}, from ${contactNotification.sender}`);
            this.io.to(sessionIds).emit("contact-notification", {
                type: "contact_notification",
                timestamp: contactNotification.timestamp,
                from: contactNotification.sender
            });
            res.status(200).send("ok");
        });
    }
    sendContactRequestConfirmation(contactRequest) {
        // Implementation for sending contact request confirmation
    }
}
exports.ContactNotificationApi = ContactNotificationApi;
