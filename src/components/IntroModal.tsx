import { useState } from 'react'
import { useSimulationStore } from '@/store/simulationStore'

export default function IntroModal() {
  const [dismissed, setDismissed] = useState(false)
  const setIsRunning = useSimulationStore(s => s.setIsRunning)

  if (dismissed) return null

  function handleEnter() {
    setDismissed(true)
    setIsRunning(true)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="bg-black/90 border border-white/15 rounded-2xl p-8 max-w-lg mx-6 font-mono">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-white/40 text-xs uppercase tracking-widest">Trisolaris System Simulation</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl font-bold mb-2 leading-tight">
          The Three-Body Problem
        </h1>
        <p className="text-orange-400/80 text-xs uppercase tracking-widest mb-6">
          Real-time Newtonian simulation
        </p>

        {/* Body */}
        <div className="space-y-4 text-white/60 text-sm leading-relaxed">
          <p>
            In 1687, Newton solved the two-body problem, predicting the motion of any two objects under mutual gravity with perfect precision. The moment a third body enters the system, all predictability collapses.
          </p>
          <p>
            This is a real-time simulation of three stars under mutual gravitational attraction, inspired by Liu Cixin&apos;s <span className="text-white/80 italic">The Three-Body Problem</span>. Watch stable orbits slowly unravel into chaos.
          </p>
          <div className="border border-white/10 rounded-lg p-4 text-white/40 text-xs space-y-1">
            <p className="text-white/60 font-semibold mb-2">⚠ A note on accuracy</p>
            <p>Many of the displayed units (AU distances, km/s velocities, elapsed years) are approximations based on normalized simulation units. The orbital shapes are physically correct. The numbers are illustrative.</p>
          </div>
        </div>

        {/* Controls hint */}
        <div className="flex gap-4 mt-6 mb-8 text-white/30 text-xs">
          <span>Left-click and drag to orbit</span>
          <span>Scroll to zoom</span>
          <span>Right-click to pan</span>
        </div>

        {/* CTA */}
        <button
          onClick={() => handleEnter()}
          className="w-full py-3 rounded-lg border border-orange-500/50 bg-orange-500/10 
                     text-orange-400 text-sm hover:bg-orange-500/20 hover:border-orange-400
                     transition-all tracking-wide"
        >
          Enter the System →
        </button>
      </div>
    </div>
  )
}
