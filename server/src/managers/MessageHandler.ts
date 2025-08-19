import { ConnectionManager } from "./ConnectionManager";
import { CustomWebSocket, Message, RoomId } from "../types";

export class MessageHandler {
  private connectionManager;
  constructor() {
    this.connectionManager = ConnectionManager.getInstance();
  }

  handleConnection(ws: CustomWebSocket) {
    ws.on("message", (raw) => this.handleMessage(raw.toString(), ws));
    ws.on("close", () => {
      const roomId = ws.roomId;
      if (roomId) {
        this.connectionManager.removeClient(roomId, ws);
      }
    });
  }

  handleMessage(message: string, ws: CustomWebSocket) {
    try {
      const parsedMessage = JSON.parse(message) as Message;
      switch (parsedMessage.type) {
        case "join":
          this.connectionManager.addClient(parsedMessage.roomId, ws);
          this.connectionManager.broadcast(parsedMessage, ws);
          break;
        default:
          this.connectionManager.broadcast(parsedMessage, ws);
          break;
      }
    } catch (err) {
      console.error("Invalid Message Format:", err);
    }
  }
}
