# 🔐 Authentication — Cosmic Watch

## Overview

Cosmic Watch uses **JWT (JSON Web Token)** based authentication with a dual-token strategy: short-lived access tokens and long-lived refresh tokens. Passwords are hashed using **bcrypt** with 12 salt rounds.

---

## Authentication Flow

### Registration Flow

```
Client                          Server
  │                               │
  │  POST /auth/register          │
  │  { name, email, password }    │
  │ ─────────────────────────────►│
  │                               │── Validate input (Joi)
  │                               │── Check email uniqueness
  │                               │── Hash password (bcrypt, 12 rounds)
  │                               │── Create user document
  │                               │── Generate access token (15 min)
  │                               │── Generate refresh token (7 days)
  │                               │── Store refresh token in DB
  │  { user, accessToken,         │
  │    refreshToken }             │
  │ ◄─────────────────────────────│
  │                               │
  │── Store accessToken (memory)  │
  │── Store refreshToken (cookie) │
```

### Login Flow

```
Client                          Server
  │                               │
  │  POST /auth/login             │
  │  { email, password }          │
  │ ─────────────────────────────►│
  │                               │── Find user by email
  │                               │── Compare password (bcrypt)
  │                               │── Generate new tokens
  │                               │── Update lastLogin
  │  { user, accessToken,         │
  │    refreshToken }             │
  │ ◄─────────────────────────────│
```

### Token Refresh Flow

```
Client                          Server
  │                               │
  │  [API call with expired       │
  │   access token]               │
  │ ─────────────────────────────►│
  │  401 Unauthorized             │
  │ ◄─────────────────────────────│
  │                               │
  │  POST /auth/refresh           │
  │  { refreshToken }             │
  │ ─────────────────────────────►│
  │                               │── Verify refresh token
  │                               │── Check token exists in DB
  │                               │── Generate new access token
  │  { accessToken }              │
  │ ◄─────────────────────────────│
  │                               │
  │  [Retry original request      │
  │   with new token]             │
```

---

## Token Specification

### Access Token

| Property     | Value                                  |
| ------------ | -------------------------------------- |
| **Type**     | JWT (HS256)                            |
| **Expiry**   | 15 minutes                             |
| **Storage**  | Client memory (React state)            |
| **Payload**  | `{ id, email, role, iat, exp }`        |
| **Sent via** | `Authorization: Bearer <token>` header |

### Refresh Token

| Property         | Value                                    |
| ---------------- | ---------------------------------------- |
| **Type**         | JWT (HS256)                              |
| **Expiry**       | 7 days                                   |
| **Storage**      | httpOnly cookie OR localStorage          |
| **Payload**      | `{ id, iat, exp }`                       |
| **Sent via**     | Request body or cookie                   |
| **DB Reference** | Stored in user document for invalidation |

---

## Password Security

| Aspect           | Implementation                                  |
| ---------------- | ----------------------------------------------- |
| **Algorithm**    | bcrypt                                          |
| **Salt Rounds**  | 12                                              |
| **Min Length**   | 8 characters                                    |
| **Requirements** | Uppercase, lowercase, number, special character |
| **Storage**      | Never stored in plain text; only bcrypt hash    |

### Password Validation Schema (Joi)

```javascript
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number, and special character",
  });
```

---

## Role-Based Access Control (RBAC)

| Role         | Permissions                                                 |
| ------------ | ----------------------------------------------------------- |
| `enthusiast` | View feed, manage personal watchlist, receive alerts, chat  |
| `researcher` | All enthusiast + data export, advanced filters              |
| `admin`      | All researcher + user management, system alerts, moderation |

---

## Security Best Practices Implemented

1. **Password hashing** with bcrypt (12 salt rounds)
2. **Short-lived access tokens** (15 min) to limit exposure
3. **Refresh token rotation** — old refresh token invalidated on refresh
4. **httpOnly cookies** for refresh token storage (prevents XSS access)
5. **Rate limiting** on auth endpoints (20 requests / 15 min)
6. **Input validation** with Joi schemas on all endpoints
7. **Helmet** for security headers
8. **CORS** configured with specific allowed origins
9. **Token blacklisting** on logout

---

> **Next**: [SECURITY.md](./SECURITY.md) for comprehensive security practices →
