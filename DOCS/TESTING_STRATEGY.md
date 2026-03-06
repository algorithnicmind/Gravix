# 🧪 Testing Strategy — Cosmic Watch

## Overview

Comprehensive testing across all layers to ensure reliability, with a target of **>80% code coverage**.

---

## Testing Stack

| Tool                      | Layer              | Purpose                                     |
| ------------------------- | ------------------ | ------------------------------------------- |
| **Jest**                  | Backend + Frontend | Test runner and assertion library           |
| **Supertest**             | Backend            | HTTP endpoint integration testing           |
| **React Testing Library** | Frontend           | Component rendering and interaction testing |
| **MongoDB Memory Server** | Backend            | In-memory MongoDB for isolated testing      |

---

## Testing Pyramid

```
          ╱╲
         ╱  ╲        E2E Tests (Manual/Postman)
        ╱    ╲       → Full flow testing via Postman collection
       ╱──────╲
      ╱        ╲     Integration Tests
     ╱          ╲    → API endpoints with Supertest
    ╱            ╲   → Component tests with React Testing Library
   ╱──────────────╲
  ╱                ╲  Unit Tests
 ╱                  ╲ → Services, utils, validators, risk engine
╱____________________╲
```

---

## Backend Tests

### Unit Tests

| Module            | What to Test                                     |
| ----------------- | ------------------------------------------------ |
| `risk.service.js` | Score calculation, category mapping, edge cases  |
| `auth.service.js` | Token generation, password hashing, verification |
| `nasa.service.js` | Data transformation, error handling              |
| `validators.js`   | All Joi schemas with valid/invalid inputs        |
| `helpers.js`      | Date formatting, parsing utilities               |

### Integration Tests

| Endpoint                | Tests                                              |
| ----------------------- | -------------------------------------------------- |
| `POST /auth/register`   | Valid registration, duplicate email, weak password |
| `POST /auth/login`      | Valid login, wrong password, non-existent user     |
| `GET /asteroids/feed`   | Valid date range, invalid dates, auth required     |
| `GET /asteroids/:id`    | Valid ID, not found, auth required                 |
| `POST /users/watchlist` | Add, duplicate, auth required                      |
| `GET /alerts`           | With/without filters, pagination, auth required    |

### Example Test

```javascript
// __tests__/risk.service.test.js
describe("Risk Service", () => {
  describe("calculateRisk", () => {
    it("should return Critical for close, large, fast, hazardous asteroid", () => {
      const asteroid = {
        isPotentiallyHazardous: true,
        estimatedDiameter: { kilometers: { max: 0.5 } },
        closeApproachData: [
          {
            missDistance: { astronomical: "0.003" },
            relativeVelocity: { kilometersPerSecond: "25" },
          },
        ],
      };
      const result = calculateRisk(asteroid);
      expect(result.riskScore).toBeGreaterThanOrEqual(76);
      expect(result.riskCategory).toBe("Critical");
    });

    it("should return Negligible for far, small, slow asteroid", () => {
      const asteroid = {
        isPotentiallyHazardous: false,
        estimatedDiameter: { kilometers: { max: 0.005 } },
        closeApproachData: [
          {
            missDistance: { astronomical: "0.3" },
            relativeVelocity: { kilometersPerSecond: "3" },
          },
        ],
      };
      const result = calculateRisk(asteroid);
      expect(result.riskScore).toBeLessThanOrEqual(15);
      expect(result.riskCategory).toBe("Negligible");
    });
  });
});
```

---

## Frontend Tests

### Component Tests

| Component      | What to Test                                |
| -------------- | ------------------------------------------- |
| `AsteroidCard` | Renders name, risk badge, metrics correctly |
| `RiskBadge`    | Correct color/label for each risk category  |
| `AlertBell`    | Shows correct unread count                  |
| `LoginPage`    | Form validation, submit, error display      |
| `FilterBar`    | Filter changes trigger data refresh         |

### Hook Tests

| Hook           | What to Test                               |
| -------------- | ------------------------------------------ |
| `useAsteroids` | Fetches data, handles loading/error states |
| `useAlerts`    | Returns alerts, handles mark-as-read       |
| `useAuth`      | Login/logout state changes                 |

---

## E2E Testing (via Postman)

The Postman collection (`postman/CosmicWatch.postman_collection.json`) covers full flow testing:

1. **Register** → save token
2. **Login** → verify token
3. **Get Feed** → verify asteroids returned
4. **Lookup Asteroid** → verify detail data
5. **Add to Watchlist** → verify creation
6. **Get Watchlist** → verify asteroid listed
7. **Get Alerts** → verify alert structure
8. **Update Profile** → verify preferences saved

---

## Coverage Targets

| Layer               | Target | Tool                  |
| ------------------- | ------ | --------------------- |
| Backend Services    | >90%   | Jest                  |
| Backend Controllers | >80%   | Jest + Supertest      |
| Frontend Components | >75%   | React Testing Library |
| Overall             | >80%   | Combined              |

### Run Tests

```bash
# Backend
cd server && npm test
cd server && npm run test:coverage

# Frontend
cd client && npm test
cd client && npm run test:coverage
```

---

## Test Configuration

```javascript
// server/jest.config.js
module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/config/**"],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  setupFilesAfterSetup: ["./tests/setup.js"],
};
```

---

> **Next**: [SECURITY.md](./SECURITY.md) for security best practices →
