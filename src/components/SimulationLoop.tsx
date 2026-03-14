import { useFrame } from '@react-three/fiber'
import { stepRK4 } from '@/lib/physics'
import { useSimulationStore } from '@/store/simulationStore'

const STEPS_PER_FRAME = 50   // more steps = more accurate
const BASE_DT = 0.0001    // smaller dt = more stable at high speeds
const ELAPSED_UPDATE_INTERVAL = 30
let framesSinceElapsedUpdate = 0


export default function SimulationLoop() {
  useFrame((_, delta) => {
    const { bodies, timeScale, isRunning, setBodies } = useSimulationStore.getState()
    if (!isRunning) return

    let current = bodies
    const dt = BASE_DT * timeScale

    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      current = stepRK4(current, dt)
    }

    setBodies(current)

    framesSinceElapsedUpdate++
    if (framesSinceElapsedUpdate >= ELAPSED_UPDATE_INTERVAL) {
      const { elapsedTime, setElapsedTime } = useSimulationStore.getState()
      setElapsedTime(elapsedTime + delta * timeScale * ELAPSED_UPDATE_INTERVAL)
      framesSinceElapsedUpdate = 0
    }
  })

  return null
}