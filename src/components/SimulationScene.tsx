import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BlackHole from './BlackHole';
import StarField from './StarField';

interface SimulationSceneProps {
  mass: number;
  phi: number;
  spin: number;
  showCurvature: boolean;
  showInfoField: boolean;
  showGravWaves: boolean;
  merging: boolean;
  exploding: boolean;
}

export default function SimulationScene(props: SimulationSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: '#000000' }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4488ff" />
      
      <StarField count={2500} />
      <BlackHole {...props} />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
