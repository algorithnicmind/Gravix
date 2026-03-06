# ⚠️ Risk Analysis Engine — Cosmic Watch

## Overview

The Risk Analysis Engine transforms raw asteroid data (distance, size, velocity, hazard status) into an intuitive **composite risk score (0-100)** with categorical classification. This makes complex orbital data accessible to non-experts.

---

## Risk Score Algorithm

### Formula

```
Risk Score = (W_dist × Distance_Factor) +
             (W_size × Size_Factor) +
             (W_vel  × Velocity_Factor) +
             (W_haz  × Hazard_Bonus)

Total: 0–100
```

### Weight Distribution

| Factor              | Weight | Max Points | Rationale                               |
| ------------------- | ------ | ---------- | --------------------------------------- |
| **Distance Factor** | 0.35   | 35         | Most critical — closer = more dangerous |
| **Size Factor**     | 0.30   | 30         | Larger objects cause more damage        |
| **Velocity Factor** | 0.20   | 20         | Higher speed = more kinetic energy      |
| **Hazard Bonus**    | 0.15   | 15         | NASA's own classification as dangerous  |

---

### Factor Calculations

#### 1. Distance Factor (0-35 points)

Based on miss distance in Astronomical Units (AU).

```javascript
const calculateDistanceFactor = (missDistanceAU) => {
  const au = parseFloat(missDistanceAU);

  if (au <= 0.001) return 35; // < 149,600 km — Extremely close
  if (au <= 0.005) return 30; // < 748,000 km
  if (au <= 0.01) return 25; // < 1.5M km
  if (au <= 0.02) return 20; // < 3M km
  if (au <= 0.05) return 15; // < 7.5M km — PHA threshold
  if (au <= 0.1) return 10; // < 15M km
  if (au <= 0.2) return 5; // < 30M km
  return 0; // > 30M km — Very far
};
```

**Reference Distances**:
| AU | Kilometers | Lunar Distances | Risk Points |
|----|-----------|----------------|-------------|
| 0.001 | ~150,000 | ~0.4 LD | 35 (Max) |
| 0.005 | ~748,000 | ~1.9 LD | 30 |
| 0.01 | ~1.5M | ~3.9 LD | 25 |
| 0.05 | ~7.5M | ~19.5 LD | 15 |
| 0.1 | ~15M | ~39 LD | 10 |
| 0.2+ | ~30M+ | ~78+ LD | 0 |

#### 2. Size Factor (0-30 points)

Based on estimated maximum diameter in kilometres.

```javascript
const calculateSizeFactor = (diameterMaxKm) => {
  const d = parseFloat(diameterMaxKm);

  if (d >= 1.0) return 30; // ≥ 1 km — Global catastrophe potential
  if (d >= 0.5) return 25; // 500m+ — Regional devastation
  if (d >= 0.14) return 20; // 140m+ — PHA size threshold
  if (d >= 0.05) return 15; // 50m+ — City-scale damage (Tunguska)
  if (d >= 0.02) return 10; // 20m+ — Chelyabinsk-class
  if (d >= 0.01) return 5; // 10m+ — Bolide / airburst
  return 0; // < 10m — Burns up in atmosphere
};
```

**Reference Sizes**:
| Diameter | Comparison | Impact Effect | Risk Points |
|----------|-----------|---------------|-------------|
| ≥1 km | 10 football fields | Global catastrophe / mass extinction | 30 |
| 500m | 5 football fields | Continental devastation | 25 |
| 140m | 1.5 football fields | Country-scale destruction | 20 |
| 50m | Half football field | City destruction (Tunguska, 1908) | 15 |
| 20m | Bowling lane | Building damage (Chelyabinsk, 2013) | 10 |
| 10m | Bus length | Airburst, window breakage | 5 |
| <10m | Car | Burns up in atmosphere | 0 |

#### 3. Velocity Factor (0-20 points)

Based on relative velocity in km/s.

```javascript
const calculateVelocityFactor = (velocityKmPerSec) => {
  const v = parseFloat(velocityKmPerSec);

  if (v >= 30) return 20; // Hypersonic — extreme energy
  if (v >= 20) return 16; // Very fast
  if (v >= 15) return 12; // Fast
  if (v >= 10) return 8; // Moderate
  if (v >= 5) return 4; // Slow (for an asteroid)
  return 0; // Very slow
};
```

#### 4. Hazard Bonus (0-15 points)

Based on NASA's Potentially Hazardous Asteroid (PHA) classification.

```javascript
const calculateHazardBonus = (isPotentiallyHazardous) => {
  return isPotentiallyHazardous ? 15 : 0;
};
```

---

## Risk Categories

| Score Range | Category       | Color              | Icon | Description                  |
| ----------- | -------------- | ------------------ | ---- | ---------------------------- |
| 0-15        | **Negligible** | `#00d2d3` (Teal)   | ✅   | No significant risk          |
| 16-35       | **Low**        | `#1dd1a1` (Green)  | ℹ️   | Minimal risk, routine pass   |
| 36-55       | **Moderate**   | `#feca57` (Yellow) | ⚠️   | Notable but manageable       |
| 56-75       | **High**       | `#ff9f43` (Orange) | 🔶   | Significant attention needed |
| 76-100      | **Critical**   | `#ff4757` (Red)    | 🔴   | Maximum alert level          |

---

## Torino Scale Mapping

The Torino Scale is the internationally recognised system for categorising NEO impact hazard. Our risk scores map to Torino levels:

| Torino Level | Our Category | Description                                      |
| ------------ | ------------ | ------------------------------------------------ |
| 0            | Negligible   | No hazard — object too small or too far          |
| 1-2          | Low          | Routine discovery, merits attention              |
| 3-4          | Moderate     | Close encounter, merits public attention         |
| 5-7          | High         | Threatening — governmental attention needed      |
| 8-10         | Critical     | Certain collision — varying scale of destruction |

---

## Complete Risk Calculation Function

```javascript
// services/risk.service.js
export const calculateRisk = (asteroid) => {
  const closeApproach = asteroid.closeApproachData[0];

  const distanceFactor = calculateDistanceFactor(
    closeApproach.missDistance.astronomical,
  );
  const sizeFactor = calculateSizeFactor(
    asteroid.estimatedDiameter.kilometers.max,
  );
  const velocityFactor = calculateVelocityFactor(
    closeApproach.relativeVelocity.kilometersPerSecond,
  );
  const hazardBonus = calculateHazardBonus(asteroid.isPotentiallyHazardous);

  const riskScore = Math.min(
    100,
    distanceFactor + sizeFactor + velocityFactor + hazardBonus,
  );

  const riskCategory = getRiskCategory(riskScore);

  return {
    riskScore,
    riskCategory,
    factors: { distanceFactor, sizeFactor, velocityFactor, hazardBonus },
  };
};

const getRiskCategory = (score) => {
  if (score <= 15) return "Negligible";
  if (score <= 35) return "Low";
  if (score <= 55) return "Moderate";
  if (score <= 75) return "High";
  return "Critical";
};
```

---

## Example Risk Calculations

### Example 1: Low Risk Asteroid

```
Name: (2023 AB1)
Distance: 0.15 AU (22.4M km)
Diameter: 0.03 km (30m)
Velocity: 8 km/s
Hazardous: No

Distance Factor:  5 (0.1 < 0.15 < 0.2)
Size Factor:     10 (0.02 < 0.03 < 0.05)
Velocity Factor:  4 (5 < 8 < 10)
Hazard Bonus:     0

TOTAL: 19 → Category: LOW ℹ️
```

### Example 2: High Risk Asteroid

```
Name: (2024 XY99)
Distance: 0.008 AU (1.2M km)
Diameter: 0.2 km (200m)
Velocity: 22 km/s
Hazardous: Yes

Distance Factor: 25 (0.005 < 0.008 < 0.01)
Size Factor:     20 (0.14 < 0.2 < 0.5)
Velocity Factor: 16 (20 < 22 < 30)
Hazard Bonus:    15

TOTAL: 76 → Category: CRITICAL 🔴
```

---

> **Next**: [ALERT_SYSTEM.md](./ALERT_SYSTEM.md) for notification system details →
