# 🛠️ Tech Stack — Cosmic Watch

## Stack Overview

| Layer            | Technology                                                             | Version   |
| ---------------- | ---------------------------------------------------------------------- | --------- |
| **Frontend**     | React, Vite, React Router, Axios, Chart.js, Three.js, Socket.io-client | 18.x, 5.x |
| **Backend**      | Node.js, Express.js, Socket.io, node-cron, Joi, Helmet                 | 20.x, 4.x |
| **Database**     | MongoDB with Mongoose ODM                                              | 7.x, 8.x  |
| **Auth**         | jsonwebtoken (JWT), bcryptjs                                           | 9.x, 2.x  |
| **External API** | NASA NeoWs API                                                         | v1        |
| **DevOps**       | Docker, Docker Compose, Nginx, GitHub Actions                          | 24.x, 3.8 |
| **Testing**      | Jest, React Testing Library, Supertest                                 | 29.x      |

---

## Frontend Technologies

### React 18 — UI Library

- **Why?**: Component architecture, Virtual DOM for real-time updates, massive ecosystem, Hooks API for clean state management
- **Alternatives Considered**: Vue.js (smaller 3D ecosystem), Angular (heavier), Svelte (smaller community)

### Vite 5 — Build Tool

- **Why?**: Instant HMR, native ESM, 10-100x faster than Webpack, minimal configuration
- Used for both development server and production builds

### React Router v6 — Routing

Routes: `/` (Landing), `/login`, `/register`, `/dashboard`, `/asteroid/:id`, `/watchlist`, `/alerts`, `/visualize`, `/profile`

### Axios — HTTP Client

- JWT interceptor for automatic token attachment
- Response interceptor for 401 handling and token refresh
- Request cancellation and timeout support

### Three.js / React Three Fiber — 3D Rendering (Bonus)

- WebGL abstraction for orbital visualisation
- OrbitControls for camera interaction
- Earth model + elliptical orbit paths + asteroid markers

### Chart.js + react-chartjs-2 — Data Visualisation

- Doughnut (risk distribution), Bar (asteroid count by date), Line (distance trends), Radar (multi-factor risk), Scatter (size vs distance)

### Socket.io-client — Real-Time Communication

Events: `notification:new`, `chat:message`, `chat:userJoined`, `data:refresh`

### Additional Frontend Libraries

- **Framer Motion**: Animations and transitions
- **React-Toastify**: Toast notifications
- **date-fns**: Date manipulation

---

## Backend Technologies

### Node.js 20 LTS — Runtime

- **Why?**: Non-blocking I/O for concurrent NASA API calls, event-driven for WebSocket features, unified JavaScript language

### Express.js 4 — Web Framework

- **Why?**: Minimal, flexible, middleware pattern, battle-tested, Socket.io integration
- **Middleware Pipeline**: CORS → Helmet → Compression → Morgan → Rate Limiter → JSON Parser → Auth → Validation → Route Handler → Error Handler

### Mongoose 8 — MongoDB ODM

- Schema enforcement, built-in validation, pre/post hooks (password hashing), population (joins), index management

### Authentication Stack

- **jsonwebtoken**: Access tokens (15 min) + Refresh tokens (7 days, httpOnly cookie)
- **bcryptjs**: 12 salt rounds for password hashing

### Joi 17 — Input Validation

- Declarative schema-based validation with descriptive errors

### Security Middleware

- **Helmet**: CSP, X-Content-Type-Options, X-Frame-Options, HSTS
- **express-rate-limit**: 100 requests per 15-minute window
- **cors**: Configured allowed origins

### node-cron — Job Scheduling

| Job           | Schedule         | Purpose                 |
| ------------- | ---------------- | ----------------------- |
| Data Refresh  | Every 6 hours    | Fetch latest NASA data  |
| Alert Check   | Every 30 minutes | Evaluate alert triggers |
| Cache Cleanup | Daily midnight   | Remove expired data     |

### Socket.io 4 — WebSocket Server

- Namespaces: `/chat`, `/notifications`
- Room-based broadcasting for asteroid threads
- JWT authentication during handshake

### Logging

- **Morgan**: HTTP request logging (`combined` in prod, `dev` in dev)

---

## Database — MongoDB 7

**Why MongoDB?**

- Flexible schema for varying NASA API data structures
- JSON-native (NASA JSON → BSON documents)
- Aggregation pipeline for analytics
- TTL indexes for auto-expiring cached data
- Free tier on MongoDB Atlas (512MB)

**Collections**:
| Collection | Est. Size | Key Indexes |
|-----------|-----------|-------------|
| `users` | <10K | Unique: email |
| `asteroids` | ~50K | Compound: date+hazardous; TTL |
| `alerts` | ~100K | Compound: userId+createdAt |
| `messages` | ~500K | Compound: asteroidId+createdAt |
| `watchlists` | ~10K | Compound: userId+asteroidId |

---

## External API — NASA NeoWs

| Endpoint          | Purpose                  | Rate Limit |
| ----------------- | ------------------------ | ---------- |
| `GET /feed`       | Asteroids by date range  | ~1000/hr   |
| `GET /neo/{id}`   | Specific asteroid lookup | ~1000/hr   |
| `GET /neo/browse` | Browse all NEOs          | ~1000/hr   |

Base URL: `https://api.nasa.gov/neo/rest/v1`
API Key: Free at [api.nasa.gov](https://api.nasa.gov/)

---

## DevOps & Infrastructure

### Docker Containers

| Service  | Base Image                                        | Approx Size |
| -------- | ------------------------------------------------- | ----------- |
| Frontend | `node:20-alpine` (build) + `nginx:alpine` (serve) | ~25MB       |
| Backend  | `node:20-alpine`                                  | ~150MB      |
| Database | `mongo:7`                                         | ~700MB      |

### Docker Compose v3.8

- Orchestrates all three services on `cosmic-network`
- Volume: `cosmic-data` for MongoDB persistence
- Dependency chain: `cosmic-db` → `cosmic-api` → `cosmic-ui`

---

## Testing Tools

| Tool                  | Layer    | Purpose                    |
| --------------------- | -------- | -------------------------- |
| Jest                  | Both     | Unit & integration testing |
| React Testing Library | Frontend | Component testing          |
| Supertest             | Backend  | HTTP endpoint testing      |
| MongoDB Memory Server | Backend  | In-memory DB for tests     |

---

## Development Tools

| Tool            | Purpose              |
| --------------- | -------------------- |
| ESLint (Airbnb) | Code linting         |
| Prettier        | Code formatting      |
| Nodemon         | Backend auto-restart |
| Postman         | API testing          |
| MongoDB Compass | Database GUI         |

---

## Dependency Summary

### Frontend (`client/package.json`)

**Dependencies**: react, react-dom, react-router-dom, axios, three, @react-three/fiber, @react-three/drei, chart.js, react-chartjs-2, socket.io-client, react-toastify, date-fns, framer-motion

**DevDependencies**: vite, @vitejs/plugin-react, eslint, prettier, @testing-library/react, jest

### Backend (`server/package.json`)

**Dependencies**: express, mongoose, jsonwebtoken, bcryptjs, socket.io, node-cron, axios, joi, helmet, cors, morgan, compression, express-rate-limit, dotenv

**DevDependencies**: nodemon, jest, supertest, mongodb-memory-server, eslint, prettier

---

> **Next**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint reference →
