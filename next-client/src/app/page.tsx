"use client";
import Image from "next/image";
import { useState } from "react";
import { RoomId } from "@/types";
import { Main } from "@/app/components/Main";

export default function Home() {
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

  return <Main />;
}
