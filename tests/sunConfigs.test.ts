import { describe, test, expect } from 'vitest'
import {
  sunRadius,
  sunLightIntensity,
  sunLightDistance,
  sunTrailWidth,
  sunGlowScale,
  sunPulseSpeed,
  SUN_CONFIGS,
} from '@/lib/sunConfigs'

describe('sunRadius', () => {
  test('larger mass = larger radius', () => {
    expect(sunRadius(2)).toBeGreaterThan(sunRadius(1))
    expect(sunRadius(1)).toBeGreaterThan(sunRadius(0.5))
  })
  test('always positive', () => {
    expect(sunRadius(0.1)).toBeGreaterThan(0)
    expect(sunRadius(100)).toBeGreaterThan(0)
  })
})

describe('sunLightIntensity', () => {
  test('scales steeply with mass (L ∝ M^3.5)', () => {
    // Doubling mass should more than double intensity
    expect(sunLightIntensity(2)).toBeGreaterThan(sunLightIntensity(1) * 2)
  })
  test('always positive', () => {
    expect(sunLightIntensity(0.1)).toBeGreaterThan(0)
  })
})

describe('sunPulseSpeed', () => {
  test('heavier stars pulse slower', () => {
    expect(sunPulseSpeed(2)).toBeLessThan(sunPulseSpeed(1))
    expect(sunPulseSpeed(1)).toBeLessThan(sunPulseSpeed(0.5))
  })
})

describe('sunTrailWidth', () => {
  test('heavier stars have wider trails', () => {
    expect(sunTrailWidth(2)).toBeGreaterThan(sunTrailWidth(1))
  })
  test('always positive', () => {
    expect(sunTrailWidth(0.1)).toBeGreaterThan(0)
  })
})

describe('sunLightDistance', () => {
    test('heavier stars have a larger light distance', () => {
        expect(sunLightDistance(2)).toBeGreaterThan(sunLightDistance(1))
    })
    test('always positive', () => {
        expect(sunLightDistance(0.01)).toBeGreaterThan(0)
    })
})

describe('sunGlowScale', () => {
    test('heavier stars have a larger glow scale', () => {
        expect(sunGlowScale(2)).toBeGreaterThan(sunGlowScale(1))
    })
    test('always positive', () => {
        expect(sunGlowScale(0.01)).toBeGreaterThan(0)
    })
})

describe('SUN_CONFIGS', () => {
  test('has exactly 3 configs', () => {
    expect(SUN_CONFIGS.length).toBe(3)
  })
  test('all have valid hex colors', () => {
    SUN_CONFIGS.forEach(c => {
      expect(c.color).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })
  test('all have positive masses', () => {
    SUN_CONFIGS.forEach(c => {
      expect(c.mass).toBeGreaterThan(0)
    })
  })
  test('all have non-empty names', () => {
    SUN_CONFIGS.forEach(c => {
      expect(c.name.length).toBeGreaterThan(0)
    })
  })
})