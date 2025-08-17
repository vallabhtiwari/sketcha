import type * as fabric from "fabric";

export type RoomId = string;

export type JoinMessage = {
  type: "join";
  roomId: RoomId;
};

export type DrawMessage = {
  type: "draw";
  roomId: RoomId;
  payload: any;
};

export type EraseMessage = {
  type: "erase";
  roomId: RoomId;
  objectID: string;
};

export type ResetCanvasMessage = {
  type: "reset-canvas";
  roomId: RoomId;
};

export type Message =
  | JoinMessage
  | DrawMessage
export type Message = JoinMessage | DrawMessage | DrawBeginMessage;
  | EraseMessage
  | ResetCanvasMessage;

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

export type User = {
  userId: string;
  name?: string;
  email: string;
};

export type SignupResponse = {
  message: string;
  data: {
    userId: string;
  };
};

export type SigninResponse = {
  accessToken: string;
};
