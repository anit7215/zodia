import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Environment as DreiEnvironment } from '@react-three/drei';
import * as THREE from 'three';

export const Environment: React.FC = () => {
  return (
    <>
      <DreiEnvironment preset="city" />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2.0} />
      <pointLight position={[0, -5, 0]} intensity={0.8} color="#4a90e2" />
      <pointLight position={[0, 0, -10]} intensity={0.5} color="#ff0055" />
      <pointLight position={[-10, 0, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[10, 0, 0]} intensity={0.6} color="#ffffff" />
      <fog attach="fog" args={['#000428', 10, 30]} />
    </>
  );
};

export const FloatingParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};
