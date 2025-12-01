import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useFortuneStore } from '../../stores/fortuneStore';
import { useIsMobile } from '../../hooks/useIsMobile';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const ChatPanel: React.FC = () => {
  const { messages, isChatOpen, toggleChat, connectionStatus } = useChatStore();
  const { mySign } = useFortuneStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { sendMessage } = useWebSocket(WEBSOCKET_URL, mySign);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && mySign) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#165e30ff';
      case 'error': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '연결됨';
      case 'error': return '연결 오류';
      default: return '연결 안됨';
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: isMobile ? '20px' : '30px',
          right: isMobile ? '20px' : '30px',
          width: isMobile ? '50px' : '60px',
          height: isMobile ? '50px' : '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '20px' : '24px',
          color: 'white',
          zIndex: 999,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        }}
      >
        💬
        {messages.length > 0 && !isChatOpen && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {messages.length > 99 ? '99+' : messages.length}
          </div>
        )}
      </button>

      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? 0 : '100px',
          right: isMobile ? 0 : '30px',
          left: isMobile ? 0 : 'auto',
          top: isMobile ? 0 : 'auto',
          width: isMobile ? '100%' : '400px',
          height: isMobile ? '100%' : '600px',
          background: 'linear-gradient(135deg, rgba(30, 30, 60, 0.98) 0%, rgba(15, 15, 30, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobile ? 0 : '20px',
          border: isMobile ? 'none' : '2px solid rgba(102, 126, 234, 0.3)',
          boxShadow: isMobile ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 998,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                별자리 순위 채팅방
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getConnectionStatusColor(),
                  boxShadow: `0 0 10px ${getConnectionStatusColor()}`
                }} />
                <span style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  {getConnectionStatusText()}
                </span>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '14px',
                marginTop: '50px'
              }}>
                아직 메시지가 없습니다.<br />
                오늘의 순위에 대해 이야기해보세요!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '4px',
                    marginLeft: msg.isMe ? '0' : '8px',
                    marginRight: msg.isMe ? '8px' : '0'
                  }}>
                    {msg.zodiacSign}
                  </div>
                  <div style={{
                    background: msg.isMe
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    boxShadow: msg.isMe
                      ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                      : 'none'
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={mySign ? "메시지를 입력하세요..." : "생년월일을 먼저 입력해주세요"}
              disabled={!mySign || connectionStatus !== 'connected'}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || !mySign || connectionStatus !== 'connected'}
              style={{
                background: inputValue.trim() && mySign && connectionStatus === 'connected'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '14px',
                cursor: inputValue.trim() && mySign && connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                transition: 'transform 0.2s, box-shadow 0.2s',
                opacity: inputValue.trim() && mySign && connectionStatus === 'connected' ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (inputValue.trim() && mySign && connectionStatus === 'connected') {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              전송
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </>
  );
};
