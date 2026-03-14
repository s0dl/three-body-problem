export interface BodyState {
  position: [number, number, number]
  velocity: [number, number, number]
  mass: number
}

const G = 1 // normalized gravitational constant

// Calculate gravitational acceleration on body i from all other bodies
function acceleration(bodies: BodyState[], i: number): [number, number, number] {
  let ax = 0, ay = 0, az = 0

  for (let j = 0; j < bodies.length; j++) {
    if (i === j) continue

    const dx = bodies[j].position[0] - bodies[i].position[0]
    const dy = bodies[j].position[1] - bodies[i].position[1]
    const dz = bodies[j].position[2] - bodies[i].position[2]

    const distSq = dx * dx + dy * dy + dz * dz
    const dist = Math.sqrt(distSq)
    const softening = 1.2 // prevents infinite force when bodies get very close

    const force = (G * bodies[j].mass) / (distSq + softening * softening)

    ax += force * (dx / dist)
    ay += force * (dy / dist)
    az += force * (dz / dist)
  }

  return [ax, ay, az]
}

// Single RK4 step for all bodies
export function stepRK4(bodies: BodyState[], dt: number): BodyState[] {
  const n = bodies.length

  // k1 - derivatives at current state
  const k1v = bodies.map((_, i) => acceleration(bodies, i))
  const k1x = bodies.map(b => b.velocity)

  // k2 - derivatives at midpoint using k1
  const mid1 = bodies.map((b, i) => ({
    ...b,
    position: [
      b.position[0] + k1x[i][0] * dt / 2,
      b.position[1] + k1x[i][1] * dt / 2,
      b.position[2] + k1x[i][2] * dt / 2,
    ] as [number, number, number],
    velocity: [
      b.velocity[0] + k1v[i][0] * dt / 2,
      b.velocity[1] + k1v[i][1] * dt / 2,
      b.velocity[2] + k1v[i][2] * dt / 2,
    ] as [number, number, number],
  }))
  const k2v = mid1.map((_, i) => acceleration(mid1, i))
  const k2x = mid1.map(b => b.velocity)

  // k3 - derivatives at midpoint using k2
  const mid2 = bodies.map((b, i) => ({
    ...b,
    position: [
      b.position[0] + k2x[i][0] * dt / 2,
      b.position[1] + k2x[i][1] * dt / 2,
      b.position[2] + k2x[i][2] * dt / 2,
    ] as [number, number, number],
    velocity: [
      b.velocity[0] + k2v[i][0] * dt / 2,
      b.velocity[1] + k2v[i][1] * dt / 2,
      b.velocity[2] + k2v[i][2] * dt / 2,
    ] as [number, number, number],
  }))
  const k3v = mid2.map((_, i) => acceleration(mid2, i))
  const k3x = mid2.map(b => b.velocity)

  // k4 - derivatives at end using k3
  const end = bodies.map((b, i) => ({
    ...b,
    position: [
      b.position[0] + k3x[i][0] * dt,
      b.position[1] + k3x[i][1] * dt,
      b.position[2] + k3x[i][2] * dt,
    ] as [number, number, number],
    velocity: [
      b.velocity[0] + k3v[i][0] * dt,
      b.velocity[1] + k3v[i][1] * dt,
      b.velocity[2] + k3v[i][2] * dt,
    ] as [number, number, number],
  }))
  const k4v = end.map((_, i) => acceleration(end, i))
  const k4x = end.map(b => b.velocity)

  // Combine all four slopes — this is the RK4 weighted average
  return bodies.map((b, i) => ({
    ...b,
    position: [
      b.position[0] + (dt / 6) * (k1x[i][0] + 2*k2x[i][0] + 2*k3x[i][0] + k4x[i][0]),
      b.position[1] + (dt / 6) * (k1x[i][1] + 2*k2x[i][1] + 2*k3x[i][1] + k4x[i][1]),
      b.position[2] + (dt / 6) * (k1x[i][2] + 2*k2x[i][2] + 2*k3x[i][2] + k4x[i][2]),
    ] as [number, number, number],
    velocity: [
      b.velocity[0] + (dt / 6) * (k1v[i][0] + 2*k2v[i][0] + 2*k3v[i][0] + k4v[i][0]),
      b.velocity[1] + (dt / 6) * (k1v[i][1] + 2*k2v[i][1] + 2*k3v[i][1] + k4v[i][1]),
      b.velocity[2] + (dt / 6) * (k1v[i][2] + 2*k2v[i][2] + 2*k3v[i][2] + k4v[i][2]),
    ] as [number, number, number],
  }))
}