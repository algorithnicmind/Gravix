# 💬 Real-Time Chat — Cosmic Watch (Bonus Feature)

## Overview

Community discussion threads tied to specific asteroids, enabling researchers and enthusiasts to discuss observations, share analysis, and collaborate in real-time using **Socket.io** WebSockets.

---

## Architecture

```
Client A                     Server                      Client B
   │                           │                            │
   │  socket.emit('join',      │                            │
   │  { asteroidId })          │                            │
   │ ─────────────────────────►│                            │
   │                           │── Join room                │
   │                           │   'asteroid:3542519'       │
   │                           │                            │
   │  socket.emit('message',   │                            │
   │  { asteroidId, text })    │                            │
   │ ─────────────────────────►│                            │
   │                           │── Save to MongoDB          │
   │                           │── Broadcast to room        │
   │                           │                            │
   │                           │  socket.emit('message',    │
   │                           │  { userId, text, ... })    │
   │                           │ ──────────────────────────►│
   │                           │                            │
```

---

## Socket Events

### Client → Server

| Event          | Payload                | Description                   |
| -------------- | ---------------------- | ----------------------------- |
| `chat:join`    | `{ asteroidId }`       | Join asteroid discussion room |
| `chat:leave`   | `{ asteroidId }`       | Leave room                    |
| `chat:message` | `{ asteroidId, text }` | Send message to room          |
| `chat:typing`  | `{ asteroidId }`       | Typing indicator              |

### Server → Client

| Event             | Payload                                      | Description       |
| ----------------- | -------------------------------------------- | ----------------- |
| `chat:message`    | `{ _id, userId, userName, text, createdAt }` | New message       |
| `chat:userJoined` | `{ userId, userName }`                       | User entered room |
| `chat:userLeft`   | `{ userId, userName }`                       | User left room    |
| `chat:typing`     | `{ userId, userName }`                       | Someone is typing |

---

## Message Schema

```javascript
{
  _id: ObjectId,
  asteroidId: "3542519",          // Room identifier
  userId: ObjectId (ref: User),
  userName: "Ankit Sharma",
  text: "Has anyone observed this from a telescope?",
  isDeleted: false,
  createdAt: "2026-02-12T15:30:00Z"
}
```

---

## API Endpoints

### GET `/chat/:asteroidId/messages`

🔒 Protected — Fetch message history with pagination.

**Query**: `page=1`, `limit=50`, `before=<messageId>` (cursor)

**Response**:

```json
{
  "success": true,
  "data": {
    "messages": [
      { "_id": "...", "userName": "Ankit", "text": "...", "createdAt": "..." }
    ],
    "hasMore": true
  }
}
```

---

## UI Components

### ChatThread.jsx

- Displays messages in chronological order
- Auto-scrolls to latest message
- Infinite scroll up for history
- Shows user avatars and timestamps

### ChatMessage.jsx

- Message bubble with sender name, text, time
- Own messages styled differently (right-aligned)
- Delete button for own messages

### ChatInput.jsx

- Text input with send button
- Enter to send, Shift+Enter for newline
- Typing indicator display
- Character limit (1000 chars)

---

## Features

- **Room-based**: Each asteroid has its own discussion thread
- **Real-time**: Messages appear instantly via WebSocket
- **History**: Paginated message history from MongoDB
- **Typing indicators**: See when others are typing
- **Presence**: Online/offline user indicators in room
- **Moderation**: Users can delete their own messages
- **Sanitisation**: XSS prevention on message content

---

> **Next**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Docker deployment →
