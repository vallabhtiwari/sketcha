import React, { useState } from "react";
import type { JoinRoomProps, RoomId } from "../types";

export const JoinRoom = ({ onJoin }: JoinRoomProps) => {
  const [roomId, setRoomId] = useState<RoomId>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) onJoin(roomId.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
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
