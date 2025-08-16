import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MessageHandler } from "./managers/MessageHandler";
import { authRouter } from "./routers/authRouter";
import { AuthenticatedRequest, CustomWebSocket } from "./types";
import cookieParser from "cookie-parser";

const PORT = 8080;
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });
const messageHandler = new MessageHandler();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim());

const isDev = process.env.NODE_ENV === "development";
const corsOptions = {
  origin: isDev
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : allowedOrigins,
  credentials: true,
};

server.on("upgrade", (req, socket, head) => {
  const origin = req.headers.origin;
  if (!isDev) {
    if (!origin || !allowedOrigins.includes(origin)) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }
  }
  try {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || "SUPER_SECRET");
    const authReq = req as AuthenticatedRequest;
    authReq.user = payload as JwtPayload;

    wss.handleUpgrade(req, socket, head, (ws) => {
      const authedWs = ws as CustomWebSocket;
      authedWs.user = authReq.user;
      wss.emit("connection", authedWs, authReq);
    });
  } catch (err) {
    console.log("Auth error:", err);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
});

wss.on("connection", (ws: CustomWebSocket, req: AuthenticatedRequest) => {
  if (!req.user) return ws.close();
  messageHandler.handleConnection(ws);
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("HTTP service running...");
});

app.use("/auth", authRouter);

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
