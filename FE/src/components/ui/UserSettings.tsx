import React, { useState } from 'react';
import type { UserSettingsProps } from '../../types/type';

export const UserSettings: React.FC<UserSettingsProps> = ({ onSave }) => {
  const [birthDate, setBirthDate] = useState(() => {
    return localStorage.getItem('myBirthDate') || '';
  });

  const handleSave = () => {
    if (!birthDate) return;
    onSave(birthDate);
    alert('저장되었습니다! 내 별자리가 중앙에 표시됩니다.');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        background: '#101425ff',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        borderRadius: '15px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      <label style={{ fontSize: '13px' }}>
        내 생일 입력 (YYYY-MM-DD)
      </label>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          fontSize: '14px'
        }}
      />
      <button
        onClick={handleSave}
        style={{
          padding: '10px 15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        설정 저장
      </button>
    </div>
  );
};
