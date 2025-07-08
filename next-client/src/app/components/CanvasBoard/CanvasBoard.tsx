import { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Canvas } from "./_Canvas";
import type { CanvasBoardProps, DrawMessage } from "@/types";

export const CanvasBoard = ({ ws, roomId }: CanvasBoardProps) => {
  const ref = useRef<fabric.Canvas>(null);
  const canvasBackgroundOptions = [
    "#f8f8f8",
    "#444444",
    "#586071",
    "#6a5c5c",
    "#6a3c3c",
  ];

  const [showMenu, setShowMenu] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(3);
  const [canvasBackground, setCanvasBackground] = useState(
    canvasBackgroundOptions[0]
  );

  const onLoad = useCallback(
    (canvas: fabric.Canvas) => {
      const resizeCanvas = () => {
        const el = canvas.lowerCanvasEl;
        if (el && el.parentElement?.parentElement) {
          const { width, height } =
            el.parentElement.parentElement.getBoundingClientRect();
          canvas.setDimensions({ width, height });
        }
      };
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.on("path:created", (e) => {
        const path = e.path as fabric.Path;
        if (!path) return;

        const message = {
          type: "draw",
          roomId,
          payload: path.toObject(),
        };

        ws.send(JSON.stringify(message));
      });

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data) as DrawMessage;
          if (message.type === "draw") {
            const [obj] = await fabric.util.enlivenObjects([message.payload]);
            if (obj && "type" in obj && typeof obj.type === "string") {
              canvas.add(obj as fabric.Object);
            } else {
              console.warn("Received non-displayable object", obj);
            }
          }
        } catch (err) {
          console.error("Failed to load remote drawing:", err);
        }
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    },
    [ws, roomId]
  );

  useEffect(() => {
    const canvas = ref.current;
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth]);

  return (
    <div
      className="relative flex-1 flex flex-col dark:bg-gray-900 overflow-hidden"
      style={{ background: canvasBackground }}
    >
      <div className="absolute m-2 z-1 flex justify-start">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-xl px-3 py-2 font-bold hover:cursor-pointer bg-muted rounded-md border border-primary"
        >
          ☰
        </button>
      </div>
      {showMenu && (
        <div className="absolute top-15 left-2 bg-white dark:bg-gray-800 p-4 shadow-md z-50 rounded-md border border-primary">
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Color
              </label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="ml-1 w-8 h-6 p-0 border-none outline-none"
                // style={{ background: "white" }}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Width
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={brushWidth}
                onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                className="w-full accent-primary m-0 p-0"
              />
              <span>{brushWidth}</span>
            </div>
            <div>
              <span>Canvas background</span>
              <div className="flex justify-between">
                {canvasBackgroundOptions.map((item) => (
                  <div
                    key={item}
                    className="w-8 h-6 rounded-sm cursor-pointer border border-muted"
                    style={{ backgroundColor: item }}
                    title={item}
                    onClick={() => setCanvasBackground(item)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex-1"
        onPointerDown={() => setShowMenu && setShowMenu(false)}
      >
        <Canvas ref={ref} onLoad={onLoad} />
      </div>
    </div>
  );
};
