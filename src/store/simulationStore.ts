import { create } from 'zustand'
import { BodyState } from '@/lib/physics'
import { SOLUTIONS, Solution } from '@/lib/solutions'

interface SimulationStore {
  bodies: BodyState[]
  timeScale: number
  isRunning: boolean
  activeSolution: Solution
  elapsedTime: number
  trailResetKey: number
  setBodies: (bodies: BodyState[]) => void
  setTimeScale: (scale: number) => void
  setIsRunning: (running: boolean) => void
  setElapsedTime: (t: number) => void
  setSolution: (solution: Solution) => void
  reset: () => void
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  bodies: SOLUTIONS[0].bodies,
  timeScale: 1,
  isRunning: false,
  activeSolution: SOLUTIONS[0],
  elapsedTime: 0,
  trailResetKey: 0,
  setBodies: (bodies) => set({ bodies }),
  setTimeScale: (timeScale) => set({ timeScale }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),
  setSolution: (solution) => set((state) => ({
    bodies: solution.bodies,
    activeSolution: solution,
    elapsedTime: 0,
    trailResetKey: state.trailResetKey + 1,
  })),
  reset: () => set((state) => ({
    bodies: state.activeSolution.bodies,
    elapsedTime: 0,
    trailResetKey: state.trailResetKey + 1,
  })),
}))