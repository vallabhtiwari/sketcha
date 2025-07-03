import { WebSocketServer } from "ws";
import http from "http";
import { MessageHandler } from "./managers/MessageHandler";

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WS server is rrunning");
});

const wss = new WebSocketServer({ server });
const messageHandler = new MessageHandler();

wss.on("connection", (ws) => {
  messageHandler.handleConnection(ws);
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
