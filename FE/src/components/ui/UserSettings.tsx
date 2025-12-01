import React, { useState } from 'react';
import type { UserSettingsProps } from '../../types/type';
import { useIsMobile } from '../../hooks/useIsMobile';

export const UserSettings: React.FC<UserSettingsProps> = ({ onSave }) => {
  const [birthDate, setBirthDate] = useState(() => {
    return localStorage.getItem('myBirthDate') || '';
  });
  const isMobile = useIsMobile();

  const handleSave = () => {
    if (!birthDate) return;
    onSave(birthDate);
    alert('저장되었습니다! 내 별자리가 중앙에 표시됩니다.');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: isMobile ? '60px' : '20px',
        left: isMobile ? '50%' : '20px',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        zIndex: 10,
        background: '#101425ff',
        backdropFilter: 'blur(10px)',
        padding: isMobile ? '15px' : '20px',
        borderRadius: '15px',
        color: 'white',
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        alignItems: isMobile ? 'center' : 'stretch',
        gap: isMobile ? '8px' : '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: isMobile ? 'calc(100% - 30px)' : 'auto',
        maxWidth: isMobile ? '400px' : 'none'
      }}
    >
      {!isMobile && (
        <label style={{ fontSize: '13px' }}>
          내 생일 입력 (YYYY-MM-DD)
        </label>
      )}
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        style={{
          padding: isMobile ? '6px' : '8px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          fontSize: isMobile ? '12px' : '14px',
          flex: isMobile ? 1 : 'none'
        }}
      />
      <button
        onClick={handleSave}
        style={{
          padding: isMobile ? '8px 12px' : '10px 15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: isMobile ? '12px' : '14px',
          transition: 'transform 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        저장
      </button>
    </div>
  );
};
