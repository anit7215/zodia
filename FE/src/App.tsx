import React from 'react';
import { Scene } from './components/three/Scene';
import { UserSettings } from './components/ui/UserSettings';
import { FortuneModal } from './components/ui/FortuneModal';
import { useFortunes } from './hooks/useFortunes';
import { useZodiac } from './hooks/useZodiac';

export default function App() {
  useFortunes();
  const { saveBirthDate } = useZodiac();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dateString = `${year}년 ${month}월 ${day}일`;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'linear-gradient(to bottom, #000428, #004e92)' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        color: 'white',
        fontSize: '24px',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        letterSpacing: '2px'
      }}>
        {dateString}
      </div>

      <UserSettings onSave={saveBirthDate} />
      <Scene />
      <FortuneModal />
    </div>
  );
}