import { useEffect, useRef, useState } from "react";
import "./App.css";

const ws = new WebSocket("ws://localhost:8080");
type DrawPayload = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
type Message = {
  type: "draw";
  payload: DrawPayload;
};
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prev, setPrev] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      if (message.type === "draw") {
        const { startX, startY, endX, endY } = message.payload;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPrev({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !prev) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const payload = {
      startX: prev.x,
      startY: prev.y,
      endX: x,
      endY: y,
    };
    const message = {
      type: "draw",
      payload,
    };

    ws.send(JSON.stringify(message));

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(payload.startX, payload.startY);
      ctx.lineTo(payload.endX, payload.endY);
      ctx.stroke();
    }

    setPrev({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPrev(null);
  };
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid black", cursor: "crosshair" }}
    ></canvas>
  );
}

export default App;
