import { JoinRoomProps, RoomId } from "@/types";
import React, { useState } from "react";

export const JoinRoom = ({ onJoin }: JoinRoomProps) => {
  const [roomId, setRoomId] = useState<RoomId>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) onJoin(roomId.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary h-screen">
      <input
        type="text"
        placeholder="room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
