# 🛡️ Security — Cosmic Watch

## Overview

Security practices following OWASP guidelines to protect user data, prevent common web vulnerabilities, and ensure safe API interactions.

---

## Security Measures

### 1. Authentication Security

| Measure               | Implementation                                          |
| --------------------- | ------------------------------------------------------- |
| Password Hashing      | bcrypt with 12 salt rounds                              |
| Password Requirements | Min 8 chars, uppercase, lowercase, number, special char |
| JWT Access Tokens     | 15-minute expiry, HS256 signing                         |
| JWT Refresh Tokens    | 7-day expiry, stored in httpOnly cookie                 |
| Token Rotation        | Old refresh token invalidated on refresh                |
| Token Blacklisting    | Revoked on logout                                       |
| Rate Limiting (auth)  | 20 requests / 15 min on auth endpoints                  |

### 2. HTTP Security Headers (Helmet)

| Header                      | Value              | Purpose                     |
| --------------------------- | ------------------ | --------------------------- |
| `Content-Security-Policy`   | Restrictive CSP    | Prevent XSS, data injection |
| `X-Content-Type-Options`    | `nosniff`          | Prevent MIME sniffing       |
| `X-Frame-Options`           | `DENY`             | Prevent clickjacking        |
| `X-XSS-Protection`          | `1; mode=block`    | Legacy XSS protection       |
| `Strict-Transport-Security` | `max-age=31536000` | Force HTTPS                 |
| `Referrer-Policy`           | `no-referrer`      | Prevent referrer leakage    |

### 3. Input Validation

- **All inputs validated** using Joi schemas before processing
- **Request body size limit**: 10KB (`express.json({ limit: '10kb' })`)
- **URL parameter validation** for IDs and dates
- **Query parameter sanitisation** for search queries

### 4. API Security

| Measure                   | Implementation                                 |
| ------------------------- | ---------------------------------------------- |
| CORS                      | Specific allowed origins only                  |
| Rate Limiting             | 100 req / 15 min (general), 20 / 15 min (auth) |
| Request Size Limit        | 10KB body limit                                |
| API Versioning            | `/api/v1/` prefix                              |
| No Sensitive Data in URLs | Tokens in headers, not query params            |

### 5. Database Security

| Measure                   | Implementation                       |
| ------------------------- | ------------------------------------ |
| Mongoose Schemas          | Type validation at ODM layer         |
| No Raw Queries            | Mongoose prevents NoSQL injection    |
| MongoDB Auth              | Username/password authentication     |
| Sensitive Field Exclusion | Password excluded from query results |

### 6. Chat Security (Bonus)

- Message text sanitised (XSS prevention)
- Character limit (1000) per message
- Rate limiting on message sends
- JWT-authenticated WebSocket connections

---

## OWASP Top 10 Compliance

| #   | Vulnerability             | Mitigation                                          |
| --- | ------------------------- | --------------------------------------------------- |
| A01 | Broken Access Control     | JWT auth on all protected routes, role checks       |
| A02 | Cryptographic Failures    | bcrypt hashing, JWT HS256, HTTPS                    |
| A03 | Injection                 | Mongoose ODM, Joi validation, parameterised queries |
| A04 | Insecure Design           | Principle of least privilege, input validation      |
| A05 | Security Misconfiguration | Helmet headers, restrictive CORS, env-based config  |
| A06 | Vulnerable Components     | Regular `npm audit`, dependency updates             |
| A07 | Auth Failures             | Short-lived tokens, strong passwords, rate limiting |
| A08 | Data Integrity Failures   | Input validation, schema enforcement                |
| A09 | Logging Failures          | Morgan logging, error logging, audit trail          |
| A10 | SSRF                      | Whitelist NASA API URL only for external requests   |

---

## Environment Variable Security

- **Never commit `.env`** — included in `.gitignore`
- **`.env.example`** provided with placeholder values
- **Strong secrets** in production (min 256-bit JWT secret)
- **Docker secrets** for production deployment

---

## Security Checklist for Deployment

- [ ] All default passwords changed
- [ ] JWT_SECRET is a strong random string (32+ characters)
- [ ] HTTPS enabled via reverse proxy / SSL certificate
- [ ] CORS configured with production domain only
- [ ] MongoDB authentication enabled
- [ ] `NODE_ENV=production` set
- [ ] Rate limiting active on all endpoints
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Sensitive fields never returned in API responses
- [ ] Error messages don't expose internal details in production

---

> **Next**: [WIREFRAMES.md](./WIREFRAMES.md) for UI/UX design specifications →
