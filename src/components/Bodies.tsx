import { memo } from 'react'
import { useSimulationStore } from '@/store/simulationStore'
import Body from '@/components/Body'
import BodyTrail from '@/components/BodyTrail'
import { SUN_CONFIGS } from '@/lib/sunConfigs'


const Bodies = memo(function Bodies() {
  const trailResetKey = useSimulationStore(s => s.trailResetKey)

  return <>
    {SUN_CONFIGS.map((config, i) => (
      <group key={i}>
        <Body
          bodyIndex={i}
          color={config.color}
          mass={config.mass}
        />
        <BodyTrail
          key={trailResetKey}
          bodyIndex={i}
          color={config.color}
          mass={config.mass}
        />
      </group>
    ))}
  </>
})

export default Bodies
