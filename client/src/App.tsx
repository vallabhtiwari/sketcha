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
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    setPrev({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !prev) return;

    const payload = {
      startX: prev.x,
      startY: prev.y,
      endX: e.clientX,
      endY: e.clientY,
    };

    const message = {
      type: "draw",
      payload,
    };

    // ws.send()

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(payload.startX, payload.startY);
      ctx.lineTo(payload.endX, payload.endY);
      ctx.stroke();
    }
    setPrev({ x: e.clientX, y: e.clientY });
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
