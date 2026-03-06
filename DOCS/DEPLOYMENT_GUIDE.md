# 🐳 Deployment Guide — Cosmic Watch

## Table of Contents

- [Docker Deployment](#docker-deployment)
- [Docker Compose Configuration](#docker-compose-configuration)
- [Dockerfiles](#dockerfiles)
- [Environment Variables](#environment-variables)
- [Production Considerations](#production-considerations)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Docker Deployment

### Prerequisites

- Docker Engine 24.x+
- Docker Compose v2+
- NASA API Key

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Gravix.git
cd Gravix

# 2. Configure environment
cp .env.example .env
# Edit .env with your NASA API key

# 3. Build and start all services
docker-compose up --build -d

# 4. Verify services are running
docker-compose ps

# 5. View logs
docker-compose logs -f

# Access:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
# MongoDB:   mongodb://localhost:27017/cosmicwatch
```

### Stop / Restart

```bash
docker-compose down           # Stop all services
docker-compose down -v        # Stop + remove volumes (WARNING: deletes data)
docker-compose restart api    # Restart specific service
```

---

## Docker Compose Configuration

```yaml
# docker-compose.yml
version: "3.8"

services:
  # ─── MongoDB Database ────────────────────────
  db:
    image: mongo:7
    container_name: cosmic-db
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-cosmicadmin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-cosmicpass123}
      MONGO_INITDB_DATABASE: cosmicwatch
    volumes:
      - cosmic-data:/data/db
    networks:
      - cosmic-network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── Backend API Server ──────────────────────
  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: cosmic-api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://${MONGO_USER:-cosmicadmin}:${MONGO_PASSWORD:-cosmicpass123}@db:27017/cosmicwatch?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      NASA_API_KEY: ${NASA_API_KEY}
      CLIENT_URL: http://localhost:3000
    depends_on:
      db:
        condition: service_healthy
    networks:
      - cosmic-network

  # ─── Frontend React App ──────────────────────
  ui:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://localhost:5000/api/v1
    container_name: cosmic-ui
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - api
    networks:
      - cosmic-network

volumes:
  cosmic-data:
    driver: local

networks:
  cosmic-network:
    driver: bridge
```

---

## Dockerfiles

### Backend Dockerfile (`server/Dockerfile`)

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Frontend Dockerfile (`client/Dockerfile`)

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Config (`client/nginx.conf`)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

---

## Environment Variables

### `.env.example`

```env
# ─── MongoDB ───────────────────
MONGO_USER=cosmicadmin
MONGO_PASSWORD=cosmicpass123

# ─── JWT ───────────────────────
JWT_SECRET=your-super-secret-jwt-key-change-this

# ─── NASA API ──────────────────
NASA_API_KEY=your-nasa-api-key-from-api.nasa.gov

# ─── Application ───────────────
NODE_ENV=production
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## Production Considerations

### Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 256 bits)
- [ ] Enable HTTPS (SSL/TLS termination)
- [ ] Set restrictive CORS origins
- [ ] Enable MongoDB authentication
- [ ] Use Docker secrets for sensitive values
- [ ] Set `NODE_ENV=production`

### Performance Checklist

- [ ] Enable Nginx gzip compression
- [ ] Set static asset cache headers (1 year)
- [ ] Use multi-stage Docker builds (smaller images)
- [ ] Configure MongoDB connection pooling
- [ ] Set Node.js memory limits
- [ ] Enable PM2 or cluster mode for Node.js

### Monitoring

- Health check endpoint: `GET /health`
- Docker healthchecks on all services
- Log aggregation via `docker-compose logs`

---

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install & Test Backend
        working-directory: ./server
        run: |
          npm ci
          npm test
      - name: Install & Test Frontend
        working-directory: ./client
        run: |
          npm ci
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Images
        run: docker-compose build
```

---

> **Next**: [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for local development setup →
