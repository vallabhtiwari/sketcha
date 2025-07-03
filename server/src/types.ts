import { WebSocket } from "ws";
export type RoomId = string;

export type Message = JoinMessage | DrawMessage;

export type DrawMessage = {
  type: "draw";
  roomId: RoomId;
  payload: any;
};

export type JoinMessage = {
  type: "join";
  roomId: RoomId;
};

export type WSWithRoom = WebSocket & { roomId?: RoomId };
