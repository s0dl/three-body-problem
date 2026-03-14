import { useRef, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { sunTrailWidth } from '@/lib/sunConfigs'
import { useSimulationStore } from '@/store/simulationStore'

interface TrailProps {
  bodyIndex: number
  color: string
  mass: number
  length?: number
  trailKey: number
}

export default function BodyTrail({ bodyIndex, color, mass, length = 120, trailKey }: TrailProps) {
  const points = useRef<THREE.Vector3[]>([])
  const prevKey = useRef(trailKey)
  const skipFrames = useRef(0)
  const [visible, setVisible] = useState(false)
  const [tick, setTick] = useState(0)

  // Sync prevKey with trailKey on render — before useFrame runs
  if (prevKey.current !== trailKey) {
    points.current = []
    prevKey.current = trailKey
    skipFrames.current = 10
  }

  useFrame(() => {
    if (skipFrames.current > 0) {
      skipFrames.current--
      if (visible) setVisible(false)
      return
    }

    const bodies = useSimulationStore.getState().bodies
    const position = bodies[bodyIndex]?.position
    if (!position) return

    points.current.push(new THREE.Vector3(position[0], position[1], position[2]))
    if (points.current.length > length) points.current.shift()

    if (!visible && points.current.length >= 2) setVisible(true)
    if (visible) setTick(t => t + 1)
  })

  if (!visible || points.current.length < 2) return null

  const colors = points.current.map((_, i) => {
    const t = i / points.current.length
    const c = new THREE.Color(color)
    c.multiplyScalar(t * t)
    return c
  })

  return (
    <Line
      points={[...points.current]}
      vertexColors={colors}
      lineWidth={sunTrailWidth(mass)}
      transparent
      depthWrite={false}
    />
  )
}