import type * as fabric from "fabric";

export type RoomId = string;

export type JoinMessage = {
  type: "join";
  roomId: RoomId;
};

export type DrawMessage = {
  type: "draw";
  room: RoomId;
  data: string;
};

export type DrawBeginMessage = {
  type: "draw-begin";
  room: RoomId;
  data: string;
};

export type Message = JoinMessage | DrawMessage | DrawBeginMessage;

export type JoinRoomProps = {
  onJoin: (roomId: RoomId) => void;
};

export type CanvasBoardProps = {
  ws: WebSocket;
  roomId: RoomId;
};

export const CanvasToolOptions = [
  "select",
  "pencil",
  "line",
  "rect",
  "circle",
  "text",
  "eraser",
] as const;

export type CanvasToolOptions = (typeof CanvasToolOptions)[number];

export type Action =
  | { type: "add"; object: fabric.Object }
  | { type: "remove"; object: fabric.Object };
