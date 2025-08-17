import { JwtPayload } from "jsonwebtoken";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";
export type RoomId = string;

export type Message =
  | JoinMessage
  | DrawMessage
  | EraseMessage
  | ResetCanvasMessage
  | TextUpdateMessage
  | ObjectModifiedMessage;

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

export type CustomWebSocket = WebSocket & { user: JwtPayload; roomId?: RoomId };

export interface AuthenticatedRequest extends IncomingMessage {
  user: JwtPayload;
}
