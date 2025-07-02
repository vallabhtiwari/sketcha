import { ConnectionManager } from "./ConnectionManager";
import { Message, RoomId, WSWithRoom } from "../types";

export class MessageHandler {
  private connectionManager;
  constructor() {
    this.connectionManager = ConnectionManager.getInstance();
  }

  handleConnection(ws: WSWithRoom) {
    ws.on("message", (raw) => this.handleMessage(raw.toString(), ws));
    ws.on("close", () => {
      const roomId = ws.roomId;
      if (roomId) {
        this.connectionManager.removeClient(roomId, ws);
      }
    });
  }

  handleMessage(message: string, ws: WSWithRoom) {
    try {
      const parsedMessage = JSON.parse(message) as Message;
      const type = parsedMessage.type;
      switch (parsedMessage.type) {
        case "join":
          this.connectionManager.addClient(parsedMessage.roomId, ws);
          this.connectionManager.broadcast(parsedMessage, ws);
          break;
        case "draw":
          this.connectionManager.broadcast(parsedMessage, ws);
          break;
      }
    } catch (err) {
      console.error("Invalid Message Format:", err);
    }
  }
}
