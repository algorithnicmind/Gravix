# 📮 Postman Collection — Cosmic Watch

## Overview

A fully documented Postman collection is provided to test all backend API endpoints. The collection includes pre-configured environments, automated token management, and example request bodies.

---

## Collection Structure

```
Cosmic Watch API
├── 🔐 Auth
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   └── Logout
│
├── ☄️ Asteroids
│   ├── Get Feed (by date range)
│   ├── Get Feed (hazardous only)
│   ├── Lookup by ID
│   └── Search by Name
│
├── 👤 Users
│   ├── Get Profile
│   ├── Update Profile
│   ├── Get Watchlist
│   ├── Add to Watchlist
│   └── Remove from Watchlist
│
├── 🔔 Alerts
│   ├── Get Alerts
│   ├── Get Unread Count
│   ├── Mark as Read
│   ├── Mark All as Read
│   └── Delete Alert
│
└── 💬 Chat (Bonus)
    └── Get Messages
```

---

## Environment Variables

### Postman Environment: `Cosmic Watch - Local`

| Variable        | Initial Value                  | Description                    |
| --------------- | ------------------------------ | ------------------------------ |
| `base_url`      | `http://localhost:5000/api/v1` | API base URL                   |
| `access_token`  | (auto-set)                     | JWT access token               |
| `refresh_token` | (auto-set)                     | JWT refresh token              |
| `user_id`       | (auto-set)                     | Logged-in user ID              |
| `asteroid_id`   | `3542519`                      | Sample asteroid ID for testing |

---

## Automated Token Management

The Login and Register requests include a **post-response script** that automatically saves tokens:

```javascript
// Post-response script (Postman Tests tab)
if (pm.response.code === 200 || pm.response.code === 201) {
  const response = pm.response.json();
  pm.environment.set("access_token", response.data.accessToken);
  pm.environment.set("refresh_token", response.data.refreshToken);
  pm.environment.set("user_id", response.data.user._id);
}
```

All protected requests use `{{access_token}}` in the Authorization header:

```
Authorization: Bearer {{access_token}}
```

---

## How to Import

1. Open Postman
2. Click **Import** (top-left)
3. Select `postman/CosmicWatch.postman_collection.json`
4. Also import `postman/CosmicWatch.postman_environment.json`
5. Set active environment to **"Cosmic Watch - Local"**

---

## Test Flow (Suggested Order)

1. **Register** → Creates account, auto-saves token
2. **Login** → Verifies login, auto-saves token
3. **Get Feed** → Fetch today's asteroids
4. **Lookup by ID** → Get specific asteroid details
5. **Add to Watchlist** → Save an asteroid
6. **Get Watchlist** → Verify it's saved
7. **Get Profile** → View user data
8. **Update Profile** → Change alert preferences
9. **Get Alerts** → Check generated alerts
10. **Get Unread Count** → Verify alert count

---

## File Location

```
Gravix/
└── postman/
    ├── CosmicWatch.postman_collection.json
    └── CosmicWatch.postman_environment.json
```

---

> **Back to**: [README.md](./README.md) | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
