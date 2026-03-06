# 🗺️ Roadmap — Cosmic Watch

## Development Phases

---

## Phase 1: Foundation (Day 1)

> **Goal**: Project setup, core infrastructure, database, and authentication

### Tasks

- [x] Initialize Git repository
- [x] Create comprehensive documentation (DOCS/)
- [ ] Set up backend project (Express.js + Mongoose)
- [ ] Set up frontend project (React + Vite)
- [ ] Configure ESLint, Prettier
- [ ] Set up MongoDB connection with retry logic
- [ ] Implement User model and schema
- [ ] Build authentication system (register, login, JWT)
- [ ] Create auth middleware
- [ ] Set up CORS, Helmet, rate limiting
- [ ] Implement basic error handling middleware
- [ ] Create `.env.example` and environment config

### Deliverables

- ✅ Working auth endpoints (`/auth/register`, `/auth/login`, `/auth/refresh`)
- ✅ Protected route middleware
- ✅ Database connection

---

## Phase 2: Core Data (Day 1-2)

> **Goal**: NASA API integration, asteroid data pipeline, and risk engine

### Tasks

- [ ] Create NASA service (API calls, data transformation)
- [ ] Implement caching layer in MongoDB
- [ ] Build Asteroid model and schema
- [ ] Create asteroid feed endpoint (`GET /asteroids/feed`)
- [ ] Create asteroid lookup endpoint (`GET /asteroids/:id`)
- [ ] Build Risk Analysis Engine (scoring algorithm)
- [ ] Add risk scores to API responses
- [ ] Handle NASA API errors with graceful fallback
- [ ] Set up data refresh cron job

### Deliverables

- ✅ Live asteroid data from NASA NeoWs
- ✅ Risk scoring with 5 categories
- ✅ Cached data with TTL

---

## Phase 3: Frontend Core (Day 2)

> **Goal**: Dashboard UI, asteroid feed, and data visualisation

### Tasks

- [ ] Create design system (CSS variables, global styles)
- [ ] Build Layout components (Navbar, Footer, ProtectedRoute)
- [ ] Create Landing Page with animations
- [ ] Build Login/Register pages
- [ ] Implement AuthContext (state management)
- [ ] Build Dashboard page
  - [ ] Stats overview cards
  - [ ] Asteroid feed with cards
  - [ ] Filter bar and sort controls
  - [ ] Risk distribution chart (Chart.js)
- [ ] Build Asteroid Detail page
  - [ ] Metrics panel
  - [ ] Risk score radial
  - [ ] Size comparison visual
  - [ ] Close approach history table
- [ ] Set up API service layer (Axios + interceptors)
- [ ] Implement responsive design

### Deliverables

- ✅ Fully functional dashboard
- ✅ Asteroid detail view
- ✅ Interactive data visualisations

---

## Phase 4: Watchlist & Alerts (Day 2-3)

> **Goal**: User personalisation features

### Tasks

- [ ] Implement Watchlist model and endpoints
- [ ] Build Watchlist page (frontend)
- [ ] Add "Watch" toggle button on asteroid cards
- [ ] Implement Alert model and endpoints
- [ ] Build alert evaluation cron job
- [ ] Create Alert notification system
- [ ] Build Alerts page (frontend)
- [ ] Build AlertBell component with unread count
- [ ] Build Profile page with alert preferences
- [ ] Implement user preference persistence

### Deliverables

- ✅ Watchlist CRUD
- ✅ Automated alert generation
- ✅ Dashboard notification bell

---

## Phase 5: Real-Time Features (Day 3)

> **Goal**: WebSocket integration for live updates and chat

### Tasks

- [ ] Set up Socket.io on backend
- [ ] Implement real-time alert delivery
- [ ] Build chat service and model (Bonus)
- [ ] Create chat WebSocket handlers (Bonus)
- [ ] Build ChatThread component (Bonus)
- [ ] Implement typing indicators (Bonus)
- [ ] Add message history with pagination (Bonus)

### Deliverables

- ✅ Real-time alert notifications
- ✅ Community chat threads (Bonus)

---

## Phase 6: 3D Visualisation (Day 3, Bonus)

> **Goal**: Interactive orbital view

### Tasks

- [ ] Set up React Three Fiber
- [ ] Create Earth model with textures
- [ ] Render asteroid orbit paths
- [ ] Add asteroid markers with risk colours
- [ ] Implement camera controls
- [ ] Build control panel UI
- [ ] Add click-to-select interaction
- [ ] Optimise rendering performance

### Deliverables

- ✅ Interactive 3D solar system view (Bonus)

---

## Phase 7: DevOps & Polish (Day 3-4)

> **Goal**: Docker deployment, testing, documentation

### Tasks

- [ ] Write backend Dockerfile
- [ ] Write frontend Dockerfile + Nginx config
- [ ] Create docker-compose.yml
- [ ] Test full Docker deployment
- [ ] Write unit tests (risk engine, auth service)
- [ ] Write integration tests (API endpoints)
- [ ] Write frontend component tests
- [ ] Create Postman collection
- [ ] Create AI-LOG.md
- [ ] Final documentation review
- [ ] Bug fixes and UI polish
- [ ] Lighthouse audit and performance optimisation

### Deliverables

- ✅ Containerised deployment
- ✅ Test suite with >80% coverage
- ✅ Postman collection
- ✅ Production-ready application

---

## Timeline Summary

```
Day 1:  Phase 1 (Foundation) + Phase 2 (Core Data)
Day 2:  Phase 3 (Frontend Core) + Phase 4 (Watchlist/Alerts)
Day 3:  Phase 5 (Real-Time) + Phase 6 (3D, Bonus)
Day 4:  Phase 7 (DevOps, Testing, Polish)
```

---

## Priority Matrix

| Priority | Feature                        | Phase  |
| -------- | ------------------------------ | ------ |
| 🔴 P0    | Auth, NASA API, Dashboard      | 1-3    |
| 🟡 P1    | Risk Engine, Alerts, Watchlist | 2, 4   |
| 🟢 P2    | 3D View, Chat, Polish          | 5, 6   |
| ⚪ P3    | Advanced analytics, Export     | Future |

---

> **Next**: [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines →
