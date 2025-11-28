import express , { Express, Request, Response } from "express";
import jwtDecode from "jwt-decode";
import { cachingService as cacheService } from "../../caching/cacheService";
import util from 'util';

class ContactNotificationApi {
  private io: any;

  constructor(private app: Express, io: any) {
    this.io = io;
    this.init();
  }

  private init() {
    this.app.use(express.json());

    this.app.post("/rest/v1/contact-notification", async (req: Request, res: Response) => {
      const contactNotification = req.body;
      console.log(`received body ${util.inspect(contactNotification, { depth: null })}`);
      const sessionIds = await cacheService.getSessionIdByUserEmail(contactNotification.receiver);
      console.log(`received contact notification for ${contactNotification.receiver} with sessionId: ${sessionIds}, from ${contactNotification.sender}`);
      if (sessionIds) {
        this.io.to(sessionIds).emit("contact-notification", {
          type: "contact_notification",
          timestamp: contactNotification.timestamp,
          from: contactNotification.sender
        });
      }
      res.status(200).send("ok");
    });
  }

  public sendContactRequestConfirmation(contactRequest: any) {
    // Implementation for sending contact request confirmation
  }
}

export { ContactNotificationApi };