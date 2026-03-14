import { useRef, useEffect, useState } from 'react'
import { useSimulationStore } from '@/store/simulationStore'
import { SOLUTIONS, ERA_COLORS, ERA_LABELS } from '@/lib/solutions'
import { SUN_CONFIGS } from '@/lib/sunConfigs'
import { formatDistance, formatVelocity, formatTime } from '@/lib/units'
import IntroModal from './IntroModal'


const SPEED_PRESETS = [
  { label: '¼×', value: 0.25 },
  { label: '½×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '5×', value: 5 },
  { label: '10×', value: 10 },
  { label: '50×', value: 50 },
  { label: '100×', value: 100}
]

export default function HUD() {
  const [menuOpen, setMenuOpen] = useState(false)
  const timeRef = useRef<HTMLParagraphElement>(null)
  const statRefs = useRef<(HTMLDivElement | null)[]>([])

  const timeScale     = useSimulationStore(s => s.timeScale)
  const isRunning     = useSimulationStore(s => s.isRunning)
  const activeSolution = useSimulationStore(s => s.activeSolution)
  const setTimeScale  = useSimulationStore(s => s.setTimeScale)
  const setIsRunning  = useSimulationStore(s => s.setIsRunning)
  const setSolution   = useSimulationStore(s => s.setSolution)
  const reset         = useSimulationStore(s => s.reset)

  // Direct DOM updates for high-frequency values — no React re-render
  useEffect(() => {
    let animFrame: number

    function tick() {
      const { bodies, elapsedTime } = useSimulationStore.getState()

      // Update elapsed time
      if (timeRef.current) {
        timeRef.current.textContent = formatTime(elapsedTime)
      }

      // Update per-sun stats
      bodies.forEach((body, i) => {
        const el = statRefs.current[i]
        if (!el) return

        const speed = Math.sqrt(
          body.velocity[0] ** 2 +
          body.velocity[1] ** 2 +
          body.velocity[2] ** 2
        )
        const dist = Math.sqrt(
          body.position[0] ** 2 +
          body.position[1] ** 2 +
          body.position[2] ** 2
        )

        const distEl = el.querySelector('[data-dist]')
        const velEl = el.querySelector('[data-vel]')
        if (distEl) distEl.textContent = formatDistance(dist)
        if (velEl) velEl.textContent = formatVelocity(speed)
      })

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <>
      <IntroModal />
      {/* Top left — solution selector */}
      <div className="absolute top-6 left-6 z-10 font-mono pointer-events-auto">
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="flex items-center gap-3 bg-black/70 border border-white/15
                     rounded-lg px-4 py-2.5 text-white hover:border-white/40
                     transition-all backdrop-blur-sm"
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: ERA_COLORS[activeSolution.era] }}
          />
          <span className="text-sm text-white/90">{activeSolution.name}</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              color: ERA_COLORS[activeSolution.era],
              backgroundColor: ERA_COLORS[activeSolution.era] + '22',
            }}
          >
            {ERA_LABELS[activeSolution.era]}
          </span>
          <span className="text-white/30 text-xs ml-1">{menuOpen ? '▲' : '▼'}</span>
        </button>

        {menuOpen && (
          <div className="mt-2 bg-black/80 border border-white/15 rounded-lg
                          backdrop-blur-sm w-80 max-h-[60vh] overflow-y-auto custom-scroll">
            {SOLUTIONS.map((solution) => {
              const isActive = solution.name === activeSolution.name
              return (
                <button
                  key={solution.name}
                  onClick={() => { setSolution(solution); setMenuOpen(false) }}
                  className={`
                    w-full text-left px-4 py-3 transition-all border-b border-white/5
                    last:border-b-0 hover:bg-white/5
                    ${isActive ? 'bg-white/8' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{solution.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        color: ERA_COLORS[solution.era],
                        backgroundColor: ERA_COLORS[solution.era] + '22',
                      }}
                    >
                      {ERA_LABELS[solution.era]}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {solution.description}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Top right — elapsed time */}
      <div className="absolute top-6 right-6 font-mono text-right">
        <p className="text-white/30 text-xs uppercase tracking-widest">Elapsed</p>
        <p ref={timeRef} className="text-white/80 text-lg">0 mo</p>
      </div>

      {/* Bottom right — time controls */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 font-mono pointer-events-auto">
        <div className="flex gap-1">
          {SPEED_PRESETS.map(p => (
            <button
              key={p.value}
              onClick={() => setTimeScale(p.value)}
              className={`
                px-2 py-1 text-xs rounded border transition-all
                ${timeScale === p.value
                  ? isRunning
                    ? 'bg-orange-500/80 border-orange-400 text-white'
                    : 'bg-gray-500/80 border-gray-400 text-white'
                  : 'bg-black/60 border-white/15 text-white/40 hover:border-white/40 hover:text-white'
                }
              `}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-black/60 border border-white/10
                        rounded-lg px-4 py-2 backdrop-blur-sm">
          <span className="text-white/40 text-xs w-12 text-right">
            {timeScale.toFixed(1)}×
          </span>
          <input
            type="range"
            min={0.1}
            max={100}
            step={0.1}
            value={timeScale}
            onChange={e => setTimeScale(parseFloat(e.target.value))}
            className={ isRunning ? "w-32 accent-orange-500" : "w-32 accent-gray-500"}
          />
          <span className="text-white/30 text-xs">speed</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-1.5 text-xs rounded border border-white/15
                       bg-black/60 text-white/60 hover:text-white hover:border-white/40
                       transition-all backdrop-blur-sm"
          >
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-1.5 text-xs rounded border border-white/15
                       bg-black/60 text-white/60 hover:text-white hover:border-white/40
                       transition-all backdrop-blur-sm"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Bottom left — sun stats */}
      <div className="absolute bottom-6 left-6 font-mono space-y-1">
        {SUN_CONFIGS.map((config, i) => (
          <div
            key={i}
            ref={el => { statRefs.current[i] = el }}
            className="flex items-center gap-3 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />
            <span style={{ color: config.color }} className="opacity-80 w-14">
              {config.name}
            </span>
            <span data-dist>--</span>
            <span data-vel>--</span>
            <span className="text-white/20">{config.mass} M☉</span>
          </div>
        ))}
      </div>
    </>
  )
}