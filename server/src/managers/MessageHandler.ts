import WebSocket from "ws";
import { ConnectionManager } from "./ConnectionManager";
import { Message } from "../types";

export class MessageHandler {
    private connectionManager
    constructor() {
        this.connectionManager = ConnectionManager.getInstance()
    }

    handleConnection(ws: WebSocket) {
        this.connectionManager.addClient(ws)
        ws.on("message", (raw) => this.handleMessage(raw.toString(), ws))
        ws.on("close", () => this.connectionManager.removeClient(ws))
    }

    handleMessage(raw: string, ws: WebSocket) {
        console.log(raw)
        try {
            const message = JSON.parse(raw) as Message
            console.log(message)
            if (message.type == "draw") {
                this.connectionManager.broadcast(message, ws)
            } else {
                console.warn("Unknown Message Type")
            }
        } catch (error) {
            console.error("Invalid Message Format")

        }
    }
}