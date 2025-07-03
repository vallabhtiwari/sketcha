import "./App.css";
import { useState } from "react";
import type { RoomId } from "./types";
import { JoinRoom } from "./components/JoinRoom";
import { CanvasBoard } from "./components/CanvasBoard";

function App() {
  const [roomId, setRoomId] = useState<RoomId>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const handleJoin = (roomId: RoomId) => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () =>
      socket.send(
        JSON.stringify({
          type: "join",
          roomId,
        })
      );
    setWs(socket);
    setRoomId(roomId);
  };

  if (!roomId || !ws) return <JoinRoom onJoin={handleJoin} />;
  return <CanvasBoard ws={ws} roomId={roomId} />;
}

export default App;
