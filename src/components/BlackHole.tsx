import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface BlackHoleProps {
  mass: number;
  spin: number;
  phi: number;
  showInfoField: boolean;
  showCurvature: boolean;
  showGravWaves: boolean;
  merging: boolean;
  exploding: boolean;
}

function SpacetimeGrid({ bhScale }: { bhScale: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  const lines = useMemo(() => {
    const group = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: '#00ffcc', transparent: true, opacity: 0.15 });
    const size = 20;
    const segments = 40;
    
    for (let i = 0; i <= segments; i++) {
      const posX = new Float32Array((segments + 1) * 3);
      const posZ = new Float32Array((segments + 1) * 3);
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size;
        const z = (j / segments - 0.5) * size;
        posX[j * 3] = x;
        posX[j * 3 + 1] = -3;
        posX[j * 3 + 2] = z;
        posZ[j * 3] = z;
        posZ[j * 3 + 1] = -3;
        posZ[j * 3 + 2] = x;
      }
      const geoX = new THREE.BufferGeometry();
      geoX.setAttribute('position', new THREE.BufferAttribute(posX, 3));
      group.add(new THREE.Line(geoX, mat));
      const geoZ = new THREE.BufferGeometry();
      geoZ.setAttribute('position', new THREE.BufferAttribute(posZ, 3));
      group.add(new THREE.Line(geoZ, mat));
    }
    return group;
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.add(lines);
    }
    return () => {
      if (groupRef.current) {
        groupRef.current.remove(lines);
      }
    };
  }, [lines]);

  useFrame(() => {
    if (!groupRef.current) return;
    lines.children.forEach((child) => {
      const line = child as THREE.Line;
      const geo = line.geometry;
      const positions = geo.attributes.position as THREE.BufferAttribute;
      if (!positions) return;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const deform = dist < 0.5 ? -3 : -(bhScale * 3) / (dist + 0.5);
        positions.setY(i, -3 + deform);
      }
      positions.needsUpdate = true;
    });
  });

  return <group ref={groupRef} />;
}

export default function BlackHole({ mass, spin, phi, showInfoField, showCurvature, showGravWaves, merging, exploding }: BlackHoleProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const diskRef = useRef<THREE.Points>(null!);
  const eventHorizonRef = useRef<THREE.Mesh>(null!);
  const infoFieldRef = useRef<THREE.Mesh>(null!);
  const wavesRef = useRef<THREE.Group>(null!);
  const secondBHRef = useRef<THREE.Group>(null!);
  
  const bhScale = 0.5 + (mass / 1000) * 2;
  
  const diskGeo = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 0.15;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const t = (r - 1.5) / 2;
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.3 + t * 0.4;
      colors[i * 3 + 2] = 0.05 + t * 0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const waveRings = useMemo(() => {
    return [1, 2, 3, 4, 5].map(i => new THREE.RingGeometry(i * 2, i * 2 + 0.05, 64));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      if (exploding) {
        groupRef.current.scale.setScalar(bhScale * (1 + Math.sin(time * 20) * 0.3));
      } else {
        groupRef.current.scale.setScalar(bhScale);
      }
    }
    
    if (diskRef.current) {
      diskRef.current.rotation.y += delta * (0.5 + spin * 2);
    }
    
    if (eventHorizonRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.02;
      eventHorizonRef.current.scale.setScalar(pulse);
    }
    
    if (infoFieldRef.current && showInfoField) {
      infoFieldRef.current.rotation.y += delta * 0.3;
      infoFieldRef.current.rotation.z += delta * 0.1;
      const s = 2 + phi * 2 + Math.sin(time) * 0.3;
      infoFieldRef.current.scale.setScalar(s);
    }
    
    if (wavesRef.current && showGravWaves) {
      wavesRef.current.children.forEach((child, i) => {
        const scale = 1 + Math.sin(time * 2 - i * 0.5) * 0.3;
        child.scale.setScalar(scale);
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = 0.3 - i * 0.05;
        }
      });
    }
    
    if (secondBHRef.current) {
      if (merging) {
        const angle = time * 3;
        const radius = Math.max(0.5, 4 - (time % 5) * 0.8);
        secondBHRef.current.position.x = Math.cos(angle) * radius;
        secondBHRef.current.position.z = Math.sin(angle) * radius;
        secondBHRef.current.visible = true;
      } else {
        secondBHRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <mesh ref={eventHorizonRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.98, 1.15, 64]} />
          <meshBasicMaterial color="#00ccff" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
        
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </mesh>
        
        <points ref={diskRef} geometry={diskGeo}>
          <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>
      
      {showInfoField && (
        <mesh ref={infoFieldRef}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#8800ff" transparent opacity={0.08 + phi * 0.12} wireframe blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      
      {showCurvature && <SpacetimeGrid bhScale={bhScale} />}
      
      {showGravWaves && (
        <group ref={wavesRef} rotation={[Math.PI / 2, 0, 0]}>
          {waveRings.map((geo, i) => (
            <mesh key={i} geometry={geo}>
              <meshBasicMaterial color="#ff6600" transparent opacity={0.25 - i * 0.04} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
          ))}
        </group>
      )}
      
      <group ref={secondBHRef} visible={false}>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.58, 0.72, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}
