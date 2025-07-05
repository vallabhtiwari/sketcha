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

export type Message = JoinMessage | DrawMessage;

export type JoinRoomProps = {
  onJoin: (roomId: RoomId) => void;
};

export type CanvasBoardProps = {
  ws: WebSocket;
  roomId: RoomId;
};
