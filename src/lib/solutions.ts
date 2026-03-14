import { BodyState } from './physics'

const S = 8
const V = 1 / Math.sqrt(S)

export type Era = 'ejection' | 'periodic' | 'stable'

export interface Solution {
  name: string
  era: Era
  description: string
  bodies: BodyState[]
}

export const ERA_COLORS: Record<Era, string> = {
  periodic: '#4ade80',
  stable: '#3da4d0',
  ejection: '#ef4444',
}

export const ERA_LABELS: Record<Era, string> = {
  periodic: 'Periodic',
  stable: 'Stable',
  ejection: 'Ejection',
}

const L4_r = 4 * S
const L4_M = 100
const L4_omega = Math.sqrt((L4_M + 1) / (L4_r ** 3))
const L4_v = L4_omega * L4_r
const L4_angle = Math.PI / 3

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

export const SOLUTIONS: Solution[] = [
  {
    name: 'Figure-8',
    era: 'periodic',
    description: 'Three equal masses chasing each other in a figure-8. The most famous periodic solution, discovered by Chenciner & Montgomery in 2000.',
    bodies: zeroMomentum([
      {
        position: [-0.97000436 * S,  0.24308753 * S, 0],
        velocity: [ 0.46620368 * V,  0.43236573 * V, 0],
        mass: 1.0,
      },
      {
        position: [ 0.97000436 * S, -0.24308753 * S, 0],
        velocity: [ 0.46620368 * V,  0.43236573 * V, 0],
        mass: 1.0,
      },
      {
        position: [0, 0, 0],
        velocity: [-0.93240737 * V, -0.86473146 * V, 0],
        mass: 1.0,
      },
    ]),
  },
  {
    name: 'Lagrange Point L4',
    era: 'periodic',
    description: 'A negligible mass sits at the L4 Lagrange point, 60° ahead of the lighter primary. The same mechanism that locks Jupiter\'s Trojan asteroids in place.',
    bodies: zeroMomentum([
      {
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        mass: 100.0,
      },
      {
        position: [L4_r, 0, 0],
        velocity: [0, L4_v, 0],
        mass: 1.0,
      },
      {
        position: [
          L4_r * Math.cos(L4_angle),
          L4_r * Math.sin(L4_angle),
          0,
        ],
        velocity: [
          -L4_v * Math.sin(L4_angle),
          L4_v * Math.cos(L4_angle),
          0,
        ],
      mass: 0.001,
     },
    ]),
  },
  {
    name: 'Euler Collinear',
    era: 'stable',
    description: 'Three bodies on a single rotating axis. Discovered by Euler in 1767 — unstable but mathematically elegant.',
    bodies: zeroMomentum([
      {
        position: [-4 * S, 0, 0],
        velocity: [ 0, -0.5 * V, 0],
        mass: 1.0,
      },
      {
        position: [ 0,     0, 0],
        velocity: [ 0,  1.0 * V, 0],
        mass: 5.0,
      },
      {
        position: [ 4 * S, 0, 0],
        velocity: [ 0, -0.5 * V, 0],
        mass: 1.0,
      },
    ]),
  },
  {
    name: 'Butterfly I',
    era: 'stable',
    description: 'A periodic orbit eventually leading to ejection resembling butterfly wings. One of many exotic solutions discovered through numerical search.',
    bodies: zeroMomentum([
      {
        position: [-1.0 * S,  0,        0],
        velocity: [ 0.30652 * V,  0.12233 * V, 0],
        mass: 1.0,
      },
      {
        position: [ 1.0 * S,  0,        0],
        velocity: [ 0.30652 * V,  0.12233 * V, 0],
        mass: 1.0,
      },
      {
        position: [ 0,        0,        0],
        velocity: [-0.61304 * V, -0.24466 * V, 0],
        mass: 1.0,
      },
    ]),
  },
  {
    name: 'Bumblebee',
    era: 'stable',
    description: 'An asymmetric orbit leading to ejection where one body traces a bumblebee-like path around the other two.',
    bodies: zeroMomentum([
      {
        position: [-0.5 * S,  0.3 * S,  0],
        velocity: [ 0.18 * V, -0.35 * V, 0],
        mass: 1.0,
      },
      {
        position: [ 0.5 * S, -0.3 * S,  0],
        velocity: [-0.18 * V,  0.35 * V, 0],
        mass: 1.0,
      },
      {
        position: [ 0.8 * S,  0.8 * S,  0],
        velocity: [-0.22 * V, -0.28 * V, 0],
        mass: 1.0,
      },
    ]),
  },
  {
    name: 'Flying Star',
    era: 'ejection',
    description: 'One sun flung to the edge of the system on a vast elliptical orbit. It will return for one final encounter — then escape forever.',
    bodies: zeroMomentum([
      {
        position: [-2 * S,  1 * S,  0],
        velocity: [ 0.1 * V, -0.3 * V,  0],
        mass: 1.0,
      },
      {
        position: [ 2 * S, -1 * S,  0],
        velocity: [-0.1 * V,  0.3 * V,  0],
        mass: 1.0,
      },
      {
        position: [10 * S,  4 * S,  2 * S],
        velocity: [-0.06 * V, -0.08 * V,  0.01 * V],
        mass: 1.0,
      },
    ]),
  },
  {
    name: 'Unequal Masses',
    era: 'ejection',
    description: 'Three bodies with significantly different masses. The lightest body will eventually be ejected by the two heavy ones.',
    bodies: zeroMomentum([
      {
        position: [-2 * S,  0,      0],
        velocity: [ 0,      0.35 * V, 0],
        mass: 2.0,
      },
      {
        position: [ 2 * S,  0,      0],
        velocity: [ 0,     -0.35 * V, 0],
        mass: 2.0,
      },
      {
        position: [ 0,      3 * S,  0],
        velocity: [ 0.2 * V, 0,     0],
        mass: 0.1,
      },
    ]),
  },
]