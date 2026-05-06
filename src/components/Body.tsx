import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  sunRadius,
  sunLightIntensity,
  sunLightDistance,
  sunGlowScale,
  sunPulseSpeed,
} from '@/lib/sunConfigs'
import { useSimulationStore } from '@/store/simulationStore'

interface BodyProps {
  bodyIndex: number
  mass: number
  color: string
}

function textureNoise(x: number, y: number, seed: number): number {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453
  return value - Math.floor(value)
}

export default function Body({ bodyIndex, mass, color }: BodyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const spriteRef = useRef<THREE.Sprite>(null)

  const radius = sunRadius(mass)
  const intensity = sunLightIntensity(mass)
  const distance = sunLightDistance(mass)
  const glowScale = sunGlowScale(mass)
  const pulseSpeed = sunPulseSpeed(mass)

  const glowTexture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const center = size / 2
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
    gradient.addColorStop(0,    'rgba(255,255,255,1)')
    gradient.addColorStop(0.15, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.4,  'rgba(255,255,255,0.2)')
    gradient.addColorStop(0.7,  'rgba(255,255,255,0.05)')
    gradient.addColorStop(1,    'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  const surfaceTexture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(size, size)
    const c = new THREE.Color()
    c.set(color)
    const seed = c.r * 255 + c.g * 127 + c.b * 63
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const idx = (i * size + j) * 4
        const noise =
          textureNoise(i, j, seed) * 0.5 +
          textureNoise(i + 17, j + 31, seed) * 0.3 +
          textureNoise(i + 43, j + 59, seed) * 0.2
        const brightness = 0.7 + noise * 0.5
        imageData.data[idx]     = Math.min(255, Math.floor(c.r * 255 * brightness))
        imageData.data[idx + 1] = Math.min(255, Math.floor(c.g * 255 * brightness))
        imageData.data[idx + 2] = Math.min(255, Math.floor(c.b * 255 * brightness))
        imageData.data[idx + 3] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)
    return new THREE.CanvasTexture(canvas)
  }, [color])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    const bodies = useSimulationStore.getState().bodies
    const position = bodies[bodyIndex]?.position
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2])
    }
    if (meshRef.current) {
      // heavier stars rotate slower
      meshRef.current.rotation.y += 0.001 / mass
      meshRef.current.rotation.x += 0.0003 / mass
    }
    if (spriteRef.current) {
      const pulse = 1 + Math.sin(t * pulseSpeed) * 0.06 + Math.sin(t * pulseSpeed * 2.3) * 0.03
      spriteRef.current.scale.setScalar(glowScale * pulse)
    }
  })

  return (
    <group ref={groupRef}>
      <pointLight color={color} intensity={intensity} distance={distance} decay={2} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial map={surfaceTexture} color={color} />
      </mesh>
      <sprite ref={spriteRef} scale={[glowScale, glowScale, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={color}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  )
}
