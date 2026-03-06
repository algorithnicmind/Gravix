# 🛰️ NASA API Integration — Cosmic Watch

## Overview

Cosmic Watch integrates with NASA's **Near Earth Object Web Service (NeoWs)** — a RESTful API that provides data about asteroids based on their closest approach date to Earth.

---

## API Configuration

| Property            | Value                                              |
| ------------------- | -------------------------------------------------- |
| **Base URL**        | `https://api.nasa.gov/neo/rest/v1`                 |
| **Auth**            | API Key (query parameter `api_key`)                |
| **Rate Limit**      | ~1,000 requests/hour (free tier)                   |
| **Response Format** | JSON                                               |
| **Free Key**        | Available at [api.nasa.gov](https://api.nasa.gov/) |
| **Demo Key**        | `DEMO_KEY` (limited: 30/hr, 50/day)                |

---

## Endpoints Used

### 1. Feed Endpoint — `/feed`

Get asteroids based on their closest approach date to Earth.

```
GET https://api.nasa.gov/neo/rest/v1/feed
  ?start_date=2026-02-12
  &end_date=2026-02-15
  &api_key=YOUR_API_KEY
```

**Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `start_date` | YYYY-MM-DD | No | Default: today |
| `end_date` | YYYY-MM-DD | No | Default: start_date + 7 |
| `api_key` | string | Yes | Your NASA API key |

**Note**: Max 7-day range per request

**Response Structure**:

```json
{
  "element_count": 25,
  "near_earth_objects": {
    "2026-02-12": [
      {
        "id": "3542519",
        "neo_reference_id": "3542519",
        "name": "(2010 PK9)",
        "nasa_jpl_url": "https://ssd.jpl.nasa.gov/...",
        "absolute_magnitude_h": 21.34,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.101,
            "estimated_diameter_max": 0.226
          },
          "meters": {
            "estimated_diameter_min": 101.05,
            "estimated_diameter_max": 226.05
          }
        },
        "is_potentially_hazardous_asteroid": true,
        "close_approach_data": [
          {
            "close_approach_date": "2026-02-12",
            "close_approach_date_full": "2026-Feb-12 09:30",
            "epoch_date_close_approach": 1771142400000,
            "relative_velocity": {
              "kilometers_per_second": "12.345",
              "kilometers_per_hour": "44442.00",
              "miles_per_hour": "27612.10"
            },
            "miss_distance": {
              "astronomical": "0.0234567890",
              "lunar": "9.1234567890",
              "kilometers": "3510000.00",
              "miles": "2181000.00"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": false
      }
    ]
  }
}
```

### 2. Lookup Endpoint — `/neo/{asteroid_id}`

Get detailed data for a specific asteroid by its SPK-ID.

```
GET https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=YOUR_API_KEY
```

Returns: Full orbital data, all historical close approaches, diameter estimates.

### 3. Browse Endpoint — `/neo/browse`

Browse the full NEO catalogue with pagination.

```
GET https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=20&api_key=YOUR_API_KEY
```

---

## Data Transformation

NASA's data is transformed to our internal schema:

```javascript
// services/nasa.service.js
const transformNasaAsteroid = (nasaObj) => ({
  neoReferenceId: nasaObj.neo_reference_id,
  name: nasaObj.name,
  nasaJplUrl: nasaObj.nasa_jpl_url,
  isPotentiallyHazardous: nasaObj.is_potentially_hazardous_asteroid,
  estimatedDiameter: {
    kilometers: {
      min: nasaObj.estimated_diameter.kilometers.estimated_diameter_min,
      max: nasaObj.estimated_diameter.kilometers.estimated_diameter_max,
    },
    meters: {
      min: nasaObj.estimated_diameter.meters.estimated_diameter_min,
      max: nasaObj.estimated_diameter.meters.estimated_diameter_max,
    },
  },
  closeApproachData: nasaObj.close_approach_data.map((ca) => ({
    closeApproachDate: ca.close_approach_date,
    closeApproachDateFull: ca.close_approach_date_full,
    epochDateCloseApproach: ca.epoch_date_close_approach,
    relativeVelocity: {
      kilometersPerSecond: ca.relative_velocity.kilometers_per_second,
      kilometersPerHour: ca.relative_velocity.kilometers_per_hour,
    },
    missDistance: {
      astronomical: ca.miss_distance.astronomical,
      lunar: ca.miss_distance.lunar,
      kilometers: ca.miss_distance.kilometers,
    },
    orbitingBody: ca.orbiting_body,
  })),
  lastUpdated: new Date(),
});
```

---

## Caching Strategy

```
Request Flow:
                                      ┌─ Cache HIT ──► Return from MongoDB
Client ──► Backend ──► Check MongoDB ─┤
                                      └─ Cache MISS ──► Fetch NASA API
                                                            │
                                                    Transform & Store
                                                            │
                                                    Return to Client
```

| Cache Layer          | TTL     | Purpose                   |
| -------------------- | ------- | ------------------------- |
| MongoDB (primary)    | 6 hours | Reduce NASA API calls     |
| TTL Index            | 30 days | Auto-cleanup of old data  |
| In-memory (optional) | 30 min  | Ultra-fast repeat lookups |

### Cache Invalidation

- **Scheduled**: `dataRefresh.job.js` runs every 6 hours to refresh today's data
- **Manual**: Admin endpoint to force cache refresh
- **TTL**: MongoDB TTL index auto-deletes documents after 30 days

---

## Error Handling & Fallbacks

| Scenario                    | Handling                                  |
| --------------------------- | ----------------------------------------- |
| NASA API timeout (>5s)      | Serve cached data + show stale indicator  |
| NASA API 403 (rate limited) | Use `DEMO_KEY` as fallback + serve cache  |
| NASA API 500                | Return cached data if available, else 502 |
| Invalid date range          | Return 400 with validation error          |
| No data for date range      | Return empty array with meta              |

---

## Rate Limit Management

```javascript
// NASA API rate limit awareness
const NASA_RATE_LIMIT = {
  maxPerHour: 1000,
  requestCount: 0,
  windowStart: Date.now(),

  canMakeRequest() {
    if (Date.now() - this.windowStart > 3600000) {
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
    return this.requestCount < this.maxPerHour;
  },
};
```

---

> **Next**: [RISK_ANALYSIS_ENGINE.md](./RISK_ANALYSIS_ENGINE.md) for the scoring algorithm →
