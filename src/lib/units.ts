export const NORM_TO_AU = 0.3        // 1 unit = 0.3 AU — makes bodies 0.3-2.4 AU apart at S=8
export const NORM_TO_KMS = 30.0       // 1 velocity unit = 9 km/s — plausible for tight triple system

export function formatDistance(normalized: number): string {
  const au = normalized * NORM_TO_AU
  if (au < 0.1) return `${(au * 149.6).toFixed(0)} Gm`  // gigameters for very close
  return `${au.toFixed(2)} AU`
}

export function formatVelocity(normalized: number): string {
  const kms = normalized * NORM_TO_KMS
  return `${kms.toFixed(1)} km/s`
}

export function formatTime(normalized: number): string {
  const years = normalized * 3
  if (years < 1)        return `${(years * 12).toFixed(0)} mo`
  if (years < 1000)     return `${years.toFixed(1)} yr`
  if (years < 1000000)  return `${(years / 1000).toFixed(1)} kyr`
  return `${(years / 1000000).toFixed(2)} Myr`
}