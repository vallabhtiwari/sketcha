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

export type TextUpdateMessage = {
  type: "text-update";
  roomId: RoomId;
  objectID: string;
  text: string;
};

export type ObjectModifiedMessage = {
  type: "object-modified";
  roomId: RoomId;
  objectID: string;
  properties: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    originX?: string;
    originY?: string;
  };
};

export type ViewportUpdateMessage = {
  type: "viewport-update";
  roomId: RoomId;
  transform: [number, number, number, number, number, number];
};

export type Message =
  | JoinMessage
  | DrawMessage
  | EraseMessage
  | ResetCanvasMessage
  | TextUpdateMessage
  | ObjectModifiedMessage
  | ViewportUpdateMessage;

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
  "pan",
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

export type Theme = "light" | "dark";

export type ThemeContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};
