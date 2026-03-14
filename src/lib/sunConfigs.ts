export interface SunConfig {
  name: string
  mass: number        // source of truth — drives everything else
  color: string
  description: string
}

export const SUN_CONFIGS: SunConfig[] = [
  {
    name: 'Helios',
    mass: 1.0,
    color: '#fff5c0',
    description: 'A medium yellow star, similar to our own sun',
  },
  {
    name: 'Ignis',
    mass: 1.4,
    color: '#ffc8a0',
    description: 'A large orange giant, old and bloated',
  },
  {
    name: 'Caelum',
    mass: 0.6,
    color: '#c8d8ff',
    description: 'A small blue-white dwarf, young and hot',
  },
]

// Everything derived from mass
export function sunRadius(mass: number): number {
  return 0.3 * Math.pow(mass, 0.8)   // larger mass = larger radius, sub-linear
}

export function sunLightIntensity(mass: number): number {
  return 200 * Math.pow(mass, 3.5)    // luminosity scales steeply with mass (real physics — L ∝ M^3.5)
}

export function sunLightDistance(mass: number): number {
  return 80 + mass * 40
}

export function sunTrailWidth(mass: number): number {
  return 0.5 + mass * 1.2
}

export function sunGlowScale(mass: number): number {
  return 6 + mass * 4
}

export function sunPulseSpeed(mass: number): number {
  return 2.0 - mass * 0.4   // heavier stars pulse slower
}