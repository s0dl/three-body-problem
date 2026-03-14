import { describe, test, expect } from 'vitest'
import { formatDistance, formatVelocity, formatTime, NORM_TO_AU, NORM_TO_KMS } from '@/lib/units'

describe('formatDistance', () => {
  test('shows AU for values >= 0.1 AU', () => {
    // 0.1 AU / 0.3 = 0.333 normalized units
    expect(formatDistance(0.34)).toContain('AU')
  })

  test('shows correct AU value', () => {
    expect(formatDistance(1)).toBe(`${(1 * NORM_TO_AU).toFixed(2)} AU`)
  })

  test('shows Gm for values below 0.1 AU threshold', () => {
    // 0.09 AU / 0.3 = 0.3 normalized — just below threshold
    expect(formatDistance(0.3)).toContain('Gm')
  })

  test('Gm value is correct', () => {
    const au = 0.05  // AU
    const normalized = au / NORM_TO_AU
    const expectedGm = (au * 149.6).toFixed(0)
    expect(formatDistance(normalized)).toBe(`${expectedGm} Gm`)
  })

  test('never returns NaN', () => {
    expect(formatDistance(0)).not.toContain('NaN')
    expect(formatDistance(999)).not.toContain('NaN')
  })

  test('zero distance returns 0 Gm', () => {
    expect(formatDistance(0)).toBe('0 Gm')
  })
})

describe('formatVelocity', () => {
  test('shows km/s', () => {
    expect(formatVelocity(1)).toContain('km/s')
  })

  test('value is correct', () => {
    expect(formatVelocity(1)).toBe(`${(1 * NORM_TO_KMS).toFixed(1)} km/s`)
  })

  test('zero velocity returns 0.0 km/s', () => {
    expect(formatVelocity(0)).toBe('0.0 km/s')
  })

  test('never returns NaN', () => {
    expect(formatVelocity(0)).not.toContain('NaN')
    expect(formatVelocity(999)).not.toContain('NaN')
  })
})

describe('formatTime', () => {
  test('shows months when years < 1', () => {
    // 0.1 normalized * 3 = 0.3 years < 1
    expect(formatTime(0.1)).toContain('mo')
  })

  test('month value is correct', () => {
    // 0.1 * 3 = 0.3 years = 3.6 months → rounds to 4
    expect(formatTime(0.1)).toBe(`${(0.1 * 3 * 12).toFixed(0)} mo`)
  })

  test('shows years when >= 1 year', () => {
    // 0.5 normalized * 3 = 1.5 years
    expect(formatTime(0.5)).toContain('yr')
  })

  test('year value is correct', () => {
    expect(formatTime(10)).toBe(`${(10 * 3).toFixed(1)} yr`)
  })

  test('zero returns 0 mo', () => {
    expect(formatTime(0)).toBe('0 mo')
  })

  test('boundary — exactly 1 year shows yr not mo', () => {
    // 1/3 normalized * 3 = exactly 1 year
    expect(formatTime(1 / 3)).toContain('yr')
  })

  test('shows kyr for thousands of years', () => {
    // 400 normalized * 3 = 1200 years
    expect(formatTime(400)).toContain('kyr')
    })

    test('shows Myr for millions of years', () => {
    // 400000 normalized * 3 = 1.2M years
    expect(formatTime(400000)).toContain('Myr')
    })
})