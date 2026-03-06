# 🎨 Frontend Guide — Cosmic Watch

## Table of Contents

- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Routing](#routing)
- [State Management](#state-management)
- [API Service Layer](#api-service-layer)
- [Design System](#design-system)
- [Custom Hooks](#custom-hooks)
- [Pages Overview](#pages-overview)

---

## Project Structure

```
client/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── textures/              # Earth & space textures for Three.js
│       ├── earth.jpg
│       ├── earth_bump.jpg
│       └── starfield.jpg
├── src/
│   ├── components/
│   │   ├── common/            # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── Toast.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── AsteroidCard.jsx
│   │   │   ├── AsteroidFeed.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── RiskDistributionChart.jsx
│   │   │   └── CloseApproachTimeline.jsx
│   │   ├── asteroid/
│   │   │   ├── AsteroidHeader.jsx
│   │   │   ├── MetricsPanel.jsx
│   │   │   ├── RiskScoreRadial.jsx
│   │   │   ├── SizeComparison.jsx
│   │   │   ├── ApproachHistory.jsx
│   │   │   └── WatchlistToggle.jsx
│   │   ├── alerts/
│   │   │   ├── AlertBell.jsx
│   │   │   ├── AlertItem.jsx
│   │   │   └── AlertConfigPanel.jsx
│   │   ├── chat/
│   │   │   ├── ChatThread.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ChatInput.jsx
│   │   └── three/             # 3D Visualisation (Bonus)
│   │       ├── SolarSystemScene.jsx
│   │       ├── Earth.jsx
│   │       ├── AsteroidMarker.jsx
│   │       ├── OrbitPath.jsx
│   │       └── ControlPanel.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AsteroidDetailPage.jsx
│   │   ├── WatchlistPage.jsx
│   │   ├── AlertsPage.jsx
│   │   ├── VisualizationPage.jsx
│   │   └── ProfilePage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── AsteroidContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAsteroids.js
│   │   ├── useAlerts.js
│   │   ├── useWatchlist.js
│   │   ├── useWebSocket.js
│   │   └── useDebounce.js
│   ├── services/
│   │   ├── api.js             # Axios instance with interceptors
│   │   ├── auth.service.js
│   │   ├── asteroid.service.js
│   │   ├── user.service.js
│   │   ├── alert.service.js
│   │   └── chat.service.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js      # Number, date, distance formatting
│   │   ├── riskHelpers.js     # Risk color, label, icon mapping
│   │   └── validators.js
│   ├── styles/
│   │   ├── index.css          # Global styles + CSS variables
│   │   ├── components/        # Component-specific styles
│   │   └── pages/             # Page-specific styles
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── vite.config.js
└── package.json
```

---

## Routing

```javascript
// router.jsx
const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />, // Auth guard wrapper
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/asteroid/:id", element: <AsteroidDetailPage /> },
      { path: "/watchlist", element: <WatchlistPage /> },
      { path: "/alerts", element: <AlertsPage /> },
      { path: "/visualize", element: <VisualizationPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
```

---

## State Management

### Context Providers

```
<ThemeContext.Provider>
  <AuthContext.Provider>
    <AsteroidContext.Provider>
      <RouterProvider router={router} />
    </AsteroidContext.Provider>
  </AuthContext.Provider>
</ThemeContext.Provider>
```

### AuthContext

Manages: `user`, `token`, `isAuthenticated`, `login()`, `register()`, `logout()`, `refreshToken()`

### AsteroidContext

Manages: `asteroids`, `selectedAsteroid`, `filters`, `loading`, `fetchFeed()`, `fetchById()`

### ThemeContext

Manages: `theme` (dark/light), `toggleTheme()`

---

## API Service Layer

```javascript
// services/api.js — Axios instance
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → refresh token or redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh, then retry
    }
    return Promise.reject(error);
  },
);

export default api;
```

**Service Examples**:

```javascript
// services/asteroid.service.js
import api from "./api";

export const asteroidService = {
  getFeed: (startDate, endDate, filters) =>
    api.get("/asteroids/feed", {
      params: { start_date: startDate, end_date: endDate, ...filters },
    }),

  getById: (id) => api.get(`/asteroids/${id}`),
  search: (query) => api.get("/asteroids/search", { params: { q: query } }),
};
```

---

## Design System

### CSS Variables (Design Tokens)

```css
:root {
  /* Colors — Space Theme */
  --color-bg-primary: #0a0e1a; /* Deep space black */
  --color-bg-secondary: #121829; /* Dark navy */
  --color-bg-card: #1a2035; /* Card background */
  --color-accent: #6c5ce7; /* Purple accent */
  --color-accent-glow: rgba(108, 92, 231, 0.3);
  --color-success: #00d2d3; /* Teal */
  --color-warning: #feca57; /* Yellow */
  --color-danger: #ff6b6b; /* Red */
  --color-critical: #ff4757; /* Bright red */
  --color-text-primary: #e4e8f1;
  --color-text-secondary: #8892b0;

  /* Risk Category Colors */
  --risk-negligible: #00d2d3;
  --risk-low: #1dd1a1;
  --risk-moderate: #feca57;
  --risk-high: #ff9f43;
  --risk-critical: #ff4757;

  /* Typography */
  --font-family: "Inter", "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px var(--color-accent-glow);
}
```

### Component Design Patterns

- **Glassmorphism**: Semi-transparent cards with backdrop-filter blur
- **Glow Effects**: Subtle accent-colored glows on interactive elements
- **Gradients**: Linear gradients for backgrounds and risk indicators
- **Micro-animations**: Framer Motion for mount/hover/transition animations
- **Dark Theme First**: Space-inspired dark UI as default

---

## Custom Hooks

```javascript
// hooks/useAsteroids.js
export const useAsteroids = (startDate, endDate) => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await asteroidService.getFeed(startDate, endDate);
        setAsteroids(data.data.asteroids);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  return { asteroids, loading, error };
};
```

---

## Pages Overview

### 1. Landing Page

- Hero section with animated starfield background
- Key features grid with icons
- CTA buttons for login/register
- Stats counter (total NEOs tracked, hazardous count)

### 2. Dashboard Page

- **Stats Bar**: Total NEOs today, hazardous count, closest approach
- **Asteroid Feed**: Paginated list with filter/sort controls
- **Risk Distribution Chart**: Doughnut chart by risk category
- **Close Approach Timeline**: Upcoming approaches in chronological order

### 3. Asteroid Detail Page

- Full metrics panel (distance, velocity, diameter, risk score)
- Size comparison visualisation (vs known objects)
- Close approach history table
- 3D orbit viewer (bonus)
- Watchlist add/remove toggle
- Comment/chat thread (bonus)

### 4. Watchlist Page

- Grid of watched asteroids with latest data
- Remove/configure alert per asteroid
- Empty state with CTA to browse dashboard

### 5. Alerts Page

- List of triggered alerts with severity badges
- Filter by read/unread, type, severity
- Mark as read / mark all as read

### 6. Visualization Page (Bonus)

- Full-screen Three.js solar system scene
- Control panel for time, scale, object selection
- Info overlay for selected asteroid

### 7. Profile Page

- Edit name, notification preferences
- Alert threshold configuration
- Account statistics

---

> **Next**: [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for server-side architecture →
