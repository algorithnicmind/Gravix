# 🌠 Project Overview — Cosmic Watch

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Project Goals](#project-goals)
- [Target Audience](#target-audience)
- [Core Features](#core-features)
- [Bonus Features](#bonus-features)
- [Success Metrics](#success-metrics)
- [Constraints & Assumptions](#constraints--assumptions)
- [Glossary](#glossary)

---

## Problem Statement

### The Challenge

In the vastness of space, thousands of **Near-Earth Objects (NEOs)** pass by our planet daily. While space agencies like NASA track these meticulously through sophisticated systems, the raw data remains:

1. **Inaccessible** — Buried in scientific databases designed for researchers, not the general public
2. **Difficult to Interpret** — Raw trajectory data, orbital elements, and velocity vectors require specialised knowledge
3. **Not Localised** — No user-friendly tools translate complex trajectory data into understandable risk assessments
4. **Lacking Visual Context** — Numbers alone don't convey the scale, proximity, or urgency of asteroid approaches

### Why This Matters

- **Planetary Defence Awareness**: Public understanding of NEO threats is essential for informed policy-making
- **Scientific Curiosity**: Amateur astronomers and space enthusiasts deserve accessible tools
- **Educational Value**: Students and educators need interactive platforms to learn about orbital mechanics
- **Community Engagement**: Shared awareness builds a more scientifically literate society

### The Gap

```
┌──────────────────────────────────────────────────────────────┐
│                     CURRENT STATE                            │
│                                                              │
│  NASA API ──► Raw JSON ──► ???  ──► General Public           │
│              (Complex)   (Gap!)    (Confused/Unaware)        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                     DESIRED STATE                            │
│                                                              │
│  NASA API ──► Cosmic Watch ──► Visual Dashboard ──► Public   │
│              (Processing)    (Clear & Beautiful)  (Informed) │
└──────────────────────────────────────────────────────────────┘
```

---

## Solution

**Cosmic Watch** is a full-stack web platform that bridges this gap by:

1. **Fetching** live asteroid data from NASA's Near-Earth Object Web Service (NeoWs) API
2. **Processing** raw orbital data through a custom Risk Analysis Engine
3. **Visualising** asteroid trajectories in an intuitive, interactive dashboard
4. **Alerting** users about upcoming close-approach events
5. **Engaging** the community through real-time discussion features

### Value Proposition

| For                     | Cosmic Watch Provides                                            |
| ----------------------- | ---------------------------------------------------------------- |
| **General Public**      | Easy-to-understand risk indicators and visual alerts             |
| **Amateur Astronomers** | Tracking tools for specific objects with custom alert parameters |
| **Researchers**         | Data aggregation, filtering, and export capabilities             |
| **Educators**           | Interactive 3D visualisations for classroom demonstrations       |
| **Students**            | Hands-on learning platform for space science concepts            |

---

## Project Goals

### Primary Goals (Must Have)

1. **Secure User System** — Implement authentication with JWT for researchers and enthusiasts to save watched asteroids and set custom alert parameters
2. **Live Data Integration** — Fetch and display real-time asteroid data from NASA NeoWs API including velocity, distance, diameter, and hazard status
3. **Risk Scoring** — Build an engine that categorises asteroids by hazardous status, diameter, and miss distance into a clear, composite risk score
4. **Smart Alerts** — Schedule and deliver notifications for upcoming close-approach events via the dashboard
5. **Container-Ready** — Provide Docker and docker-compose configuration for complete containerised deployment

### Secondary Goals (Bonus)

6. **3D Orbital View** — Interactive Three.js visualisation showing asteroid orbits relative to Earth
7. **Community Chat** — Real-time WebSocket-based discussion threads for specific asteroids
8. **Postman Collection** — Fully documented API testing collection for all endpoints

### Quality Goals

- **Performance**: Dashboard loads within 2 seconds; API responses under 500ms
- **Reliability**: 99.9% uptime target; graceful degradation when NASA API is unavailable
- **Security**: OWASP Top 10 compliance; encrypted passwords; secure token management
- **Usability**: Intuitive UI requiring no astronomy background to understand
- **Scalability**: Architecture supports horizontal scaling via containerisation

---

## Target Audience

### Primary Users

#### 1. Space Enthusiasts & Amateur Astronomers

- **Profile**: Hobbyists with basic to intermediate astronomy knowledge
- **Needs**: Track specific NEOs, receive approach alerts, visualise orbits
- **Usage Pattern**: Daily check-ins, watchlist management, alert monitoring

#### 2. Researchers & Academics

- **Profile**: Professional or academic researchers studying planetary defence
- **Needs**: Filtered data views, risk analysis, data export, historical trends
- **Usage Pattern**: In-depth analysis sessions, data comparison, report generation

#### 3. Educators & Students

- **Profile**: Teachers and students in STEM programs
- **Needs**: Visual learning tools, interactive simulations, simplified explanations
- **Usage Pattern**: Classroom demonstrations, homework assignments, exploration

### Secondary Users

#### 4. General Public

- **Profile**: Curious individuals with no technical background
- **Needs**: Simple, clear information about "is there an asteroid coming?"
- **Usage Pattern**: Occasional visits driven by news events or curiosity

#### 5. Science Communicators & Journalists

- **Profile**: Writers and content creators covering space topics
- **Needs**: Accurate, citable data, shareable visualisations
- **Usage Pattern**: Research for articles, infographic creation

---

## Core Features

### 1. 🔐 User Authentication & Verification

**Purpose**: Personalised experience with saved preferences and watchlists

| Capability         | Description                                            |
| ------------------ | ------------------------------------------------------ |
| Registration       | Email-based signup with password strength validation   |
| Login              | Secure JWT-based authentication with token refresh     |
| Profile Management | Update name, email, notification preferences           |
| Watchlist          | Save specific asteroids to a personal tracking list    |
| Alert Parameters   | Set custom proximity/size thresholds for notifications |
| Session Management | Secure token storage, automatic expiry, logout         |

**User Flow**:

```
Register → Email Verification → Login → Dashboard
                                   ↓
                            Set Preferences
                                   ↓
                        Add Asteroids to Watchlist
                                   ↓
                         Configure Alert Thresholds
```

### 2. 📡 Real-Time Data Feed

**Purpose**: Live asteroid information from NASA's authoritative data source

| Capability          | Description                                             |
| ------------------- | ------------------------------------------------------- |
| Daily Feed          | Asteroids approaching Earth today and upcoming week     |
| Search by Date      | Query asteroid data for any date range                  |
| Object Lookup       | Search specific asteroids by SPK-ID or name             |
| Sorting & Filtering | Filter by hazard status, distance, size, velocity       |
| Data Refresh        | Automatic periodic refresh with caching for performance |
| Offline Fallback    | Cached data served when NASA API is unavailable         |

**Data Points Displayed**:

- Asteroid name and NASA JPL ID
- Estimated diameter (min/max in km and metres)
- Relative velocity (km/s, km/h, mph)
- Miss distance (astronomical units, km, lunar distances)
- Is potentially hazardous (boolean + visual indicator)
- Close approach date and time
- Orbiting body (Earth, Mars, etc.)

### 3. ⚠️ Risk Analysis Engine

**Purpose**: Transform raw data into understandable risk assessments

| Capability            | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| Risk Score            | Composite 0-100 score based on multiple factors                |
| Hazard Classification | Categories: Negligible, Low, Moderate, High, Critical          |
| Factor Weighting      | Adjustable weights for distance, size, velocity                |
| Historical Comparison | Compare current objects to historically significant ones       |
| Torino Scale Mapping  | Map risk scores to the internationally recognised Torino Scale |

**Risk Score Formula** (detailed in [RISK_ANALYSIS_ENGINE.md](./RISK_ANALYSIS_ENGINE.md)):

```
Risk Score = (W_dist × Distance_Factor) +
             (W_size × Size_Factor) +
             (W_vel  × Velocity_Factor) +
             (W_haz  × Hazard_Bonus)

Where:
  - Distance_Factor: Inversely proportional to miss distance
  - Size_Factor: Proportional to estimated diameter
  - Velocity_Factor: Proportional to relative velocity
  - Hazard_Bonus: Additional weight if NASA flags as hazardous
```

### 4. 🔔 Alert & Notification System

**Purpose**: Proactive notification of significant approach events

| Capability       | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| Dashboard Alerts | In-app notification bell with unread count                 |
| Approach Alerts  | Triggered when watched asteroids enter proximity threshold |
| Risk Alerts      | Triggered when any asteroid exceeds risk score threshold   |
| Scheduling       | Cron-based background jobs check for upcoming events       |
| Alert History    | Log of all past alerts with timestamps                     |
| Customisation    | User-configurable thresholds and notification preferences  |

### 5. 🐳 Containerised Deployment

**Purpose**: Reproducible, scalable deployment across environments

| Component     | Container                                |
| ------------- | ---------------------------------------- |
| Frontend      | React app served via Nginx               |
| Backend       | Node.js/Express API server               |
| Database      | MongoDB instance                         |
| Orchestration | docker-compose.yml managing all services |

---

## Bonus Features

### 6. 🌍 3D Visualisation (Bonus)

**Purpose**: Immersive orbital visualisation for intuitive understanding

- Interactive Three.js scene with Earth at centre
- Asteroid orbits rendered as elliptical paths
- Real-time asteroid positions along their orbits
- Camera controls: zoom, pan, rotate
- Click-to-select for detailed asteroid information
- Scale toggle between realistic and exaggerated views

### 7. 💬 Real-Time Chat (Bonus)

**Purpose**: Community engagement and knowledge sharing

- Asteroid-specific discussion threads
- Real-time message delivery via WebSocket (Socket.io)
- User presence indicators (online/offline)
- Message history with pagination
- Basic moderation tools (report, delete own messages)

---

## Success Metrics

| Metric              | Target                                 | Measurement                  |
| ------------------- | -------------------------------------- | ---------------------------- |
| Page Load Time      | < 2 seconds                            | Lighthouse Performance Score |
| API Response Time   | < 500ms (cached), < 2s (live)          | Server-side timing           |
| Risk Score Accuracy | Aligns with NASA hazard classification | Manual validation            |
| Test Coverage       | > 80% code coverage                    | Jest coverage reports        |
| Accessibility       | WCAG 2.1 AA compliant                  | aXe audit                    |
| Docker Build Time   | < 5 minutes                            | Build pipeline timing        |
| Uptime              | 99.9%                                  | Health check monitoring      |

---

## Constraints & Assumptions

### Constraints

1. **NASA API Rate Limits**: Free API key allows ~1,000 requests/hour. Caching is essential.
2. **Hackathon Timeline**: All code must be developed within the hackathon timeframe.
3. **Budget**: Zero-cost infrastructure (free tiers for all services).
4. **Browser Support**: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

### Assumptions

1. Users have a stable internet connection for initial data loading
2. NASA's NeoWs API maintains its current schema and availability
3. MongoDB is suitable for the expected data volumes (< 100K documents)
4. WebSocket connections are supported by the target audience's networks

---

## Glossary

| Term                       | Definition                                                                       |
| -------------------------- | -------------------------------------------------------------------------------- |
| **NEO**                    | Near-Earth Object — any small Solar System body whose orbit brings it near Earth |
| **NeoWs**                  | Near Earth Object Web Service — NASA's RESTful API for NEO data                  |
| **SPK-ID**                 | Unique identifier assigned to celestial objects by NASA JPL                      |
| **Astronomical Unit (AU)** | ~149.6 million km; the average Earth-Sun distance                                |
| **Lunar Distance (LD)**    | ~384,400 km; the average Earth-Moon distance                                     |
| **Miss Distance**          | Closest approach distance between an NEO and Earth                               |
| **Potentially Hazardous**  | NEO with orbit ≤ 0.05 AU from Earth and diameter ≥ 140 metres                    |
| **Torino Scale**           | 0-10 scale for categorising the impact hazard of NEOs                            |
| **Palermo Scale**          | Logarithmic scale comparing impact probability to background risk                |
| **Close Approach**         | Event where an NEO passes within a defined proximity of Earth                    |
| **JWT**                    | JSON Web Token — compact, URL-safe token for secure claims transfer              |
| **WebSocket**              | Protocol enabling full-duplex communication over a single TCP connection         |

---

> **Next**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design →
