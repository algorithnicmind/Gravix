<p align="center">
  <img src="https://img.shields.io/badge/🌌-Cosmic_Watch-blueviolet?style=for-the-badge&logoColor=white" alt="Cosmic Watch" />
</p>

<h1 align="center">🌠 Cosmic Watch</h1>
<h3 align="center">A Full-Stack Platform for Real-Time Near-Earth Object (NEO) Monitoring</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker" />
  <img src="https://img.shields.io/badge/NASA_API-NeoWs-000000?style=flat-square&logo=nasa" />
  <img src="https://img.shields.io/badge/Three.js-3D-black?style=flat-square&logo=three.js" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## 🚀 Overview

**Cosmic Watch** is an advanced, full-stack web platform that fetches live asteroid data from NASA's Near-Earth Object Web Service (NeoWs) API. It provides a comprehensive monitoring dashboard where users can track specific objects, understand their potential impact risks, and receive automated alerts based on proximity.

> _"In the vastness of space, thousands of Near-Earth Objects (NEOs) pass by our planet daily. Cosmic Watch makes this data accessible, understandable, and actionable."_

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure JWT-based login for researchers and enthusiasts |
| 📡 **Real-Time Data Feed** | Live integration with NASA NeoWs API |
| ⚠️ **Risk Analysis Engine** | Automated hazard categorisation and risk scoring |
| 🔔 **Alert & Notification System** | Smart alerts for close-approach events |
| 🌍 **3D Visualisation** | Interactive Three.js orbital visualisation *(Bonus)* |
| 💬 **Real-Time Chat** | Community discussion threads via WebSockets *(Bonus)* |
| 🐳 **Docker Deployment** | Full containerised deployment with docker-compose |
| 📮 **Postman Collection** | Fully documented API testing collection |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    COSMIC WATCH                         │
├───────────────┬───────────────┬─────────────────────────┤
│   Frontend    │   Backend     │   External Services     │
│   (React)     │   (Node.js)   │                         │
│               │   (Express)   │   ┌─────────────────┐   │
│  ┌─────────┐  │               │   │  NASA NeoWs API │   │
│  │Dashboard │◄─┤  ┌─────────┐ │   └────────▲────────┘   │
│  │3D View   │  │  │REST API │─┤────────────┘            │
│  │Alerts    │  │  │WebSocket│ │                         │
│  │Chat      │  │  │Scheduler│ │   ┌─────────────────┐   │
│  └─────────┘  │  └─────────┘ │   │    MongoDB       │   │
│               │       │      │   └─────────────────┘   │
│               │       └──────┤──────────┘               │
└───────────────┴───────────────┴─────────────────────────┘
```

---

## 📂 Project Structure

```
Gravix/
├── client/                    # React frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React context providers
│   │   ├── utils/             # Utility functions
│   │   ├── three/             # Three.js 3D visualisation
│   │   └── styles/            # Global & component styles
│   ├── package.json
│   └── Dockerfile
│
├── server/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Mongoose data models
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic services
│   │   ├── jobs/              # Scheduled jobs (cron)
│   │   ├── sockets/           # WebSocket handlers
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── Dockerfile
│
├── DOCS/                      # Comprehensive documentation
├── postman/                   # Postman collection & environment
├── docker-compose.yml         # Container orchestration
├── .env.example               # Environment variable template
├── AI-LOG.md                  # LLM usage log (hackathon requirement)
├── LICENSE
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Three.js, Chart.js, Socket.io-client |
| **Backend** | Node.js 20, Express.js, Socket.io, node-cron |
| **Database** | MongoDB 7 with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **External API** | NASA NeoWs (Near Earth Object Web Service) |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Testing** | Jest, React Testing Library, Supertest |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+ & npm 10+
- MongoDB 7+ (or Docker)
- NASA API Key ([Get one free](https://api.nasa.gov/))

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Gravix.git
cd Gravix

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your NASA API key and MongoDB URI

# 3. Install dependencies
cd server && npm install
cd ../client && npm install

# 4. Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# MongoDB:  mongodb://localhost:27017
```

---

## 📖 Documentation

Comprehensive documentation is available in the [`DOCS/`](./DOCS/) directory:

| Document | Description |
|----------|-------------|
| [Project Overview](./DOCS/PROJECT_OVERVIEW.md) | Full project scope, goals, and objectives |
| [Architecture](./DOCS/ARCHITECTURE.md) | System design, data flow, component diagrams |
| [Tech Stack](./DOCS/TECH_STACK.md) | Technology choices and justifications |
| [API Documentation](./DOCS/API_DOCUMENTATION.md) | Complete REST API endpoint reference |
| [Database Schema](./DOCS/DATABASE_SCHEMA.md) | MongoDB collections, indexes, relationships |
| [Frontend Guide](./DOCS/FRONTEND_GUIDE.md) | React component tree, routing, state management |
| [Backend Guide](./DOCS/BACKEND_GUIDE.md) | Express architecture, middleware, services |
| [Authentication](./DOCS/AUTHENTICATION.md) | JWT flow, security, role-based access |
| [NASA API Integration](./DOCS/NASA_API_INTEGRATION.md) | NeoWs API usage, data mapping, caching |
| [Risk Analysis Engine](./DOCS/RISK_ANALYSIS_ENGINE.md) | Scoring algorithm, hazard categorisation |
| [Alert System](./DOCS/ALERT_SYSTEM.md) | Notification engine, scheduling, thresholds |
| [3D Visualisation](./DOCS/3D_VISUALIZATION.md) | Three.js orbital rendering (Bonus) |
| [Real-Time Chat](./DOCS/REAL_TIME_CHAT.md) | WebSocket chat architecture (Bonus) |
| [Deployment Guide](./DOCS/DEPLOYMENT_GUIDE.md) | Docker, CI/CD, production setup |
| [Environment Setup](./DOCS/ENVIRONMENT_SETUP.md) | Local development configuration |
| [Testing Strategy](./DOCS/TESTING_STRATEGY.md) | Testing approach and coverage |
| [Security](./DOCS/SECURITY.md) | Security practices and threat mitigation |
| [Wireframes](./DOCS/WIREFRAMES.md) | UI/UX design specifications |
| [Roadmap](./DOCS/ROADMAP.md) | Development phases and milestones |
| [Contributing](./DOCS/CONTRIBUTING.md) | Contribution guidelines |
| [Postman Guide](./DOCS/POSTMAN_COLLECTION.md) | API testing with Postman |

---

## 🧪 API Testing

Import the Postman collection from `postman/CosmicWatch.postman_collection.json` to test all endpoints:

- **Feed Endpoints** — Fetch asteroid data by date range
- **Lookup Endpoints** — Search specific asteroids by SPK-ID
- **User Endpoints** — Authentication, profiles, watchlists
- **Alert Endpoints** — Create, manage, and trigger alerts

---

## 👥 Team

| Role | Responsibility |
|------|---------------|
| **Full-Stack Developer** | End-to-end development |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>🌌 Built with curiosity about the cosmos and passion for code 🌌</strong>
</p>
