import { useRef, useState } from 'react'
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
}

export default function BodyTrail({ bodyIndex, color, mass, length = 120 }: TrailProps) {
  const points = useRef<THREE.Vector3[]>([])
  const skipFrames = useRef(10)
  const [trailPoints, setTrailPoints] = useState<THREE.Vector3[]>([])

  useFrame(() => {
    if (skipFrames.current > 0) {
      skipFrames.current--
      return
    }

    const bodies = useSimulationStore.getState().bodies
    const position = bodies[bodyIndex]?.position
    if (!position) return

    points.current.push(new THREE.Vector3(position[0], position[1], position[2]))
    if (points.current.length > length) points.current.shift()

    setTrailPoints([...points.current])
  })

  if (trailPoints.length < 2) return null

  const colors = trailPoints.map((_, i) => {
    const t = i / trailPoints.length
    const c = new THREE.Color(color)
    c.multiplyScalar(t * t)
    return c
  })

  return (
    <Line
      points={trailPoints}
      vertexColors={colors}
      lineWidth={sunTrailWidth(mass)}
      transparent
      depthWrite={false}
    />
  )
}
