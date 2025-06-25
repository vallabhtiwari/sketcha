import WebSocket from "ws"
import { Message } from "../types"
export class ConnectionManager {
    private static instance: ConnectionManager
    private clients = new Set<WebSocket>

    private constructor() { }

    static getInstance() {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager()

        }
        return ConnectionManager.instance
    }

    addClient(ws: WebSocket) {
        this.clients.add(ws)
        console.log("Client Added ", this.clients.size)
    }
    removeClient(ws: WebSocket) {
        this.clients.delete(ws)
    }
    broadcast(message: Message, except?: WebSocket) {
        const json = JSON.stringify(message)
        this.clients.forEach(client => {
            console.log("Sent to ", client)
            if (client !== except && client.readyState === WebSocket.OPEN) {
                client.send(json)
            }
        })
    }
}