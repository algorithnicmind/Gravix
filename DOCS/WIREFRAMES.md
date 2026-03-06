# 🎨 Wireframes — Cosmic Watch

## Design Philosophy

- **Space-themed dark UI** — Deep navy/black backgrounds with vibrant accent colours
- **Glassmorphism** — Semi-transparent cards with backdrop blur
- **Glow effects** — Neon accents on interactive elements
- **Data-dense but clear** — Show lots of information without overwhelming

---

## Color Palette

| Token                | Color           | Hex       | Usage                            |
| -------------------- | --------------- | --------- | -------------------------------- |
| Background Primary   | Deep Space      | `#0a0e1a` | Page background                  |
| Background Secondary | Dark Navy       | `#121829` | Section backgrounds              |
| Card Background      | Midnight        | `#1a2035` | Cards, panels                    |
| Accent               | Electric Purple | `#6c5ce7` | CTAs, links, highlights          |
| Success / Safe       | Teal            | `#00d2d3` | Negligible risk, safe indicators |
| Warning              | Amber           | `#feca57` | Moderate risk, caution           |
| Danger               | Coral           | `#ff6b6b` | High risk                        |
| Critical             | Crimson         | `#ff4757` | Critical risk                    |
| Text Primary         | Ghost White     | `#e4e8f1` | Main text                        |
| Text Secondary       | Slate           | `#8892b0` | Labels, hints                    |

---

## Typography

| Element          | Font           | Weight        | Size    |
| ---------------- | -------------- | ------------- | ------- |
| Headings         | Inter          | 700 (Bold)    | 24-48px |
| Body             | Inter          | 400 (Regular) | 14-16px |
| Monospace (data) | JetBrains Mono | 400           | 13-14px |
| Labels           | Inter          | 500 (Medium)  | 12-13px |

---

## Page Wireframes

### 1. Landing Page

```
┌─────────────────────────────────────────────────────────┐
│  Logo   [Dashboard]  [About]           [Login] [SignUp] │  ← Navbar
├─────────────────────────────────────────────────────────┤
│                                                         │
│         ✦ ✦   ✦                    ✦   ✦                │  ← Animated
│                                                         │     starfield
│              🌌 COSMIC WATCH                            │
│        Track Near-Earth Objects in Real-Time            │
│                                                         │
│        [ Get Started →]   [ Learn More ]                │  ← CTA buttons
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│   │ 📡       │  │ ⚠️       │  │ 🔔       │             │
│   │ Live     │  │ Risk     │  │ Smart    │             │
│   │ Data     │  │ Analysis │  │ Alerts   │             │
│   │ Feed     │  │ Engine   │  │ System   │             │
│   └──────────┘  └──────────┘  └──────────┘             │  ← Features
│                                                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│   │ 🌍       │  │ 💬       │  │ 🐳       │             │
│   │ 3D       │  │ Community│  │ Docker   │             │
│   │ View     │  │ Chat     │  │ Ready    │             │
│   └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│   [ 15,234 NEOs Tracked ]  [ 847 Hazardous ]           │  ← Stats bar
└─────────────────────────────────────────────────────────┘
```

### 2. Dashboard Page

```
┌─────────────────────────────────────────────────────────┐
│  Logo   [Dashboard] [Watchlist] [3D View]   🔔 👤      │  ← Navbar
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ Total NEOs │ │ Hazardous  │ │ Closest    │          │
│  │   Today    │ │   Count    │ │ Approach   │          │
│  │    25      │ │     3      │ │  0.02 AU   │          │  ← Stats cards
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                         │
│  ┌─────────────────────────────────┐ ┌───────────────┐  │
│  │  📅 Date: [2026-02-12] to [19] │ │  Risk Chart   │  │
│  │  Filter: [All ▼] Sort: [Risk▼] │ │  ┌──────────┐ │  │
│  │                                 │ │  │ 🟢 40%   │ │  │
│  │  ┌───────────────────────────┐  │ │  │ 🟡 30%   │ │  │
│  │  │ ☄️ (2010 PK9)       🔴 72│  │ │  │ 🔴 15%   │ │  │
│  │  │ 0.023 AU | 12.3 km/s     │  │ │  │ ⚪ 15%   │ │  │
│  │  │ Diameter: 101-226m        │  │ │  └──────────┘ │  │
│  │  │ [⭐ Watch] [Details →]    │  │ │               │  │
│  │  └───────────────────────────┘  │ │  Upcoming     │  │
│  │                                 │ │  Approaches:  │  │
│  │  ┌───────────────────────────┐  │ │  • Feb 13 →   │  │
│  │  │ ☄️ (2024 AB1)       🟡 42│  │ │  • Feb 14 →   │  │
│  │  │ 0.085 AU | 8.1 km/s      │  │ │  • Feb 15 →   │  │
│  │  │ Diameter: 50-112m         │  │ │               │  │
│  │  │ [⭐ Watch] [Details →]    │  │ │               │  │
│  │  └───────────────────────────┘  │ │               │  │
│  │                                 │ │               │  │
│  │  [1] [2] [3] ► (pagination)     │ │               │  │
│  └─────────────────────────────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3. Asteroid Detail Page

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                          🔔 👤    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ☄️ (2010 PK9)                    [⭐ Add to Watchlist] │
│  NEO Reference ID: 3542519        Risk: ████████░░ 72  │
│  ⚠️ POTENTIALLY HAZARDOUS                    HIGH 🔶   │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Distance │ │ Velocity │ │ Diameter │ │ Risk     │   │
│  │          │ │          │ │          │ │ Score    │   │
│  │ 0.023 AU │ │ 12.3km/s │ │ 101-226m │ │   72    │   │
│  │ 9.1 LD   │ │ 44,442   │ │          │ │  HIGH   │   │
│  │ 3.5M km  │ │ km/h     │ │ 🏈🏈🏈  │ │  🔶     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │          3D ORBIT VISUALIZATION (Bonus)          │   │
│  │                                                  │   │
│  │              🌍 ─ ─ ─ ─ ☄️                       │   │
│  │            /               \                     │   │
│  │           /     orbit       \                    │   │
│  │          ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                    │   │
│  │                                                  │   │
│  │  [Zoom +] [Zoom -] [Reset] [Scale: Enhanced ▼]  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ── Risk Factor Breakdown ──                            │
│  Distance:  ████████████░░░ 25/35                       │
│  Size:      ████████████░░░ 20/30                       │
│  Velocity:  ████████░░░░░░░ 16/20                       │
│  Hazard:    ███████████████ 15/15                        │
│                                                         │
│  ── Close Approach History ──                           │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │ Date     │ Distance │ Velocity │ Body     │          │
│  ├──────────┼──────────┼──────────┼──────────┤          │
│  │ 2026-02  │ 0.023 AU │ 12.3km/s │ Earth    │          │
│  │ 2025-08  │ 0.145 AU │ 9.8 km/s │ Earth    │          │
│  │ 2024-03  │ 0.089 AU │ 11.2km/s │ Earth    │          │
│  └──────────┴──────────┴──────────┴──────────┘          │
│                                                         │
│  ── Community Discussion (Bonus) ──                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Ankit: Has anyone observed this?       2 min ago │   │
│  │ User2: Yes, visible from 8" scope!     5 min ago │   │
│  │ ┌──────────────────────────────────┐ [Send]      │   │
│  │ │ Type your message...             │             │   │
│  │ └──────────────────────────────────┘             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4. Login / Register Pages

```
┌─────────────────────────────────────────────────────────┐
│  Logo                                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ✦  animated starfield  ✦                   │
│                                                         │
│           ┌─────────────────────────┐                   │
│           │    🌌 Welcome Back      │                   │
│           │                         │                   │
│           │  Email:                 │                   │
│           │  ┌───────────────────┐  │                   │
│           │  │                   │  │                   │
│           │  └───────────────────┘  │                   │
│           │                         │                   │
│           │  Password:              │                   │
│           │  ┌───────────────────┐  │                   │
│           │  │                   │  │                   │
│           │  └───────────────────┘  │                   │
│           │                         │                   │
│           │  [ 🚀 Launch In → ]     │                   │
│           │                         │                   │
│           │  Don't have an account? │                   │
│           │  Sign up here →         │                   │
│           └─────────────────────────┘                   │
│              (glassmorphism card)                        │
└─────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

| Breakpoint | Width       | Layout                       |
| ---------- | ----------- | ---------------------------- |
| Mobile     | < 640px     | Single column, stacked cards |
| Tablet     | 640-1024px  | Two-column grid              |
| Desktop    | 1024-1440px | Three-column dashboard       |
| Wide       | > 1440px    | Expanded with sidebar        |

---

## UI Animation Specifications

| Element            | Animation                    | Duration  | Easing      |
| ------------------ | ---------------------------- | --------- | ----------- |
| Page transition    | Fade + slide up              | 300ms     | ease-out    |
| Card hover         | Scale 1.02 + shadow increase | 200ms     | ease        |
| Risk badge         | Pulse glow (critical only)   | 2s loop   | ease-in-out |
| Alert bell         | Shake on new alert           | 500ms     | spring      |
| Loading spinner    | Orbit rotation               | 1.5s loop | linear      |
| Toast notification | Slide in from right          | 400ms     | spring      |
| Stats counter      | Count up animation           | 1s        | ease-out    |

---

> **Next**: [ROADMAP.md](./ROADMAP.md) for development phases →
