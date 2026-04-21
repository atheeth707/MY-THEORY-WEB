import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import StarField from './StarField';

function HeroBlackHole() {
  const groupRef = useRef<THREE.Group>(null!);
  const diskRef = useRef<THREE.Points>(null!);
  
  const diskGeo = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 2.5;
      const height = (Math.random() - 0.5) * 0.12;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const t = (r - 1.2) / 2.5;
      colors[i * 3] = 0.0 + t * 1.0;
      colors[i * 3 + 1] = 0.6 + t * 0.2;
      colors[i * 3 + 2] = 1.0 - t * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    if (diskRef.current) {
      diskRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.2, 64]} />
        <meshBasicMaterial color="#00ccff" transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#0044aa" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
      <points ref={diskRef} geometry={diskGeo}>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

interface HomeSectionProps {
  onEnter: () => void;
}

export default function HomeSection({ onEnter }: HomeSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 6], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#000005']} />
          <StarField count={3000} />
          <HeroBlackHole />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>
      
      <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-[2000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4"
            style={{
              background: 'linear-gradient(135deg, #00ccff 0%, #8800ff 50%, #ff6600 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(0,204,255,0.3))'
            }}>
            Information-Induced<br />Modifications to Gravity
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-cyan-300/70 font-light tracking-wide mb-2">
            Can Information Shape Gravity?
          </p>
          <p className="text-sm text-white/30 mb-10 font-mono">A Research Simulation by Atheeth</p>
          
          <button
            onClick={onEnter}
            className="group relative px-10 py-4 rounded-full text-lg font-bold tracking-wider uppercase cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(0,204,255,0.15), rgba(136,0,255,0.15))',
              border: '1px solid rgba(0,204,255,0.4)',
              color: '#00ccff',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(0,204,255,0.3), rgba(136,0,255,0.3))';
              (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(0,204,255,0.3), inset 0 0 40px rgba(0,204,255,0.1)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'linear-gradient(135deg, rgba(0,204,255,0.15), rgba(136,0,255,0.15))';
              (e.target as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <span className="relative z-10">Enter Simulation</span>
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle, rgba(0,204,255,0.15) 0%, transparent 70%)' }} />
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cyan-500/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-cyan-400/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
