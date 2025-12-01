import { Scene } from './components/three/Scene';
import { UserSettings } from './components/ui/UserSettings';
import { FortuneModal } from './components/ui/FortuneModal';
import { ChatPanel } from './components/ui/ChatPanel';
import { useFortunes } from './hooks/useFortunes';
import { useZodiac } from './hooks/useZodiac';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  useFortunes();
  const { saveBirthDate } = useZodiac();
  const isMobile = useIsMobile();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dateString = `${year}년 ${month}월 ${day}일`;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'linear-gradient(to bottom, #000428, #004e92)' }}>
      <div style={{
        position: 'absolute',
        top: isMobile ? '15px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        color: 'white',
        fontSize: isMobile ? '16px' : '24px',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        letterSpacing: isMobile ? '1px' : '2px'
      }}>
        {dateString}
      </div>

      <UserSettings onSave={saveBirthDate} />
      <Scene />
      <FortuneModal />
      <ChatPanel />
    </div>
  );
}