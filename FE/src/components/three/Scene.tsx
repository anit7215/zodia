import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ZodiacSphere } from './ZodiacSphere';
import { Environment, FloatingParticles } from './Background';
import { useFortuneStore } from '../../stores/fortuneStore';

export const Scene: React.FC = () => {
  const { fortunes, mySign } = useFortuneStore();

  const numSigns = fortunes.length;
  const radius = 6;

  const mySignIndex = fortunes.findIndex(f => f.sign === mySign);

  let cameraTarget: [number, number, number] = [0, 0, 0];
  let cameraPosition: [number, number, number] = [0, 0, 10];

  if (mySignIndex !== -1) {
    const angle = (mySignIndex / numSigns) * Math.PI * 2;
    const targetX = radius * Math.cos(angle);
    const targetZ = radius * Math.sin(angle);
    const targetY = (13 - fortunes[mySignIndex].rank) * 0.15;

    cameraTarget = [targetX, targetY, targetZ];

    const cameraDistance = 8;
    const cameraAngle = angle;
    const cameraX = (radius + cameraDistance) * Math.cos(cameraAngle);
    const cameraZ = (radius + cameraDistance) * Math.sin(cameraAngle);
    cameraPosition = [cameraX, targetY + 2, cameraZ];
  }

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />

      <Environment />
      <FloatingParticles />

      {fortunes.map((fortune, index) => {
        const isMySign = fortune.sign === mySign;

        const angle = (index / numSigns) * Math.PI * 2;
        const finalX = radius * Math.cos(angle);
        const finalZ = radius * Math.sin(angle);
        const finalY = (13 - fortune.rank) * 0.15;

        const scale = isMySign ? 1.3 : 1.0;

        return (
          <ZodiacSphere
            key={fortune.sign}
            position={[finalX, finalY, finalZ]}
            sign={fortune.sign}
            rank={fortune.rank}
            content={fortune.content_kr}
            isMySign={isMySign}
            scale={scale}
            luckyColor={fortune.lucky_color}
            luckyItem={fortune.lucky_item}
          />
        );
      })}

      <OrbitControls
        target={cameraTarget}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 6}
        autoRotate={false}
      />
    </Canvas>
  );
};
