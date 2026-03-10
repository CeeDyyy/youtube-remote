const http = require("http");
const next = require("next");
const WebSocket = require("ws");

const dev = false;
const app = next({ dev, dir: "./nextjs" });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  const wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (request, socket, head) => {

    if (request.url === "/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }

  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (msg) => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(msg.toString());
        }
      });
    });
  });

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });

});