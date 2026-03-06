# ⚙️ Backend Guide — Cosmic Watch

## Table of Contents

- [Project Structure](#project-structure)
- [Application Bootstrap](#application-bootstrap)
- [Middleware Pipeline](#middleware-pipeline)
- [Route → Controller → Service Pattern](#route--controller--service-pattern)
- [Services Layer](#services-layer)
- [Scheduled Jobs](#scheduled-jobs)
- [WebSocket Architecture](#websocket-architecture)
- [Error Handling](#error-handling)
- [Environment Configuration](#environment-configuration)

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection with retry logic
│   │   ├── nasa.js            # NASA API base URL, key, endpoints
│   │   ├── jwt.js             # Token secrets, expiry durations
│   │   └── cors.js            # Allowed origins configuration
│   │
│   ├── models/
│   │   ├── User.js            # User schema + password methods
│   │   ├── Asteroid.js        # Cached asteroid data schema
│   │   ├── Watchlist.js       # User-asteroid tracking
│   │   ├── Alert.js           # Notification schema
│   │   └── ChatMessage.js     # Chat message schema (bonus)
│   │
│   ├── routes/
│   │   ├── index.js           # Route aggregator
│   │   ├── auth.routes.js     # /auth/*
│   │   ├── asteroid.routes.js # /asteroids/*
│   │   ├── user.routes.js     # /users/*
│   │   ├── alert.routes.js    # /alerts/*
│   │   └── chat.routes.js     # /chat/* (bonus)
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── asteroid.controller.js
│   │   ├── user.controller.js
│   │   ├── alert.controller.js
│   │   └── chat.controller.js
│   │
│   ├── services/
│   │   ├── nasa.service.js     # NASA API calls + data transformation
│   │   ├── risk.service.js     # Risk scoring algorithm
│   │   ├── auth.service.js     # Token gen, password verification
│   │   ├── alert.service.js    # Alert creation + evaluation
│   │   └── chat.service.js     # Message CRUD (bonus)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── validate.middleware.js # Joi schema validation
│   │   ├── rateLimiter.js       # Rate limiting config
│   │   ├── errorHandler.js      # Global error handler
│   │   └── logger.js            # Morgan HTTP logging
│   │
│   ├── jobs/
│   │   ├── dataRefresh.job.js   # Fetch NASA data periodically
│   │   ├── alertCheck.job.js    # Evaluate alert triggers
│   │   └── cleanup.job.js       # TTL-based data cleanup
│   │
│   ├── sockets/
│   │   ├── index.js             # Socket.io initialisation
│   │   ├── chat.socket.js       # Chat room handlers
│   │   └── notification.socket.js # Alert push handlers
│   │
│   ├── utils/
│   │   ├── apiResponse.js       # Standardised response helpers
│   │   ├── validators.js        # Joi schemas for all routes
│   │   ├── constants.js         # Risk weights, thresholds
│   │   └── helpers.js           # Date formatting, parsing
│   │
│   └── app.js                   # Express app configuration
│
├── server.js                    # Entry point (HTTP + Socket.io)
├── .env
├── package.json
└── Dockerfile
```

---

## Application Bootstrap

```javascript
// server.js — Entry Point
import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { initializeSocketIO } from "./src/sockets/index.js";
import { startScheduledJobs } from "./src/jobs/index.js";

const PORT = process.env.PORT || 5000;

// 1. Create HTTP server
const server = http.createServer(app);

// 2. Attach Socket.io
const io = new SocketServer(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});
initializeSocketIO(io);

// 3. Connect database
await connectDatabase();

// 4. Start cron jobs
startScheduledJobs();

// 5. Listen
server.listen(PORT, () => {
  console.log(`🚀 Cosmic Watch API running on port ${PORT}`);
});
```

```javascript
// src/app.js — Express Configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { corsConfig } from "./config/cors.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Security & Performance Middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

// API Routes
app.use("/api/v1", routes);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
```

---

## Middleware Pipeline

```
Incoming Request
    │
    ├── 1. helmet()           → Security headers
    ├── 2. cors()             → Cross-origin access control
    ├── 3. compression()      → Gzip response compression
    ├── 4. morgan()           → HTTP request logging
    ├── 5. express.json()     → Body parsing
    │
    ├── [Route-specific middleware]
    │   ├── rateLimiter       → Per-route rate limits
    │   ├── authMiddleware    → JWT token verification
    │   └── validateMiddleware → Request body validation
    │
    ├── Controller            → Request handling
    ├── Service               → Business logic
    │
    └── errorHandler          → Catch-all error formatting
```

### Auth Middleware Example

```javascript
// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { code: "NO_TOKEN", message: "Access token required" },
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token expired or invalid" },
    });
  }
};
```

---

## Route → Controller → Service Pattern

Each feature follows a clean three-layer separation:

```
Route (defines endpoint + middleware)
  → Controller (handles HTTP request/response)
    → Service (contains business logic)
      → Model (database interaction)
```

### Example: Get Asteroid Feed

**Route**:

```javascript
// routes/asteroid.routes.js
router.get(
  "/feed",
  authMiddleware,
  validate(feedSchema),
  asteroidController.getFeed,
);
```

**Controller**:

```javascript
// controllers/asteroid.controller.js
export const getFeed = async (req, res, next) => {
  try {
    const { start_date, end_date, hazardous, sort_by, order, page, limit } =
      req.query;
    const result = await asteroidService.getAsteroidFeed(start_date, end_date, {
      hazardous,
      sort_by,
      order,
      page,
      limit,
    });
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (error) {
    next(error);
  }
};
```

**Service**:

```javascript
// services/nasa.service.js
export const getAsteroidFeed = async (startDate, endDate, options) => {
  // 1. Check MongoDB cache
  let asteroids = await Asteroid.find({
    /* date range query */
  });

  // 2. Cache miss → fetch from NASA
  if (!asteroids.length) {
    const nasaData = await axios.get(`${NASA_BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY,
      },
    });
    asteroids = transformNasaData(nasaData.data);
    await Asteroid.insertMany(asteroids, { ordered: false });
  }

  // 3. Calculate risk scores
  asteroids = asteroids.map((a) => ({
    ...a,
    ...riskService.calculateRisk(a),
  }));

  // 4. Apply filters, sorting, pagination
  return applyFiltersAndPagination(asteroids, options);
};
```

---

## Services Layer

### NASA Service (`nasa.service.js`)

- Fetches data from NASA NeoWs API
- Transforms NASA's response format to our schema
- Caches results in MongoDB with TTL
- Handles API errors with fallback to cached data

### Risk Service (`risk.service.js`)

- Computes composite risk scores (0-100)
- Classifies into risk categories
- Weighted algorithm using distance, size, velocity, hazard status
- See [RISK_ANALYSIS_ENGINE.md](./RISK_ANALYSIS_ENGINE.md) for full algorithm

### Auth Service (`auth.service.js`)

- Password hashing with bcrypt (12 rounds)
- JWT access token generation (15 min expiry)
- JWT refresh token generation (7 day expiry)
- Token verification and refresh flow

### Alert Service (`alert.service.js`)

- Evaluates user alert thresholds against asteroid data
- Creates alert documents when thresholds exceeded
- Pushes real-time alerts via Socket.io to online users
- Manages alert read status

### Chat Service (`chat.service.js`) — Bonus

- CRUD operations for chat messages
- Pagination with cursor-based approach
- Message sanitisation
- Soft delete support

---

## Scheduled Jobs

```javascript
// jobs/index.js
import cron from "node-cron";
import { refreshAsteroidData } from "./dataRefresh.job.js";
import { checkAlertTriggers } from "./alertCheck.job.js";
import { cleanupExpiredData } from "./cleanup.job.js";

export const startScheduledJobs = () => {
  // Refresh NASA data every 6 hours
  cron.schedule("0 */6 * * *", refreshAsteroidData);

  // Check alert triggers every 30 minutes
  cron.schedule("*/30 * * * *", checkAlertTriggers);

  // Clean up expired cache daily at midnight
  cron.schedule("0 0 * * *", cleanupExpiredData);

  console.log("📅 Scheduled jobs initialized");
};
```

---

## WebSocket Architecture

```javascript
// sockets/index.js
export const initializeSocketIO = (io) => {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.user.id}`);

    // Join personal notification room
    socket.join(`user:${socket.user.id}`);

    // Register chat handlers
    registerChatHandlers(io, socket);

    // Register notification handlers
    registerNotificationHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected: ${socket.user.id}`);
    });
  });
};
```

---

## Error Handling

```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  };

  // Include validation details if present
  if (err.details) response.error.details = err.details;

  // Log server errors
  if (statusCode >= 500) {
    console.error("❌ Server Error:", err);
  }

  res.status(statusCode).json(response);
};

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
```

---

## Environment Configuration

```env
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cosmicwatch

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# NASA API
NASA_API_KEY=your-nasa-api-key
NASA_BASE_URL=https://api.nasa.gov/neo/rest/v1

# Client
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

> **Next**: [AUTHENTICATION.md](./AUTHENTICATION.md) for auth flow details →
