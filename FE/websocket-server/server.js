const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();

console.log(`WebSocket 서버가 포트 ${PORT}에서 실행 중입니다.`);

wss.on('connection', (ws) => {
  console.log('새로운 클라이언트 연결');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        clients.set(ws, data.zodiacSign);
        console.log(`${data.zodiacSign} 접속`);

        ws.send(JSON.stringify({
          type: 'message',
          zodiacSign: '시스템',
          message: `채팅방에 오신 것을 환영합니다! 현재 ${clients.size}명이 접속 중입니다.`,
          timestamp: Date.now(),
          id: `system-${Date.now()}`
        }));

      } else if (data.type === 'message') {
        const messageData = {
          type: 'message',
          zodiacSign: data.zodiacSign,
          message: data.message,
          timestamp: data.timestamp,
          id: `${data.zodiacSign}-${data.timestamp}`
        };

        console.log(`[${data.zodiacSign}]: ${data.message}`);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messageData));
          }
        });
      }
    } catch (error) {
      console.error('메시지 처리 오류:', error);
    }
  });

  ws.on('close', () => {
    const zodiacSign = clients.get(ws);
    if (zodiacSign) {
      console.log(`${zodiacSign} 연결 해제`);
      clients.delete(ws);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'message',
            zodiacSign: '시스템',
            message: `${zodiacSign}님이 퇴장하셨습니다. 현재 ${clients.size}명이 접속 중입니다.`,
            timestamp: Date.now(),
            id: `system-${Date.now()}`
          }));
        }
      });
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket 오류:', error);
  });
});

wss.on('error', (error) => {
  console.error('서버 오류:', error);
});

process.on('SIGINT', () => {
  console.log('\n서버를 종료합니다...');
  wss.clients.forEach((client) => {
    client.close();
  });
  wss.close(() => {
    console.log('서버가 종료되었습니다.');
    process.exit(0);
  });
});
