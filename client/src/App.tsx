import "./App.css";
import { useState } from "react";
import type { RoomId } from "./types";
import { JoinRoom } from "./components/JoinRoom";
import { CanvasBoard } from "./components/CanvasBoard";

function App() {
  const [roomId, setRoomId] = useState<RoomId>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const handleJoin = (roomId: RoomId) => {
    const socket = new WebSocket(
      "ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWNwN255a2UwMDAwcHdvN2ZsNHdvZXEzIiwiZW1haWwiOiJ0ZXN0MUB0ZXN0LmNvbSIsIm5hbWUiOiJ0ZXN0MSIsImlhdCI6MTc1MTY5OTkxM30.lDmrxyNwdOvlC34kND3zqUU8Pgh6GygbFcdRQqfeuVs"
    );
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
