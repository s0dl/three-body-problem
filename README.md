# Three-Body Problem

A real-time, interactive simulation of the three-body gravitational problem, inspired by Liu Cixin's *The Three-Body Problem* and the Trisolaran star system. Watch stable orbits slowly unravel into chaos.

Many displayed units (AU distances, km/s velocities, elapsed years) are approximations based on normalized simulation units. The orbital motion is integrated from Newtonian gravity; the real-world labels are calibrated for readability.

---

## What is the Three-Body Problem?

In 1687, Newton solved the two-body problem — predicting the motion of any two objects under mutual gravity with perfect precision. The moment a third body enters the system, all predictability collapses. There is no general closed-form solution. The system is chaotic by nature.

This simulation lets you explore different configurations, from rare periodic orbits like the figure-8 to eventual ejection, all emerging naturally from Newtonian gravity.

---

## Features

- Real-time gravitational simulation using a 4th-order Runge-Kutta (RK4) integrator
- Multiple special solutions — Figure-8, Lagrange L4, Euler Collinear, Flying Star, and more
- 3D space environment with full orbit, pan, and zoom controls
- Orbital trails showing the paths carved through space
- Three individualistic suns with distinct masses, sizes, colors, and light intensities
- Time controls — slow down or speed up to 100× real time
- Astronomical unit display (AU, km/s, years)
- Mass-luminosity relationship (L ∝ M³·⁵)
- Unit tests covering physics invariants, solution validity, and display formatting

---

## Tech Stack

### Framework
| Library | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) (Pages Router) | React framework and routing |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling and layout |

### 3D Rendering
| Library | Purpose |
|---|---|
| [Three.js](https://threejs.org/) | WebGL 3D engine |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | React renderer for Three.js |
| [@react-three/drei](https://github.com/pmndrs/drei) | Three.js helpers — OrbitControls, Stars, Line |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | Bloom and post-processing effects |

### Physics
| Approach | Details |
|---|---|
| Custom RK4 integrator | 4th-order Runge-Kutta, 50 steps/frame at dt=0.0001 |
| Softening parameter | Prevents infinite force on close approach |
| Zero-momentum correction | All solutions satisfy Σ(m·v) = 0 to keep system on screen |

### State Management
| Library | Purpose |
|---|---|
| [Zustand](https://zustand-demo.pmnd.rs/) | Global simulation state |

### Runtime
| Tool | Purpose |
|---|---|
| [Bun](https://bun.sh/) | Package manager and dev server |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 18+

### Installation

```bash
git clone https://github.com/s0dl/three-body-problem.git
cd three-body-problem
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Checks

```bash
bun run lint
bun run test
bun run coverage
bun run build
```

---

## Controls

| Input | Action |
|---|---|
| Left click + drag | Orbit around the system |
| Scroll wheel | Zoom in / out |
| Right click + drag | Pan |
| Speed presets | ¼× · ½× · 1× · 5× · 10× · 50× · 100× |
| Slider | Fine-grained time scale control |
| Pause / Resume | Freeze the simulation |
| Reset | Restart the current solution |

---

## Physics Notes

The simulation uses **normalized units** where G = 1 and masses are in solar mass units. Displayed values are converted using the following calibration:

- **1 normalized time unit ≈ 3 years**
- **1 normalized length unit ≈ 0.3 AU**
- **1 normalized velocity unit ≈ 30 km/s**

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Author

Built by [s0dl](https://github.com/s0dl)

*Inspired by Liu Cixin's* The Three-Body Problem *trilogy.*
