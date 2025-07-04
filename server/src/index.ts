import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import { MessageHandler } from "./managers/MessageHandler";
import { authRouter } from "./routers/authRouter";

const PORT = 8080;
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const messageHandler = new MessageHandler();

wss.on("connection", (ws) => {
  messageHandler.handleConnection(ws);
});

app.use(express.json());
app.get("/", (req, res) => {
  res.json("HTTP service running...");
});
app.use("/auth", authRouter);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
