"use client";

import { useState, useEffect } from "react";
import { RoomId } from "@/types";
import { CanvasBoard } from "@/app/components/CanvasBoard";
import { useUserStore } from "@/store/userStore";

export default function Dashboard({ user }: { user?: any }) {
  const [roomId, setRoomId] = useState<RoomId>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const token = useUserStore((state) => state.token?.accessToken);

  useEffect(() => {
    // Later replace with actual backend call
    // axios.get("https://backend.sketcha.abc.com/api/rooms").then((res) => {
    //   setRooms(res.data.rooms);
    // });
  }, []);

  const handleJoin = (roomId: RoomId) => {
    const socket = new WebSocket(`ws://localhost:8080?token=${token}`);
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

  if (!roomId || !ws) {
    return (
      <div className="px-4 py-8 flex justify-center">
        <div className="w-full max-w-4xl space-y-10">
          <h1 className="text-2xl font-bold text-center text-foreground">
            Welcome{user?.name ? `, ${user.name}` : ""} 🎨
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (roomId.trim()) handleJoin(roomId.trim());
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Enter Room ID"
              className="flex-1 px-4 py-2 rounded-md bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Join Room
            </button>
          </form>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Open Rooms
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => handleJoin(room)}
                    className="bg-muted text-foreground px-4 py-2 rounded-md hover:bg-muted/80 border border-border"
                  >
                    {room}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No rooms available
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="text-white hover:underline w-48 rounded-md"
            >
              {showProfile ? "Hide" : "View / Update"} Profile
            </button>

            {showProfile && (
              <div className="mt-4 border border-border p-4 rounded-md bg-background text-foreground">
                <p>
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
                <p>
                  <strong>Name:</strong> {user?.name || "N/A"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <CanvasBoard roomId={roomId} ws={ws} />;
}
