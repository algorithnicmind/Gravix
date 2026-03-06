# 📡 API Documentation — Cosmic Watch

## Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://your-domain.com/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Standard Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description of the error",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  }
}
```

---

## 🔐 Auth Endpoints

### POST `/auth/register`

Register a new user account.

**Request Body**:

```json
{
  "name": "Ankit Sharma",
  "email": "ankit@example.com",
  "password": "SecureP@ss123",
  "role": "enthusiast"
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "name": "Ankit Sharma",
      "email": "ankit@example.com",
      "role": "enthusiast",
      "createdAt": "2026-02-12T15:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors**: `400` (Validation), `409` (Email exists)

---

### POST `/auth/login`

Authenticate and receive tokens.

**Request Body**:

```json
{
  "email": "ankit@example.com",
  "password": "SecureP@ss123"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Ankit Sharma",
      "email": "ankit@example.com"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

**Errors**: `401` (Invalid credentials)

---

### POST `/auth/refresh`

Refresh an expired access token.

**Request Body**:

```json
{ "refreshToken": "eyJhbGci..." }
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": { "accessToken": "eyJhbGci..." }
}
```

---

### POST `/auth/logout`

🔒 **Protected** — Invalidate refresh token.

**Success Response** `200 OK`:

```json
{ "success": true, "data": { "message": "Logged out successfully" } }
```

---

## ☄️ Asteroid Endpoints

### GET `/asteroids/feed`

🔒 **Protected** — Fetch asteroids for a date range (max 7 days).

**Query Parameters**:
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `start_date` | string (YYYY-MM-DD) | No | Today | Start date |
| `end_date` | string (YYYY-MM-DD) | No | Today | End date |
| `hazardous` | boolean | No | — | Filter hazardous only |
| `sort_by` | string | No | `close_approach_date` | Sort field |
| `order` | string | No | `asc` | Sort order (asc/desc) |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Results per page |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "element_count": 15,
    "asteroids": [
      {
        "id": "3542519",
        "neo_reference_id": "3542519",
        "name": "(2010 PK9)",
        "nasa_jpl_url": "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3542519",
        "is_potentially_hazardous": true,
        "estimated_diameter": {
          "kilometers": { "min": 0.1010543415, "max": 0.2260541771 },
          "meters": { "min": 101.0543414, "max": 226.0541771 }
        },
        "close_approach_data": {
          "close_approach_date": "2026-02-12",
          "close_approach_date_full": "2026-Feb-12 09:30",
          "relative_velocity": {
            "kilometers_per_second": "12.345",
            "kilometers_per_hour": "44442.00"
          },
          "miss_distance": {
            "astronomical": "0.0234567890",
            "lunar": "9.1234567890",
            "kilometers": "3510000.00"
          },
          "orbiting_body": "Earth"
        },
        "risk_score": 72,
        "risk_category": "High"
      }
    ]
  },
  "meta": { "page": 1, "limit": 20, "total": 15 }
}
```

---

### GET `/asteroids/:id`

🔒 **Protected** — Get detailed information for a specific asteroid.

**Path Parameters**: `id` — NASA NEO reference ID or SPK-ID

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "3542519",
    "name": "(2010 PK9)",
    "is_potentially_hazardous": true,
    "estimated_diameter": { "...": "..." },
    "orbital_data": {
      "orbit_id": "150",
      "orbit_determination_date": "2021-04-15",
      "semi_major_axis": "1.123456789",
      "eccentricity": "0.234567",
      "inclination": "5.678",
      "orbital_period": "432.10"
    },
    "close_approach_data": ["... all historical approaches ..."],
    "risk_analysis": {
      "risk_score": 72,
      "risk_category": "High",
      "factors": {
        "distance_factor": 28.5,
        "size_factor": 22.0,
        "velocity_factor": 16.5,
        "hazard_bonus": 5.0
      }
    }
  }
}
```

**Errors**: `404` (Asteroid not found)

---

### GET `/asteroids/search`

🔒 **Protected** — Search asteroids by name or ID.

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | string | Yes | Search query (name or SPK-ID) |

---

## 👤 User Endpoints

### GET `/users/profile`

🔒 **Protected** — Get current user's profile.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Ankit Sharma",
    "email": "ankit@example.com",
    "role": "enthusiast",
    "alertPreferences": {
      "distanceThreshold": 0.05,
      "riskScoreThreshold": 60,
      "notifyOnHazardous": true
    },
    "createdAt": "2026-02-12T15:00:00Z"
  }
}
```

### PUT `/users/profile`

🔒 **Protected** — Update profile and alert preferences.

**Request Body**:

```json
{
  "name": "Ankit S.",
  "alertPreferences": {
    "distanceThreshold": 0.03,
    "riskScoreThreshold": 50,
    "notifyOnHazardous": true
  }
}
```

---

### GET `/users/watchlist`

🔒 **Protected** — Get user's watched asteroids.

### POST `/users/watchlist`

🔒 **Protected** — Add asteroid to watchlist.

**Request Body**:

```json
{ "asteroidId": "3542519", "asteroidName": "(2010 PK9)" }
```

### DELETE `/users/watchlist/:asteroidId`

🔒 **Protected** — Remove from watchlist.

---

## 🔔 Alert Endpoints

### GET `/alerts`

🔒 **Protected** — Get user's alerts.

**Query Parameters**: `read` (boolean), `page`, `limit`

### GET `/alerts/unread-count`

🔒 **Protected** — Get count of unread alerts.

### PUT `/alerts/:id/read`

🔒 **Protected** — Mark alert as read.

### PUT `/alerts/read-all`

🔒 **Protected** — Mark all alerts as read.

### DELETE `/alerts/:id`

🔒 **Protected** — Delete an alert.

---

## 💬 Chat Endpoints (Bonus)

### GET `/chat/:asteroidId/messages`

🔒 **Protected** — Get chat messages for an asteroid thread.

**Query Parameters**: `page`, `limit`, `before` (cursor-based pagination)

### WebSocket Events

| Event             | Direction       | Payload                                      |
| ----------------- | --------------- | -------------------------------------------- |
| `chat:join`       | Client → Server | `{ asteroidId }`                             |
| `chat:leave`      | Client → Server | `{ asteroidId }`                             |
| `chat:message`    | Client → Server | `{ asteroidId, text }`                       |
| `chat:message`    | Server → Client | `{ _id, userId, userName, text, createdAt }` |
| `chat:userJoined` | Server → Client | `{ userId, userName }`                       |
| `chat:userLeft`   | Server → Client | `{ userId, userName }`                       |

---

## Rate Limiting

| Endpoint Group | Window | Max Requests |
| -------------- | ------ | ------------ |
| Auth           | 15 min | 20           |
| Asteroids      | 15 min | 100          |
| Users          | 15 min | 50           |
| Alerts         | 15 min | 50           |
| Chat           | 15 min | 200          |

---

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request / Validation Error       |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Resource Not Found                   |
| 409  | Conflict (duplicate resource)        |
| 429  | Rate Limited                         |
| 500  | Internal Server Error                |
| 502  | Bad Gateway (NASA API unavailable)   |

---

> **Next**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data model details →
