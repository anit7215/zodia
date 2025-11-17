import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Billboard } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { ZodiacSphereProps } from '../../types/type';
import { getRankColor } from '../../utils/zodiac';
import { Model3D } from './Model3D';
import { useFortuneStore } from '../../stores/fortuneStore';

const createStarParticles = (sphereSize: number) => {
  const particles = [];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = Math.pow(Math.random(), 1/3) * sphereSize * 0.75;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const speed = 0.5 + Math.random() * 0.5;
    const offset = Math.random() * Math.PI * 2;

    particles.push({ x, y, z, id: i, speed, offset });
  }

  return particles;
};

export const ZodiacSphere: React.FC<ZodiacSphereProps> = ({
  position,
  rank,
  sign,
  content,
  isMySign,
  scale = 1,
  luckyColor,
  luckyItem
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const meshRef = useRef<Mesh>(null!);
  const innerGroupRef = useRef<Group>(null!);
  const particleGroupRef = useRef<Group>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const speed = isMySign ? 1.0 : 0.5;
      meshRef.current.rotation.y += delta * speed;
    }

    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.y += delta * 0.3;
    }

    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.x += delta * 0.1;
      particleGroupRef.current.rotation.y += delta * 0.15;
    }
  });

  const { openModal } = useFortuneStore();

  const handleClick = () => {
    openModal({ rank, sign, content, luckyColor, luckyItem });
  };

  const baseSize = 0.8;
  const sphereSize = baseSize * scale;
  const textOffset = sphereSize + (isMySign ? 1 : 0.6);

  const [starParticles] = useState(() => createStarParticles(sphereSize));

  return (
    <group position={position}>

      <Sphere
        ref={meshRef}
        args={[sphereSize, 64, 64]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          transparent={true}
          opacity={0.2}

          roughness={0.0}
          metalness={0.5}

          color={getRankColor(rank, isMySign, isHovered)}

          envMapIntensity={2.0}

          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </Sphere>

      <group ref={innerGroupRef} scale={sphereSize * 2}>
        <Model3D rank={rank} isMySign={isMySign} modelPath={`/models/${sign}.glb`} />
      </group>

      <group ref={particleGroupRef}>
        {starParticles.map((particle) => (
          <Sphere key={particle.id} args={[0.01, 4, 4]} position={[particle.x, particle.y, particle.z]}>
            <meshBasicMaterial
              color="#ffffff"
              toneMapped={false}
            />
          </Sphere>
        ))}
      </group>

      <group position={[0, -sphereSize - 0.01, 0]}>
        <mesh>
          <cylinderGeometry args={[sphereSize * 0.7, sphereSize * 0.85, 0.3, 32]} />
          <meshStandardMaterial
            color={isMySign ? '#f8c7fe' : '#bcbcff'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[sphereSize * 0.7, sphereSize * 0.7, 0.02, 32]} />
          <meshStandardMaterial
            color={isMySign ? '#fffcea' : '#e4e4ff'}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, textOffset, 0]}
          fontSize={0.25 * scale}
          color="white"
          anchorX="center"
        >
          {isMySign ? `▼\n${rank}위` : `${rank}위`}
        </Text>

        <Text
          position={[0, textOffset - 0.45 * scale, 0]}
          fontSize={0.18 * scale}
          color={isMySign ? '#ffaacc' : '#aaddff'}
          anchorX="center"
        >
          {sign}
        </Text>
      </Billboard>
    </group>
  );
};
