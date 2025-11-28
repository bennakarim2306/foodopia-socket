import express, { Express, Request, Response } from "express"
import { createServer } from "http";
import { Server } from 'socket.io'
const jwtDecode = require("jwt-decode").jwtDecode;
const cacheService = require("./caching/cacheService").cachingService
import {ContactNotificationApi} from "./rest/v1/contactNotificationApi"
import { testRedisConnection } from "./config/testRedisConnection"

const app: Express = express();
const server = createServer(app);
const io = new Server(server);
const contactNotificationApi = new ContactNotificationApi(app, io)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.on('connect', (socket) => {
  console.log('a user connected to session ' + socket.id);
  socket.on("message", msg => {
    console.log("received message from app")
    socket.emit("response from server", "hello there --- your message is " + msg + " from sessionid " + socket.id)
  })
  socket.on("register-client", async (registrationMsg) => {
    console.log("received a registration request of data")
    await cacheService.registerSessionToCache(socket.id, {token: registrationMsg.token})
    socket.emit("register-server", "hello there --- your message is " + registrationMsg + " from sessionid " + socket.id)
  })
  socket.on("private-message", async (msgRequest) => {
    const sendTo = await cacheService.getSessionIdByUserEmail(msgRequest.to)
    console.log(`received private-message to ${msgRequest.to} with content: ${msgRequest.message} and sessionId: ${sendTo}`)
    if (sendTo) {
      socket.to(sendTo).emit("private-message-from-server", {from: jwtDecode(msgRequest.token), message: msgRequest.message})
    }
  })
  socket.on("confirm-contact-request", async (contactRequest) => {
    const sendTo = await cacheService.getSessionIdByUserEmail(contactRequest.to)
    console.log(`received confirm-contact-request to ${contactRequest.to} with content: ${contactRequest.message} and sessionId: ${sendTo}`)
  })
});

const PORT = process.env.PORT || 3000;

// Test Redis connection before starting server
testRedisConnection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server due to Redis connection error:', error);
    process.exit(1);
  });

