import React, { useEffect } from 'react';
import { useFortuneStore } from '../../stores/fortuneStore';
import { getRankColor, getZodiacDateRange } from '../../utils/zodiac';

export const FortuneModal: React.FC = () => {
  const { isModalOpen, modalData, closeModal } = useFortuneStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen || !modalData) return null;

  const { rank, sign, content, luckyColor, luckyItem } = modalData;
  const dateRange = getZodiacDateRange(sign);

  const cleanContent = content.replace(/\s*\(행운의 색:.*?\)$/g, '').trim();

  return (
    <>
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 60, 0.95) 0%, rgba(15, 15, 30, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '70vh',
            overflow: 'auto',
            boxShadow: `0 20px 60px ${getRankColor(rank, false, false)}40`,
            border: `2px solid ${getRankColor(rank, false, false)}`,
            position: 'relative',
            animation: 'modalSlideIn 0.3s ease-out'
          }}
        >
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            ×
          </button>

          <div
            style={{
              display: 'inline-block',
              background: getRankColor(rank, false, false),
              color: 'black',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              marginBottom: '20px',
              boxShadow: `0 4px 15px ${getRankColor(rank, false, false)}60`
            }}
          >
            {rank}위
          </div>

          <h2
            style={{
              color: 'white',
              fontSize: '28px',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            {sign}
          </h2>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            {dateRange}
          </p>

          <div
            style={{
              width: '100%',
              height: '2px',
              background: `linear-gradient(to right, transparent, ${getRankColor(rank, false, false)}, transparent)`,
              marginBottom: '25px'
            }}
          />

          <div
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              marginBottom: '20px'
            }}
          >
            {cleanContent}
          </div>

          {(luckyColor || luckyItem) && (
            <div
              style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                marginTop: '20px'
              }}
            >
              {luckyColor && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '120px',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '6px'
                    }}
                  >
                    행운의 색상
                  </div>
                  <div
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    {luckyColor}
                  </div>
                </div>
              )}

              {luckyItem && (
                <div
                  style={{
                    flex: '1',
                    minWidth: '120px',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '6px'
                    }}
                  >
                    행운의 아이템
                  </div>
                  <div
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    {luckyItem}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
};
