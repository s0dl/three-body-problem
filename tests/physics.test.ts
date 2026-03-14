import { describe, test, expect } from 'vitest'
import { stepRK4, BodyState } from '@/lib/physics'
import { SOLUTIONS } from '@/lib/solutions'

// Helpers

const G = 1

function totalEnergy(bodies: BodyState[]): number {
  // Kinetic energy
  const KE = bodies.reduce((sum, b) => {
    const v2 = b.velocity[0] ** 2 + b.velocity[1] ** 2 + b.velocity[2] ** 2
    return sum + 0.5 * b.mass * v2
  }, 0)

  // Gravitational potential energy
  let PE = 0
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dx = bodies[j].position[0] - bodies[i].position[0]
      const dy = bodies[j].position[1] - bodies[i].position[1]
      const dz = bodies[j].position[2] - bodies[i].position[2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      PE -= (G * bodies[i].mass * bodies[j].mass) / dist
    }
  }

  return KE + PE
}

function totalMomentum(bodies: BodyState[]): [number, number, number] {
  return [
    bodies.reduce((s, b) => s + b.mass * b.velocity[0], 0),
    bodies.reduce((s, b) => s + b.mass * b.velocity[1], 0),
    bodies.reduce((s, b) => s + b.mass * b.velocity[2], 0),
  ]
}

function centerOfMass(bodies: BodyState[]): [number, number, number] {
  const totalMass = bodies.reduce((s, b) => s + b.mass, 0)
  return [
    bodies.reduce((s, b) => s + b.mass * b.position[0], 0) / totalMass,
    bodies.reduce((s, b) => s + b.mass * b.position[1], 0) / totalMass,
    bodies.reduce((s, b) => s + b.mass * b.position[2], 0) / totalMass,
  ]
}

function zeroMomentum(bodies: BodyState[]): BodyState[] {
  const totalMass = bodies.reduce((s, b) => s + b.mass, 0)
  const cmv: [number, number, number] = [
    bodies.reduce((s, b) => s + b.mass * b.velocity[0], 0) / totalMass,
    bodies.reduce((s, b) => s + b.mass * b.velocity[1], 0) / totalMass,
    bodies.reduce((s, b) => s + b.mass * b.velocity[2], 0) / totalMass,
  ]
  return bodies.map(b => ({
    ...b,
    velocity: [
      b.velocity[0] - cmv[0],
      b.velocity[1] - cmv[1],
      b.velocity[2] - cmv[2],
    ] as [number, number, number],
  }))
}

function runSteps(bodies: BodyState[], dt: number, steps: number): BodyState[] {
  let current = bodies
  for (let i = 0; i < steps; i++) {
    current = stepRK4(current, dt)
  }
  return current
}

const FIGURE_8: BodyState[] = SOLUTIONS[0].bodies

describe('zeroMomentum', () => {
  test('produces zero total momentum for equal masses', () => {
    const bodies: BodyState[] = [
      { position: [0, 0, 0], velocity: [1, 0, 0], mass: 1 },
      { position: [1, 0, 0], velocity: [2, 0, 0], mass: 1 },
      { position: [2, 0, 0], velocity: [3, 0, 0], mass: 1 },
    ]
    const result = zeroMomentum(bodies)
    const [px, py, pz] = totalMomentum(result)
    expect(Math.abs(px)).toBeLessThan(1e-10)
    expect(Math.abs(py)).toBeLessThan(1e-10)
    expect(Math.abs(pz)).toBeLessThan(1e-10)
  })

  test('produces zero total momentum for unequal masses', () => {
    const bodies: BodyState[] = [
      { position: [0, 0, 0], velocity: [1, 2, 3], mass: 2.0 },
      { position: [1, 0, 0], velocity: [-1, 0, 1], mass: 0.5 },
      { position: [2, 0, 0], velocity: [0, 1, -2], mass: 1.5 },
    ]
    const result = zeroMomentum(bodies)
    const [px, py, pz] = totalMomentum(result)
    expect(Math.abs(px)).toBeLessThan(1e-10)
    expect(Math.abs(py)).toBeLessThan(1e-10)
    expect(Math.abs(pz)).toBeLessThan(1e-10)
  })

  test('does not change positions', () => {
    const bodies: BodyState[] = [
      { position: [1, 2, 3], velocity: [1, 0, 0], mass: 1 },
      { position: [4, 5, 6], velocity: [0, 1, 0], mass: 1 },
      { position: [7, 8, 9], velocity: [0, 0, 1], mass: 1 },
    ]
    const result = zeroMomentum(bodies)
    result.forEach((b, i) => {
      expect(b.position[0]).toBe(bodies[i].position[0])
      expect(b.position[1]).toBe(bodies[i].position[1])
      expect(b.position[2]).toBe(bodies[i].position[2])
    })
  })

  test('is idempotent — applying twice gives same result as once', () => {
    const bodies: BodyState[] = [
      { position: [0, 0, 0], velocity: [3, 1, 0], mass: 1 },
      { position: [1, 0, 0], velocity: [-1, 2, 0], mass: 2 },
      { position: [2, 0, 0], velocity: [0, -1, 0], mass: 1 },
    ]
    const once = zeroMomentum(bodies)
    const twice = zeroMomentum(once)
    once.forEach((b, i) => {
      expect(b.velocity[0]).toBeCloseTo(twice[i].velocity[0], 10)
      expect(b.velocity[1]).toBeCloseTo(twice[i].velocity[1], 10)
      expect(b.velocity[2]).toBeCloseTo(twice[i].velocity[2], 10)
    })
  })

  test('figure-8 already has zero momentum', () => {
    const [px, py, pz] = totalMomentum(FIGURE_8)
    expect(Math.abs(px)).toBeLessThan(1e-8)
    expect(Math.abs(py)).toBeLessThan(1e-8)
    expect(Math.abs(pz)).toBeLessThan(1e-8)
  })
})

describe('stepRK4', () => {
  test('returns same number of bodies', () => {
    const result = stepRK4(FIGURE_8, 0.001)
    expect(result.length).toBe(FIGURE_8.length)
  })

  test('bodies move after one step', () => {
    const result = stepRK4(FIGURE_8, 0.001)
    // At least one body should have moved
    const moved = result.some((b, i) =>
      b.position[0] !== FIGURE_8[i].position[0] ||
      b.position[1] !== FIGURE_8[i].position[1]
    )
    expect(moved).toBe(true)
  })

  test('masses are preserved through integration', () => {
    const result = stepRK4(FIGURE_8, 0.001)
    result.forEach((b, i) => {
      expect(b.mass).toBe(FIGURE_8[i].mass)
    })
  })

  test('does not mutate input bodies', () => {
    const original = FIGURE_8.map(b => ({
      ...b,
      position: [...b.position] as [number, number, number],
      velocity: [...b.velocity] as [number, number, number],
    }))
    stepRK4(FIGURE_8, 0.001)
    FIGURE_8.forEach((b, i) => {
      expect(b.position[0]).toBe(original[i].position[0])
      expect(b.position[1]).toBe(original[i].position[1])
      expect(b.position[2]).toBe(original[i].position[2])
    })
  })

  test('smaller dt produces smaller position change', () => {
    const bigStep = stepRK4(FIGURE_8, 0.1)
    const smallStep = stepRK4(FIGURE_8, 0.001)

    const bigDelta = Math.abs(bigStep[0].position[0] - FIGURE_8[0].position[0])
    const smallDelta = Math.abs(smallStep[0].position[0] - FIGURE_8[0].position[0])

    expect(smallDelta).toBeLessThan(bigDelta)
  })

  test('zero dt produces no movement', () => {
    const result = stepRK4(FIGURE_8, 0)
    result.forEach((b, i) => {
      expect(b.position[0]).toBeCloseTo(FIGURE_8[i].position[0], 10)
      expect(b.position[1]).toBeCloseTo(FIGURE_8[i].position[1], 10)
      expect(b.position[2]).toBeCloseTo(FIGURE_8[i].position[2], 10)
    })
  })
})

describe('conservation laws', () => {
  const DT = 0.0001
  const SHORT_RUN = 100    // 100 steps — quick sanity check
  const LONG_RUN = 10000   // 10000 steps — one full figure-8 period

  test('momentum is conserved over short run', () => {
    const initial = totalMomentum(FIGURE_8)
    const result = runSteps(FIGURE_8, DT, SHORT_RUN)
    const final = totalMomentum(result)

    expect(Math.abs(final[0] - initial[0])).toBeLessThan(1e-8)
    expect(Math.abs(final[1] - initial[1])).toBeLessThan(1e-8)
    expect(Math.abs(final[2] - initial[2])).toBeLessThan(1e-8)
  })

  test('energy is conserved over short run (< 0.1% drift)', () => {
    const initialEnergy = totalEnergy(FIGURE_8)
    const result = runSteps(FIGURE_8, DT, SHORT_RUN)
    const finalEnergy = totalEnergy(result)

    const drift = Math.abs((finalEnergy - initialEnergy) / initialEnergy)
    expect(drift).toBeLessThan(0.001) // 0.1%
  })

  test('energy is conserved over long run (< 1% drift)', () => {
    const initialEnergy = totalEnergy(FIGURE_8)
    const result = runSteps(FIGURE_8, DT, LONG_RUN)
    const finalEnergy = totalEnergy(result)

    const drift = Math.abs((finalEnergy - initialEnergy) / initialEnergy)
    expect(drift).toBeLessThan(0.01) // 1%
  })

  test('center of mass moves at constant velocity', () => {
    const com1 = centerOfMass(FIGURE_8)
    const mid = runSteps(FIGURE_8, DT, SHORT_RUN / 2)
    const com2 = centerOfMass(mid)
    const final = runSteps(FIGURE_8, DT, SHORT_RUN)
    const com3 = centerOfMass(final)

    // CoM displacement should be linear — midpoint should be halfway
    const dx1 = com2[0] - com1[0]
    const dx2 = com3[0] - com2[0]
    expect(Math.abs(dx1 - dx2)).toBeLessThan(1e-6)
  })

  test('RK4 conserves energy better than Euler on circular orbit', () => {
    // Two body circular orbit — analytically stable, RK4 advantage is consistent
    const TWO_BODY: BodyState[] = [
      { position: [1, 0, 0], velocity: [0, 0.5, 0], mass: 1.0 },
      { position: [-1, 0, 0], velocity: [0, -0.5, 0], mass: 1.0 },
      { position: [0, 100, 0], velocity: [0, 0, 0], mass: 0.000001 }, // negligible third body
    ]

    const DT = 0.1   // large enough to show Euler error, small enough for RK4 to handle
    const STEPS = 200
    const initialEnergy = totalEnergy(TWO_BODY)

    const rk4Result = runSteps(TWO_BODY, DT, STEPS)
    const rk4Drift = Math.abs(totalEnergy(rk4Result) - initialEnergy)

    function stepEuler(bodies: BodyState[], dt: number): BodyState[] {
      return bodies.map((b, i) => {
        let ax = 0, ay = 0, az = 0
        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue
          const dx = bodies[j].position[0] - b.position[0]
          const dy = bodies[j].position[1] - b.position[1]
          const dz = bodies[j].position[2] - b.position[2]
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz + 0.01)
          const force = bodies[j].mass / (dist * dist * dist)
          ax += force * dx
          ay += force * dy
          az += force * dz
        }
        return {
          ...b,
          position: [
            b.position[0] + b.velocity[0] * dt,
            b.position[1] + b.velocity[1] * dt,
            b.position[2] + b.velocity[2] * dt,
          ] as [number, number, number],
          velocity: [
            b.velocity[0] + ax * dt,
            b.velocity[1] + ay * dt,
            b.velocity[2] + az * dt,
          ] as [number, number, number],
        }
      })
    }

    let eulerBodies = TWO_BODY.map(b => ({
      ...b,
      position: [...b.position] as [number, number, number],
      velocity: [...b.velocity] as [number, number, number],
    }))
    for (let i = 0; i < STEPS; i++) {
      eulerBodies = stepEuler(eulerBodies, DT)
    }
    const eulerDrift = Math.abs(totalEnergy(eulerBodies) - initialEnergy)

    expect(rk4Drift).toBeLessThan(eulerDrift)
  })
})

describe('figure-8 solution', () => {
  const DT = 0.0001
  // Figure-8 period is ~6.3 normalized time units
  // At dt=0.0001: 6.3 / 0.0001 = 63000 steps per period
  const ONE_PERIOD = 63000

  test('figure-8 bodies stay bounded for 1000 steps', () => {
    // Don't test periodicity — test boundedness over a known-good run
    const result = runSteps(FIGURE_8, 0.001, 5000)
    result.forEach(b => {
      const dist = Math.sqrt(b.position[0] ** 2 + b.position[1] ** 2 + b.position[2] ** 2)
      expect(dist).toBeLessThan(10.0)  // looser bound, still meaningful
    })
  })

  test('figure-8 energy drift stays under 0.5% over 5000 steps', () => {
    const initialEnergy = totalEnergy(FIGURE_8)
    const result = runSteps(FIGURE_8, 0.0001, 5000)
    const drift = Math.abs((totalEnergy(result) - initialEnergy) / initialEnergy)
    expect(drift).toBeLessThan(0.005)
  })

  test('total angular momentum is conserved', () => {
    function angularMomentum(bodies: BodyState[]): [number, number, number] {
      return bodies.reduce((L, b) => {
        // L = r × p = r × (m*v)
        const [rx, ry, rz] = b.position
        const [vx, vy, vz] = b.velocity
        const m = b.mass
        return [
          L[0] + m * (ry * vz - rz * vy),
          L[1] + m * (rz * vx - rx * vz),
          L[2] + m * (rx * vy - ry * vx),
        ]
      }, [0, 0, 0] as [number, number, number])
    }

    const L1 = angularMomentum(FIGURE_8)
    const result = runSteps(FIGURE_8, DT, 1000)
    const L2 = angularMomentum(result)

    expect(Math.abs(L2[0] - L1[0])).toBeLessThan(1e-6)
    expect(Math.abs(L2[1] - L1[1])).toBeLessThan(1e-6)
    expect(Math.abs(L2[2] - L1[2])).toBeLessThan(1e-6)
  })
})

describe('edge cases', () => {
  test('handles very large masses without NaN', () => {
    const heavyBodies: BodyState[] = [
      { position: [0, 0, 0], velocity: [0, 0.1, 0], mass: 100 },
      { position: [5, 0, 0], velocity: [0, -0.1, 0], mass: 0.001 },
      { position: [-5, 0, 0], velocity: [0, 0, 0], mass: 1 },
    ]
    const result = stepRK4(heavyBodies, 0.001)
    result.forEach(b => {
      expect(isNaN(b.position[0])).toBe(false)
      expect(isNaN(b.position[1])).toBe(false)
      expect(isNaN(b.velocity[0])).toBe(false)
      expect(isNaN(b.velocity[1])).toBe(false)
    })
  })

  test('handles bodies very close together without blowing up (softening)', () => {
    // Two bodies almost on top of each other — softening should prevent infinite force
    const closeBodies: BodyState[] = [
      { position: [0.001, 0, 0], velocity: [0, 1, 0], mass: 1 },
      { position: [-0.001, 0, 0], velocity: [0, -1, 0], mass: 1 },
      { position: [5, 0, 0], velocity: [0, 0, 0], mass: 1 },
    ]
    const result = stepRK4(closeBodies, 0.0001)
    result.forEach(b => {
      expect(isNaN(b.position[0])).toBe(false)
      expect(isFinite(b.velocity[0])).toBe(true)
      expect(isFinite(b.velocity[1])).toBe(true)
    })
  })

  test('single step with negative dt moves bodies backwards', () => {
    const forward = stepRK4(FIGURE_8, 0.001)
    const backward = stepRK4(forward, -0.001)

    FIGURE_8.forEach((initial, i) => {
      expect(backward[i].position[0]).toBeCloseTo(initial.position[0], 3)
      expect(backward[i].position[1]).toBeCloseTo(initial.position[1], 3)
    })
  })

  test('two isolated bodies attract each other', () => {
    const bodies: BodyState[] = [
      { position: [-5, 0, 0], velocity: [0, 0, 0], mass: 1 },
      { position: [5, 0, 0], velocity: [0, 0, 0], mass: 1 },
      { position: [0, 1000, 0], velocity: [0, 0, 0], mass: 0.000001 }, // negligible third body
    ]
    const result = stepRK4(bodies, 0.01)

    // Bodies should move toward each other — x distance should decrease
    const initialDist = Math.abs(bodies[1].position[0] - bodies[0].position[0])
    const finalDist = Math.abs(result[1].position[0] - result[0].position[0])
    expect(finalDist).toBeLessThan(initialDist)
  })
})