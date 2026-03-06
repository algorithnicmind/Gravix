# 🏗️ Architecture — Cosmic Watch

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Pattern](#architecture-pattern)
- [High-Level Architecture](#high-level-architecture)
- [Component Architecture](#component-architecture)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Communication Patterns](#communication-patterns)
- [Deployment Architecture](#deployment-architecture)
- [Scalability Considerations](#scalability-considerations)
- [Error Handling Strategy](#error-handling-strategy)

---

## System Overview

Cosmic Watch follows a **three-tier architecture** with clear separation between the presentation layer (React), business logic layer (Node.js/Express), and data layer (MongoDB). External data is sourced from NASA's NeoWs API and processed through a custom Risk Analysis Engine.

### Architecture Principles

1. **Separation of Concerns** — Frontend and backend are independently deployable
2. **API-First Design** — All communication via well-defined RESTful endpoints
3. **Stateless Backend** — JWT-based auth eliminates server-side session state
4. **Caching Strategy** — Multi-layer caching to minimize external API calls
5. **Event-Driven** — WebSocket for real-time features; cron for scheduled tasks
6. **Container-Ready** — Every component runs in its own Docker container

---

## Architecture Pattern

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│                                                                 │
│  React SPA (Vite)                                               │
│  ├── Pages (Dashboard, 3D View, Alerts, Chat, Profile)          │
│  ├── Components (AsteroidCard, RiskMeter, AlertBell, etc.)      │
│  ├── Services (API calls via Axios)                             │
│  ├── Context (AuthContext, AsteroidContext, ThemeContext)        │
│  └── Hooks (useAsteroids, useAlerts, useWebSocket)              │
│                                                                 │
├─────────────────────────┬───────────────────────────────────────┤
│     REST API (HTTP)     │     WebSocket (Socket.io)             │
├─────────────────────────┴───────────────────────────────────────┤
│                     BUSINESS LOGIC LAYER                        │
│                                                                 │
│  Express.js Server                                              │
│  ├── Routes (auth, asteroids, alerts, chat, users)              │
│  ├── Controllers (request handling, response formatting)        │
│  ├── Services (business logic, data processing)                 │
│  │   ├── NasaService (API integration, data transformation)     │
│  │   ├── RiskService (scoring algorithm, classification)        │
│  │   ├── AlertService (threshold checking, notification)        │
│  │   └── ChatService (message handling, room management)        │
│  ├── Middleware (auth, validation, rate-limiting, error)         │
│  ├── Jobs (cron-based data refresh, alert scheduling)           │
│  └── Sockets (real-time event handlers)                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     DATA ACCESS LAYER                           │
│                                                                 │
│  Mongoose ODM                                                   │
│  ├── Models (User, Asteroid, Alert, ChatMessage, Watchlist)     │
│  ├── Queries (CRUD operations, aggregations)                    │
│  └── Indexes (performance optimization)                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     DATA STORAGE LAYER                          │
│                                                                 │
│  MongoDB Database                                               │
│  ├── Collections (users, asteroids, alerts, messages, etc.)     │
│  └── Indexes (compound, text, TTL)                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     EXTERNAL SERVICES                           │
│                                                                 │
│  NASA NeoWs API                                                 │
│  └── RESTful endpoints for NEO data                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## High-Level Architecture

### System Context Diagram

```
                    ┌─────────────┐
                    │   End User  │
                    │  (Browser)  │
                    └──────┬──────┘
                           │ HTTPS
                           ▼
                    ┌──────────────┐
                    │    Nginx     │
                    │  (Reverse    │
                    │   Proxy)     │
                    └───┬─────┬───┘
                        │     │
              ┌─────────┘     └──────────┐
              ▼                          ▼
    ┌─────────────────┐       ┌─────────────────┐
    │     Frontend     │       │     Backend      │
    │   React (Vite)   │       │  Node.js/Express │
    │                  │       │                  │
    │   Port: 3000     │       │   Port: 5000     │
    └─────────────────┘       └──────┬───────────┘
                                     │
                          ┌──────────┼──────────┐
                          ▼          ▼          ▼
              ┌───────────────┐ ┌────────┐ ┌──────────┐
              │   MongoDB     │ │ NASA   │ │  Redis   │
              │               │ │ NeoWs  │ │ (Cache)  │
              │  Port: 27017  │ │  API   │ │ Optional │
              └───────────────┘ └────────┘ └──────────┘
```

### Container Diagram (Docker)

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network: cosmic-network            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  cosmic-ui    │  │ cosmic-api   │  │  cosmic-db       │   │
│  │              │  │              │  │                  │   │
│  │  React App   │  │  Express API │  │  MongoDB 7       │   │
│  │  + Nginx     │  │  + Socket.io │  │                  │   │
│  │              │  │  + Cron Jobs │  │  Volume:         │   │
│  │  Port: 3000  │  │  Port: 5000  │  │  cosmic-data     │   │
│  │              │  │              │  │  Port: 27017     │   │
│  │  Depends on: │  │  Depends on: │  │                  │   │
│  │  cosmic-api  │  │  cosmic-db   │  │                  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components

```
App
├── Layout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── NavLinks
│   │   ├── AlertBell (notification count)
│   │   └── UserMenu (avatar, dropdown)
│   ├── Sidebar (optional, collapsible)
│   └── Footer
│
├── Pages
│   ├── LandingPage
│   │   ├── HeroSection
│   │   ├── FeaturesGrid
│   │   └── CTASection
│   │
│   ├── AuthPages
│   │   ├── LoginPage
│   │   └── RegisterPage
│   │
│   ├── DashboardPage
│   │   ├── StatsOverview (total NEOs, hazardous count, closest approach)
│   │   ├── AsteroidFeed
│   │   │   ├── DateRangePicker
│   │   │   ├── FilterBar (hazard status, distance, size)
│   │   │   ├── SortControls (by risk, distance, size, date)
│   │   │   └── AsteroidCardList
│   │   │       └── AsteroidCard (name, risk badge, key metrics)
│   │   ├── RiskDistributionChart (pie/bar chart)
│   │   └── CloseApproachTimeline
│   │
│   ├── AsteroidDetailPage
│   │   ├── AsteroidHeader (name, ID, hazard badge)
│   │   ├── OrbitViewer3D (Three.js - Bonus)
│   │   ├── MetricsPanel
│   │   │   ├── DistanceGauge
│   │   │   ├── VelocityMeter
│   │   │   ├── SizeComparison
│   │   │   └── RiskScoreRadial
│   │   ├── ApproachHistoryTable
│   │   ├── WatchlistToggle
│   │   └── ChatThread (Bonus)
│   │
│   ├── WatchlistPage
│   │   ├── WatchlistGrid
│   │   │   └── WatchlistCard
│   │   └── AlertConfigPanel
│   │
│   ├── AlertsPage
│   │   ├── AlertFilters
│   │   └── AlertList
│   │       └── AlertItem
│   │
│   ├── VisualizationPage (Bonus)
│   │   ├── SolarSystemView
│   │   ├── ControlPanel
│   │   └── InfoOverlay
│   │
│   └── ProfilePage
│       ├── ProfileForm
│       └── NotificationSettings
│
└── Shared Components
    ├── RiskBadge
    ├── LoadingSpinner
    ├── ErrorBoundary
    ├── Toast/Notification
    ├── Modal
    ├── Pagination
    └── ProtectedRoute
```

### Backend Module Architecture

```
server/src/
├── config/
│   ├── database.js          # MongoDB connection setup
│   ├── nasa.js              # NASA API configuration
│   ├── jwt.js               # JWT secret and options
│   └── cors.js              # CORS configuration
│
├── models/
│   ├── User.js              # User schema with watchlist
│   ├── Asteroid.js          # Cached asteroid data
│   ├── Alert.js             # User alerts and notifications
│   ├── ChatMessage.js       # Chat message schema
│   └── AuditLog.js          # System activity logging
│
├── routes/
│   ├── auth.routes.js       # POST /auth/register, /auth/login, /auth/refresh
│   ├── asteroid.routes.js   # GET /asteroids/feed, /asteroids/:id, /asteroids/search
│   ├── user.routes.js       # GET/PUT /users/profile, /users/watchlist
│   ├── alert.routes.js      # GET/POST/DELETE /alerts
│   └── chat.routes.js       # GET /chat/:asteroidId/messages
│
├── controllers/
│   ├── auth.controller.js
│   ├── asteroid.controller.js
│   ├── user.controller.js
│   ├── alert.controller.js
│   └── chat.controller.js
│
├── services/
│   ├── nasa.service.js      # NASA API interaction + data transformation
│   ├── risk.service.js      # Risk scoring algorithm
│   ├── alert.service.js     # Alert evaluation and creation
│   ├── auth.service.js      # Token generation, password hashing
│   └── chat.service.js      # Chat message management
│
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── validate.middleware.js # Request body validation
│   ├── rateLimiter.js       # API rate limiting
│   ├── errorHandler.js      # Global error handling
│   └── logger.js            # Request logging (Morgan)
│
├── jobs/
│   ├── dataRefresh.job.js   # Periodic NASA data fetch
│   ├── alertCheck.job.js    # Check for alert triggers
│   └── cleanup.job.js       # Old data/session cleanup
│
├── sockets/
│   ├── index.js             # Socket.io initialization
│   ├── chat.socket.js       # Chat event handlers
│   └── notification.socket.js # Real-time alert delivery
│
├── utils/
│   ├── apiResponse.js       # Standardised API response format
│   ├── validators.js        # Joi/Zod validation schemas
│   ├── constants.js         # Application constants
│   └── helpers.js           # General utility functions
│
└── app.js                   # Express application setup
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌──────────┐     POST /auth/register     ┌──────────────┐
│          │ ──────────────────────────► │ Auth         │
│  Client  │     { email, password,      │ Controller   │
│          │       name }                │              │
│          │                             └──────┬───────┘
│          │                                    │
│          │                                    ▼
│          │                             ┌──────────────┐
│          │                             │ Auth         │
│          │                             │ Service      │
│          │                             │              │
│          │                             │ 1. Validate  │
│          │                             │ 2. Hash pwd  │
│          │                             │ 3. Create    │
│          │                             │    user      │
│          │                             │ 4. Generate  │
│          │                             │    JWT       │
│          │                             └──────┬───────┘
│          │                                    │
│          │     { token, user }                │
│          │ ◄──────────────────────────────────┘
│          │
│          │     GET /asteroids/feed
│          │ ──────────────────────────►  [Auth Middleware]
│          │     Authorization:                 │
│          │     Bearer <token>           Verify JWT
│          │                                    │
│          │                                    ▼
│          │                              [Controller]
└──────────┘
```

### 2. Asteroid Data Flow

```
┌──────────┐                ┌──────────────┐              ┌──────────────┐
│  Client  │  GET /feed     │   Asteroid   │  Check Cache │   MongoDB    │
│          │ ──────────────►│  Controller  │ ────────────►│  (asteroids) │
│          │  ?start=...    │              │              │              │
│          │  &end=...      └──────┬───────┘              └───────┬──────┘
│          │                       │                              │
│          │                       │ Cache Miss                   │ Cache Hit
│          │                       ▼                              │
│          │                ┌──────────────┐                      │
│          │                │    NASA      │                      │
│          │                │  Service     │                      │
│          │                │              │                      │
│          │                │ 1. Fetch     │                      │
│          │                │    NeoWs API │                      │
│          │                │ 2. Transform │                      │
│          │                │    data      │                      │
│          │                │ 3. Cache in  │                      │
│          │                │    MongoDB   │                      │
│          │                └──────┬───────┘                      │
│          │                       │                              │
│          │                       ▼                              │
│          │                ┌──────────────┐                      │
│          │                │    Risk      │ ◄────────────────────┘
│          │                │  Service     │
│          │                │              │
│          │                │  Calculate   │
│          │                │  risk scores │
│          │                └──────┬───────┘
│          │                       │
│          │   { asteroids,        │
│          │     risk_scores,      │
│          │     meta }            │
│          │ ◄─────────────────────┘
└──────────┘
```

### 3. Alert System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCHEDULED JOB (every 30 min)                │
│                                                                  │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │  Cron    │    │   Alert      │    │   NASA       │           │
│  │  Job     │───►│   Service    │───►│   Service    │           │
│  └──────────┘    │              │    │              │           │
│                  │ 1. Fetch     │    │  Fetch       │           │
│                  │    upcoming  │    │  upcoming    │           │
│                  │    approaches│    │  asteroid    │           │
│                  │              │    │  data        │           │
│                  │ 2. Get all   │    └──────────────┘           │
│                  │    user alert│                                │
│                  │    configs   │                                │
│                  │              │    ┌──────────────┐           │
│                  │ 3. Compare   │    │  MongoDB     │           │
│                  │    thresholds│───►│              │           │
│                  │              │    │ Save alerts  │           │
│                  │ 4. Generate  │    └──────────────┘           │
│                  │    alerts    │                                │
│                  └──────┬───────┘                                │
│                         │                                        │
│                         ▼                                        │
│                  ┌──────────────┐                                │
│                  │  Socket.io   │                                │
│                  │              │                                │
│                  │  Push alert  │───► Connected users            │
│                  │  to online   │    receive alert               │
│                  │  users       │    in real-time                │
│                  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Real-Time Chat Flow

```
┌──────────┐                          ┌──────────────┐
│ Client A │  socket.emit('join',     │  Socket.io   │
│          │  { asteroidId })         │  Server      │
│          │ ────────────────────────►│              │
│          │                          │  1. Add to   │
│          │                          │     room     │
│          │                          │  2. Broadcast│
│          │                          │     'joined' │
├──────────┤                          │              │
│ Client A │  socket.emit('message',  │  3. Save to  │
│          │  { text, asteroidId })   │     MongoDB  │
│          │ ────────────────────────►│              │
│          │                          │  4. Broadcast│
│          │                          │     to room  │
├──────────┤                          │              │
│ Client B │  socket.on('message',    │              │
│          │  (msg) => { ... })       │              │
│          │ ◄────────────────────────│              │
└──────────┘                          └──────────────┘
```

---

## Communication Patterns

### REST API Communication

- **Protocol**: HTTP/HTTPS
- **Format**: JSON request/response bodies
- **Authentication**: Bearer token in Authorization header
- **Versioning**: URL-based (`/api/v1/...`)
- **Error Format**: Standardised error response object

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date range",
    "details": [{ "field": "startDate", "message": "Must be a valid ISO date" }]
  }
}
```

### WebSocket Communication

- **Library**: Socket.io (with fallback to long-polling)
- **Authentication**: JWT passed during handshake
- **Namespaces**: `/chat`, `/notifications`
- **Rooms**: Asteroid-specific chat rooms (`asteroid:<id>`)

### Cron Job Scheduling

- **Library**: node-cron
- **Data Refresh**: Every 6 hours (`0 */6 * * *`)
- **Alert Check**: Every 30 minutes (`*/30 * * * *`)
- **Data Cleanup**: Daily at midnight (`0 0 * * *`)

---

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Frontend Dev Server (Vite, port 5173)
├── Backend Dev Server (Nodemon, port 5000)
└── MongoDB (local or Docker, port 27017)
```

### Production Environment (Docker)

```
Docker Host
├── Nginx (reverse proxy, SSL termination)
│   ├── / → cosmic-ui:3000
│   └── /api → cosmic-api:5000
├── cosmic-ui (React + Nginx, port 3000)
├── cosmic-api (Node.js, port 5000)
└── cosmic-db (MongoDB, port 27017)
    └── Volume: cosmic-data (persistent storage)
```

### Docker Compose Service Dependencies

```
cosmic-db ──► cosmic-api ──► cosmic-ui
   │              │
   └──── volumes  └──── depends_on: cosmic-db
         cosmic-data
```

---

## Scalability Considerations

### Horizontal Scaling Path

```
Phase 1 (Current): Single Instance
├── 1 × Frontend container
├── 1 × Backend container
└── 1 × MongoDB container

Phase 2 (Growth): Load Balanced
├── N × Frontend containers (behind Nginx LB)
├── N × Backend containers (behind Nginx LB)
├── MongoDB Replica Set (1 primary + 2 secondaries)
└── Redis (shared session/cache store)

Phase 3 (Scale): Microservices
├── API Gateway (Nginx/Kong)
├── Auth Service
├── Asteroid Data Service
├── Risk Analysis Service
├── Alert Service
├── Chat Service
├── MongoDB Sharded Cluster
└── Redis Cluster
```

### Caching Strategy

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  Client   │───►│  In-Memory   │───►│   MongoDB    │───►│  NASA    │
│  (Browser)│    │  Cache (opt) │    │  (DB Cache)  │    │  API     │
│           │    │  Redis/Node  │    │              │    │          │
│  Cache:   │    │              │    │  TTL: 6hrs   │    │  Source  │
│  Browser  │    │  TTL: 30min  │    │              │    │  of      │
│  storage  │    │              │    │              │    │  Truth   │
└──────────┘    └──────────────┘    └──────────────┘    └──────────┘
```

---

## Error Handling Strategy

### Error Classification

| Category       | HTTP Code | Example             | Handling                  |
| -------------- | --------- | ------------------- | ------------------------- |
| Client Error   | 400       | Invalid input       | Return validation details |
| Auth Error     | 401/403   | Invalid token       | Redirect to login         |
| Not Found      | 404       | Asteroid not found  | Friendly message          |
| Rate Limited   | 429       | Too many requests   | Retry-After header        |
| Server Error   | 500       | Unhandled exception | Log + generic message     |
| External Error | 502/503   | NASA API down       | Serve cached data         |

### Graceful Degradation

When NASA's API is unavailable:

1. Serve last-cached data from MongoDB
2. Display "Data may be stale" banner on frontend
3. Queue failed requests for retry
4. Log the outage for monitoring

---

> **Next**: Read [TECH_STACK.md](./TECH_STACK.md) to understand technology choices →
