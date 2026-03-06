# 🚧 Project Progress & Work Log — Cosmic Watch

**Current Status**: 🟡 Phase 1 (Foundation) In Progress
**Last Updated**: 2026-02-12

---

## 📌 Active Tasks

> Focus here for the current session.

- [ ] **Initialize Backend**
  - [ ] `npm init` and install dependencies
  - [ ] Setup Express app structure
  - [ ] Connect to MongoDB
- [ ] **Initialize Frontend**
  - [ ] Create Vite React app
  - [ ] Install Tailwind/CSS framework (if using) or custom styles
  - [ ] Setup Router

---

## 📋 Comprehensive Checklist

### Phase 1: Foundation (Backend & Auth)

- [ ] **Project Setup**
  - [x] Create Documentation (DOCS/)
  - [ ] Setup `.env` and Config files
  - [ ] Configure ESLint/Prettier
- [ ] **Database**
  - [ ] Design User Schema
  - [ ] Design Asteroid Schema
  - [ ] Design Alert/Watchlist Schemas
- [ ] **Authentication API**
  - [ ] POST `/auth/register` (hashing, validation)
  - [ ] POST `/auth/login` (JWT generation)
  - [ ] POST `/auth/refresh` (token rotation)
  - [ ] Middleware: `protectRoute`

### Phase 2: Core Data Engine

- [ ] **NASA Integration**
  - [ ] Service to fetch from NeoWs API
  - [ ] Data transformation utility (normalize JSON)
  - [ ] Caching logic (check DB -> fetch API -> save DB)
- [ ] **Risk Engine**
  - [ ] Implement scoring algorithm (0-100)
  - [ ] Helper functions for size, distance, velocity factors
  - [ ] "Hazardous" status classification

### Phase 3: Frontend Implementation

- [ ] **UI Framework**
  - [ ] Setup Global Styles / CSS Variables
  - [ ] Create reusable components (Card, Button, Badge)
- [ ] **Pages**
  - [ ] Landing Page (Hero, Features)
  - [ ] Auth Pages (Login/Register)
  - [ ] Dashboard (Main feed, stats)
  - [ ] Asteroid Detail (Charts, data)
- [ ] **State Management**
  - [ ] AuthContext (User session)
  - [ ] DataContext (Asteroids, Filters)

### Phase 4: Advanced Features

- [ ] **Watchlist System**
  - [ ] API: Add/Remove Watchlist
  - [ ] UI: Watchlist Page & Toggle Button
- [ ] **Alert System**
  - [ ] Backend: Cron job for checking thresholds
  - [ ] UI: Notifications Bell & List
- [ ] **3D Visualisation (Bonus)**
  - [ ] Setup Three.js scene
  - [ ] Render Earth & Orbit paths
- [ ] **Chat System (Bonus)**
  - [ ] Setup Socket.io server
  - [ ] Chat UI component

---

## 📝 Work Log / Dev Journal

### 2026-02-12

- **Documentation**: Created comprehensive documentation suite in `DOCS/` including Architecture, API specs, and Database schemas.
- **Setup**: Initialized project structure and tracking files.

---

## 🐛 Known Issues / Bugs

| ID  | Priority | Description | Status |
| --- | -------- | ----------- | ------ |
| -   | -        | -           | -      |

---

## 💡 Ideas / Notes

- _Remember to check NASA API rate limits during testing._
- _Consider adding a "Demo Mode" that uses mock data if API fails._
