import { describe, test, expect } from 'vitest'
import { SOLUTIONS } from '@/lib/solutions'

function totalMomentum(bodies: typeof SOLUTIONS[0]['bodies']) {
  return [
    bodies.reduce((s, b) => s + b.mass * b.velocity[0], 0),
    bodies.reduce((s, b) => s + b.mass * b.velocity[1], 0),
    bodies.reduce((s, b) => s + b.mass * b.velocity[2], 0),
  ]
}

describe('all solutions', () => {
  SOLUTIONS.forEach(solution => {
    describe(solution.name, () => {
      test('has exactly 3 bodies', () => {
        expect(solution.bodies.length).toBe(3)
      })

      test('all masses are positive', () => {
        solution.bodies.forEach(b => {
          expect(b.mass).toBeGreaterThan(0)
        })
      })

      test('no NaN in positions', () => {
        solution.bodies.forEach(b => {
          b.position.forEach(v => expect(isNaN(v)).toBe(false))
        })
      })

      test('no NaN in velocities', () => {
        solution.bodies.forEach(b => {
          b.velocity.forEach(v => expect(isNaN(v)).toBe(false))
        })
      })

      test('satisfies zero momentum (CoM not drifting)', () => {
        const [px, py, pz] = totalMomentum(solution.bodies)
        expect(Math.abs(px)).toBeLessThan(1e-6)
        expect(Math.abs(py)).toBeLessThan(1e-6)
        expect(Math.abs(pz)).toBeLessThan(1e-6)
      })

      test('bodies are not all at the same position', () => {
        const positions = solution.bodies.map(b => b.position.join(','))
        const unique = new Set(positions)
        expect(unique.size).toBe(3)
      })

      test('has valid era', () => {
        expect(['stable', 'chaotic', 'ejection', 'periodic']).toContain(solution.era)
      })

      test('has non-empty name and description', () => {
        expect(solution.name.length).toBeGreaterThan(0)
        expect(solution.description.length).toBeGreaterThan(0)
      })
    })
  })
})