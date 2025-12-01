import { useEffect, useRef } from 'react';
import { useChatStore } from '../stores/chatStore';

export const useWebSocket = (url: string, zodiacSign: string | null) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { addMessage, setConnectionStatus } = useChatStore();

  useEffect(() => {
    if (!zodiacSign) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');

      ws.send(JSON.stringify({
        type: 'join',
        zodiacSign
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
          addMessage({
            id: data.id || Date.now().toString(),
            zodiacSign: data.zodiacSign,
            message: data.message,
            timestamp: data.timestamp || Date.now(),
            isMe: data.zodiacSign === zodiacSign
          });
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url, zodiacSign, addMessage, setConnectionStatus]);

  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && zodiacSign) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        zodiacSign,
        message,
        timestamp: Date.now()
      }));
    }
  };

  return { sendMessage };
};
