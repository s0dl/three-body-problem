import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SimulationLoop from '@/components/SimulationLoop'
import Bodies from "@/components/Bodies"

export default function MainScene() {
    return (
        <Canvas>
            <PerspectiveCamera 
                makeDefault
                position={[0, 0, 30]}
                fov={50}
                near={0.1}
                far={1000}
            />
            <OrbitControls 
                enableDamping
                dampingFactor={0.05}
                minDistance={2}
                maxDistance={250}
                zoomSpeed={1}
            />
            <Stars />
            <ambientLight intensity={0.05} />
            <SimulationLoop />
            <Bodies />
            <EffectComposer>
                <Bloom 
                    intensity={3.0}
                    luminanceThreshold={1.2}
                    luminanceSmoothing={0.95}
                    mipmapBlur
                />
            </EffectComposer>
        </Canvas>
    )
}