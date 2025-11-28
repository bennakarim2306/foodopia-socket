# Foodopia Socket Backend

A real-time WebSocket backend service built with TypeScript, Express, and Socket.IO for handling real-time communication and contact notifications in the Foodopia application.

## 🚀 Features

- **Real-time WebSocket Communication**: Bi-directional communication using Socket.IO
- **Private Messaging**: Send private messages between users
- **Contact Notifications**: REST API for contact request notifications
- **Session Management**: User session tracking with JWT authentication
- **In-Memory Caching**: Fast session lookup using node-cache
- **TypeScript Support**: Full TypeScript implementation for type safety

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- JWT tokens for authentication

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/bennakarim2306/foodopia-socket.git
cd foodopia-socket
```

2. Install dependencies:
```bash
npm install
```

3. Build TypeScript files:
```bash
npx tsc
```

## 🏃 Running the Application

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Documentation

### WebSocket Events

#### Client → Server Events

**`register-client`**
- Register a client session with JWT token
- Payload: `{ token: string }`
- Response: `register-server` event with confirmation

**`message`**
- Send a general message to the server
- Payload: `string`
- Response: `response from server` event

**`private-message`**
- Send a private message to another user
- Payload: 
  ```typescript
  {
    to: string,        // recipient email
    message: string,   // message content
    token: string      // sender's JWT token
  }
  ```
- Response: `private-message-from-server` event sent to recipient

**`confirm-contact-request`**
- Confirm a contact request
- Payload:
  ```typescript
  {
    to: string,        // recipient email
    message: string
  }
  ```

#### Server → Client Events

**`connect`**
- Emitted when client successfully connects
- Includes session ID

**`register-server`**
- Confirmation of client registration

**`response from server`**
- Response to general messages

**`private-message-from-server`**
- Incoming private message
- Payload:
  ```typescript
  {
    from: object,      // decoded JWT token info
    message: string
  }
  ```

**`contact-notification`**
- Contact request notification
- Payload:
  ```typescript
  {
    type: "contact_notification",
    timestamp: string,
    from: string       // sender email
  }
  ```

### REST API Endpoints

#### POST `/rest/v1/contact-notification`

Send a contact notification to a specific user.

**Request Body:**
```json
{
  "sender": "sender@example.com",
  "receiver": "receiver@example.com",
  "timestamp": "2025-11-28T12:00:00Z"
}
```

**Response:**
- Status: `200 OK`
- Body: `"ok"`

## 🏗️ Project Structure

```
foodopia-socket/
├── src/
│   ├── index.ts                    # Main server entry point
│   ├── caching/
│   │   ├── cacheService.ts         # Cache service implementation
│   │   └── cacheService.js
│   ├── config/
│   │   ├── cacheConfig.ts          # Cache configuration
│   │   └── cacheConfig.js
│   ├── rest/
│   │   └── v1/
│   │       ├── contactNotificationApi.ts  # REST API endpoints
│   │       └── contactNotificationApi.js
│   └── service/                    # Service layer (planned)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Technologies Used

- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **TypeScript** - Type-safe JavaScript
- **node-cache** - In-memory caching
- **jwt-decode** - JWT token decoding

## 🔐 Authentication

The application uses JWT tokens for authentication. Tokens should be passed in the `register-client` event payload and `private-message` events. The token's `sub` field is used as the user identifier (email).

## 📝 Development

### TypeScript Configuration

The project uses TypeScript with the following key settings:
- Target: ES2016
- Module: CommonJS
- Strict mode enabled
- Root directory: `./src`

### Build

Compile TypeScript to JavaScript:
```bash
npx tsc
```

## 📄 License

ISC

## 👤 Author

**Karim Benna**

## 🐛 Issues

Report bugs at: [https://github.com/bennakarim2306/foodopia-socket/issues](https://github.com/bennakarim2306/foodopia-socket/issues)

## 🔗 Repository

[https://github.com/bennakarim2306/foodopia-socket](https://github.com/bennakarim2306/foodopia-socket)
