const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('/root/cert.pem'),
  key: fs.readFileSync('/root/key.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    // echo or broadcast as needed
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.send('Connected securely via WSS');
  console.log('Client connected');
});

const PORT = 8088; // standard HTTPS, or your chosen port
server.listen(PORT, () =>
  console.log(`WebSocket server running over WSS on port ${PORT}`)
);