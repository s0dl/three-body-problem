import { memo, useMemo } from 'react'
import { useSimulationStore } from '@/store/simulationStore'
import Body from '@/components/Body'
import BodyTrail from '@/components/BodyTrail'
import { SUN_CONFIGS } from '@/lib/sunConfigs'


const Bodies = memo(function Bodies() {
  const trailResetKey = useSimulationStore(s => s.trailResetKey)
  const initialBodies = useMemo(
    () => useSimulationStore.getState().bodies,
    // re-read from store when solution changes (trailResetKey increments on setSolution)
    [trailResetKey]
  )

  return <>
    {initialBodies.map((_, i) => (
      <group key={i}>
        <Body
          bodyIndex={i}
          color={SUN_CONFIGS[i].color}
          mass={SUN_CONFIGS[i].mass}
          trailKey={trailResetKey}
        />
        <BodyTrail
          bodyIndex={i}
          color={SUN_CONFIGS[i].color}
          mass={SUN_CONFIGS[i].mass}
          trailKey={trailResetKey}
        />
      </group>
    ))}
  </>
})

export default Bodies