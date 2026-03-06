# 🌍 3D Visualisation — Cosmic Watch (Bonus Feature)

## Overview

An interactive 3D solar system view using **Three.js** (via **React Three Fiber**) to visualise asteroid orbits relative to Earth. Users can zoom, pan, rotate, and click asteroids for details.

---

## Technology

| Library                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| **Three.js**           | Core 3D rendering engine (WebGL)               |
| **@react-three/fiber** | React renderer for Three.js                    |
| **@react-three/drei**  | Helper components (OrbitControls, Stars, Text) |

---

## Scene Architecture

```
Scene
├── Ambient Light
├── Point Light (Sun position)
├── Stars (background starfield)
├── Earth
│   ├── Sphere Geometry (textured)
│   ├── Earth Texture Map
│   └── Rotation Animation
├── Moon (optional)
├── Asteroid Group
│   ├── Orbit Path (Line geometry - ellipse)
│   ├── Asteroid Marker (Sphere + glow)
│   └── Label (Text billboard)
├── OrbitControls (camera interaction)
└── Info Overlay (HTML overlay for selected asteroid)
```

---

## Key Components

### SolarSystemScene.jsx

Main canvas component that renders the 3D scene:

```jsx
<Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
  <ambientLight intensity={0.1} />
  <pointLight position={[100, 0, 0]} intensity={2} />
  <Stars radius={300} count={5000} />
  <Earth />
  {asteroids.map((a) => (
    <AsteroidMarker key={a.id} asteroid={a} onClick={setSelected} />
  ))}
  <OrbitControls enableDamping dampingFactor={0.05} />
</Canvas>
```

### Earth.jsx

Textured sphere representing Earth:

- Albedo texture, bump map, specular map
- Slow rotation animation
- Scale reference point for distances

### AsteroidMarker.jsx

Clickable 3D marker for each asteroid:

- Position calculated from orbital elements
- Color based on risk category
- Size scaled to estimated diameter
- Glow effect for hazardous objects
- Click handler to show detail overlay

### OrbitPath.jsx

Elliptical orbit path visualisation:

- Rendered as Line geometry
- Semi-transparent with risk-category color
- Dashed line style for non-hazardous

### ControlPanel.jsx

UI overlay for scene controls:

- Scale toggle (realistic vs exaggerated)
- Time slider (animate approach dates)
- Filter by risk category
- Toggle labels / orbit paths
- Reset camera position

---

## Visual Effects

| Effect               | Implementation                                     |
| -------------------- | -------------------------------------------------- |
| Starfield background | `<Stars>` from drei                                |
| Earth glow           | Custom shader material with atmospheric scattering |
| Asteroid glow        | `<Bloom>` post-processing for hazardous asteroids  |
| Orbit trails         | Line geometry with gradient opacity                |
| Selection highlight  | Emissive material + scale animation                |
| Smooth camera        | OrbitControls with damping                         |

---

## Coordinate Mapping

Converting astronomical data to 3D scene coordinates:

- **Scale**: 1 AU = 100 scene units (adjustable)
- **Earth**: Positioned at origin (0, 0, 0)
- **Asteroids**: Placed at miss distance from Earth along approach trajectory
- **Simplified**: Uses miss distance + approach angle (not full orbital elements)

---

## Performance Considerations

- Maximum 100 asteroid markers rendered at once
- LOD (Level of Detail): Far objects = simple dots, close = spheres
- Instanced mesh for multiple similar asteroids
- Texture compression for Earth maps
- RequestAnimationFrame for smooth 60fps rendering

---

> **Next**: [REAL_TIME_CHAT.md](./REAL_TIME_CHAT.md) for community chat feature →
