import { JwtPayload } from "jsonwebtoken";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";
export type RoomId = string;

export type Message =
  | JoinMessage
  | DrawMessage
  | EraseMessage
  | ResetCanvasMessage;

export type DrawMessage = {
  type: "draw";
  roomId: RoomId;
  payload: any;
};

export type JoinMessage = {
  type: "join";
  roomId: RoomId;
};

export type EraseMessage = {
  type: "erase";
  roomId: RoomId;
  payload: any;
};

export type ResetCanvasMessage = {
  type: "reset-canvas";
  roomId: RoomId;
};

export type CustomWebSocket = WebSocket & { user: JwtPayload; roomId?: RoomId };

export interface AuthenticatedRequest extends IncomingMessage {
  user: JwtPayload;
}
