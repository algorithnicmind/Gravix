# 🗄️ Database Schema — Cosmic Watch

## Database: MongoDB 7 with Mongoose ODM

---

## Collections Overview

| Collection     | Purpose                              | Est. Documents |
| -------------- | ------------------------------------ | -------------- |
| `users`        | User accounts, preferences, auth     | <10,000        |
| `asteroids`    | Cached NASA asteroid data            | ~50,000        |
| `watchlists`   | User-asteroid tracking relationships | ~10,000        |
| `alerts`       | Generated notifications for users    | ~100,000       |
| `chatmessages` | Real-time chat messages (Bonus)      | ~500,000       |

---

## Schema Definitions

### 1. User Schema (`users` collection)

```javascript
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      // Stored as bcrypt hash (12 salt rounds)
    },
    role: {
      type: String,
      enum: ["enthusiast", "researcher", "admin"],
      default: "enthusiast",
    },
    avatar: {
      type: String,
      default: null, // URL to avatar image
    },
    alertPreferences: {
      distanceThreshold: {
        type: Number,
        default: 0.05, // Astronomical Units
      },
      riskScoreThreshold: {
        type: Number,
        default: 60,
        min: 0,
        max: 100,
      },
      notifyOnHazardous: {
        type: Boolean,
        default: true,
      },
      notifyOnWatchlist: {
        type: Boolean,
        default: true,
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

// Pre-save hook: hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method: compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

**Sample Document**:

```json
{
  "_id": "ObjectId('65a1b2c3d4e5f6...')",
  "name": "Ankit Sharma",
  "email": "ankit@example.com",
  "password": "$2b$12$LJ3...(hashed)",
  "role": "enthusiast",
  "alertPreferences": {
    "distanceThreshold": 0.05,
    "riskScoreThreshold": 60,
    "notifyOnHazardous": true,
    "notifyOnWatchlist": true
  },
  "refreshToken": "eyJhbGci...",
  "isActive": true,
  "lastLogin": "2026-02-12T15:00:00Z",
  "createdAt": "2026-02-10T10:00:00Z",
  "updatedAt": "2026-02-12T15:00:00Z"
}
```

---

### 2. Asteroid Schema (`asteroids` collection)

```javascript
const AsteroidSchema = new mongoose.Schema(
  {
    neoReferenceId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    nasaJplUrl: String,
    isPotentiallyHazardous: {
      type: Boolean,
      required: true,
      index: true,
    },
    estimatedDiameter: {
      kilometers: { min: Number, max: Number },
      meters: { min: Number, max: Number },
    },
    closeApproachData: [
      {
        closeApproachDate: { type: String, index: true },
        closeApproachDateFull: String,
        epochDateCloseApproach: Number,
        relativeVelocity: {
          kilometersPerSecond: String,
          kilometersPerHour: String,
          milesPerHour: String,
        },
        missDistance: {
          astronomical: String,
          lunar: String,
          kilometers: String,
          miles: String,
        },
        orbitingBody: { type: String, default: "Earth" },
      },
    ],
    orbitalData: {
      orbitId: String,
      orbitDeterminationDate: String,
      semiMajorAxis: String,
      eccentricity: String,
      inclination: String,
      orbitalPeriod: String,
      perihelionDistance: String,
      aphelionDistance: String,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      index: true,
    },
    riskCategory: {
      type: String,
      enum: ["Negligible", "Low", "Moderate", "High", "Critical"],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes
AsteroidSchema.index({
  "closeApproachData.closeApproachDate": 1,
  isPotentiallyHazardous: 1,
});
AsteroidSchema.index({ neoReferenceId: 1 }, { unique: true });

// TTL index: auto-delete after 30 days
AsteroidSchema.index(
  { lastUpdated: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 },
);
```

---

### 3. Watchlist Schema (`watchlists` collection)

```javascript
const WatchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asteroidId: {
      type: String, // NASA NEO reference ID
      required: true,
    },
    asteroidName: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: "",
    },
    customAlertThreshold: {
      distanceAU: Number,
      riskScore: Number,
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index (user can't watch same asteroid twice)
WatchlistSchema.index({ userId: 1, asteroidId: 1 }, { unique: true });
WatchlistSchema.index({ userId: 1 });
```

---

### 4. Alert Schema (`alerts` collection)

```javascript
const AlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "close_approach",
        "hazardous_detected",
        "watchlist_update",
        "risk_threshold",
      ],
      required: true,
    },
    asteroidId: String,
    asteroidName: String,
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["info", "warning", "danger", "critical"],
      default: "info",
    },
    data: {
      riskScore: Number,
      missDistanceKm: String,
      missDistanceAU: String,
      velocity: String,
      closeApproachDate: String,
    },
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  {
    timestamps: true,
  },
);

AlertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
AlertSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90-day TTL
```

---

### 5. ChatMessage Schema (`chatmessages` collection) — Bonus

```javascript
const ChatMessageSchema = new mongoose.Schema(
  {
    asteroidId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

ChatMessageSchema.index({ asteroidId: 1, createdAt: -1 });
```

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│  Users   │──1:N──│  Watchlists  │──N:1──│  Asteroids   │
│          │       │              │       │  (cached)    │
│  _id     │       │  userId      │       │  neoRefId    │
│  name    │       │  asteroidId  │       │  name        │
│  email   │       │  notes       │       │  hazardous   │
│  password│       └──────────────┘       │  diameter    │
│  role    │                              │  riskScore   │
│  prefs   │──1:N──┌──────────────┐       └──────────────┘
│          │       │   Alerts     │
└──────────┘       │              │
     │             │  userId      │
     │             │  asteroidId  │
     │             │  type        │
     │             │  severity    │
     │             │  isRead      │
     │             └──────────────┘
     │
     └──1:N──┌──────────────┐
             │ ChatMessages │
             │              │
             │  userId      │
             │  asteroidId  │
             │  text        │
             └──────────────┘
```

---

## Index Strategy

| Collection   | Index                                                 | Type            | Purpose            |
| ------------ | ----------------------------------------------------- | --------------- | ------------------ |
| users        | `{ email: 1 }`                                        | Unique          | Login lookup       |
| asteroids    | `{ neoReferenceId: 1 }`                               | Unique          | ID lookup          |
| asteroids    | `{ closeApproachDate: 1, isPotentiallyHazardous: 1 }` | Compound        | Feed queries       |
| asteroids    | `{ lastUpdated: 1 }`                                  | TTL (30 days)   | Auto-cleanup       |
| watchlists   | `{ userId: 1, asteroidId: 1 }`                        | Unique Compound | Prevent duplicates |
| alerts       | `{ userId: 1, isRead: 1, createdAt: -1 }`             | Compound        | User alert feed    |
| alerts       | `{ createdAt: 1 }`                                    | TTL (90 days)   | Auto-cleanup       |
| chatmessages | `{ asteroidId: 1, createdAt: -1 }`                    | Compound        | Thread messages    |

---

> **Next**: [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) for React architecture →
