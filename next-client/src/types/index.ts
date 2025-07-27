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

const canvasTools = [
  "none",
  "pencil",
  "line",
  "rect",
  "circle",
  "text",
  "eraser",
] as const;

export type CanvasTools = (typeof canvasTools)[number];
