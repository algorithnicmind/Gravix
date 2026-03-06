# 🖥️ Environment Setup — Cosmic Watch

## Prerequisites

| Tool                  | Version  | Check Command       | Install Link                                                  |
| --------------------- | -------- | ------------------- | ------------------------------------------------------------- |
| **Node.js**           | 20.x LTS | `node --version`    | [nodejs.org](https://nodejs.org/)                             |
| **npm**               | 10.x+    | `npm --version`     | Comes with Node.js                                            |
| **MongoDB**           | 7.x      | `mongosh --version` | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git**               | 2.40+    | `git --version`     | [git-scm.com](https://git-scm.com/)                           |
| **Docker** (optional) | 24.x+    | `docker --version`  | [docker.com](https://www.docker.com/)                         |

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Gravix.git
cd Gravix
```

### 2. Get a NASA API Key

1. Visit [https://api.nasa.gov/](https://api.nasa.gov/)
2. Fill out the form (name, email)
3. Receive your API key instantly via email
4. Save it — you'll need it in the `.env` file

### 3. Set Up Environment Variables

Create `.env` in the `server/` directory:

```env
NODE_ENV=development
PORT=5000

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/cosmicwatch

# JWT
JWT_SECRET=my-development-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# NASA
NASA_API_KEY=your-nasa-api-key-here
NASA_BASE_URL=https://api.nasa.gov/neo/rest/v1

# Client URL
CLIENT_URL=http://localhost:5173

# Rate Limits
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

Create `.env` in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

### 5. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 6. Start MongoDB

**Option A — Local MongoDB**:

```bash
mongosh    # Verify MongoDB is running
```

**Option B — Docker MongoDB**:

```bash
docker run -d --name cosmic-mongo -p 27017:27017 mongo:7
```

**Option C — MongoDB Atlas (Cloud)**:

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com/)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### 7. Start Development Servers

**Terminal 1 — Backend**:

```bash
cd server
npm run dev
# Server starts on http://localhost:5000
# Output: 🚀 Cosmic Watch API running on port 5000
#          📦 Connected to MongoDB
#          📅 Scheduled jobs initialized
```

**Terminal 2 — Frontend**:

```bash
cd client
npm run dev
# Vite dev server on http://localhost:5173
```

### 8. Verify Setup

- **Backend health**: Visit `http://localhost:5000/health`
  - Should return `{ "status": "ok", "timestamp": "..." }`
- **Frontend**: Visit `http://localhost:5173`
  - Should see the Cosmic Watch landing page
- **NASA API**: Test in Postman or browser:
  - `https://api.nasa.gov/neo/rest/v1/feed?start_date=2026-02-12&api_key=YOUR_KEY`

---

## Project Scripts

### Backend (`server/package.json`)

| Command        | Description                       |
| -------------- | --------------------------------- |
| `npm run dev`  | Start with nodemon (auto-restart) |
| `npm start`    | Start production server           |
| `npm test`     | Run Jest test suite               |
| `npm run lint` | Run ESLint                        |

### Frontend (`client/package.json`)

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server (HMR)      |
| `npm run build`   | Build production bundle          |
| `npm run preview` | Preview production build locally |
| `npm test`        | Run test suite                   |
| `npm run lint`    | Run ESLint                       |

---

## Troubleshooting

| Issue                      | Solution                                            |
| -------------------------- | --------------------------------------------------- |
| MongoDB connection refused | Ensure MongoDB is running: `mongosh` or `docker ps` |
| NASA API 403               | Check API key is valid, not rate limited            |
| CORS errors in browser     | Ensure `CLIENT_URL` matches your frontend URL       |
| Port already in use        | Kill process: `npx kill-port 5000` or change PORT   |
| `MODULE_NOT_FOUND`         | Delete `node_modules` and run `npm install` again   |

---

> **Next**: [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for testing approach →
