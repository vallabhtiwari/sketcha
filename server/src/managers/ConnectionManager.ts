import WebSocket from "ws";
import { Message, RoomId } from "../types";
export class ConnectionManager {
  private static instance: ConnectionManager;
  private rooms = new Map<RoomId, Set<WebSocket>>();

  private constructor() {}

  static getInstance() {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  addClient(roomId: RoomId, ws: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)?.add(ws);
    console.log("ADD", roomId);
  }
  removeClient(roomId: RoomId, ws: WebSocket) {
    const clients = this.rooms.get(roomId);
    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        this.rooms.delete(roomId);
      }
    }
    console.log("REMOVE", roomId);
  }
  broadcast(message: Message, except?: WebSocket) {
    const clients = this.rooms.get(message.roomId);
    if (!clients) return;

    const json = JSON.stringify(message);
    clients.forEach((client) => {
      if (client !== except && client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    });
  }
}
