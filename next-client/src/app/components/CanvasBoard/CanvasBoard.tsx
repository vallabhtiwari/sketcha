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
  const canvasShapeOptions = [
    "pencil",
    "line",
    "rect",
    "circle",
    "text",
    "eraser",
  ] as const;

  const [showMenu, setShowMenu] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const brushColorRef = useRef(brushColor);
  const [brushWidth, setBrushWidth] = useState(3);
  const [canvasBackground, setCanvasBackground] = useState(
    canvasBackgroundOptions[0]
  );

  type CanvasShape = (typeof canvasShapeOptions)[number];

  const [selectedTool, setSelectedTool] = useState<CanvasShape>("pencil");
  const selectedToolRef = useRef<CanvasShape>("pencil");
  const drawingRef = useRef<fabric.Object | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

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
      // canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.on("mouse:down", (opt) => {
        const pointer = canvas.getScenePoint(opt.e);
        const clickedTarget = opt.target;
        console.log(clickedTarget);
        const { x, y } = pointer;
        startPointRef.current = { x, y };
        if (selectedToolRef.current === "eraser") {
          if (clickedTarget) {
            canvas.remove(clickedTarget);
            canvas.requestRenderAll();
          }
        }

        if (selectedToolRef.current === "line") {
          console.log("Start Line");
          const line = new fabric.Line([x, y, x, y], {
            stroke: brushColorRef.current,
            width: brushWidth,
            selectable: true,
          });
          canvas.add(line);
          canvas.setActiveObject(line);
          drawingRef.current = line;
        }
        if (selectedToolRef.current === "rect") {
          console.log("Start Rect");
          const rect = new fabric.Rect({
            left: x,
            top: y,
            width: 0,
            height: 0,
            fill: "transparent",
            stroke: brushColorRef.current,
            strokeWidth: brushWidth,
            selectable: true,
          });
          canvas.add(rect);
          canvas.setActiveObject(rect);
          drawingRef.current = rect;
        }
        if (selectedToolRef.current === "circle") {
          const circ = new fabric.Circle({
            left: x,
            top: y,
            radius: 0,
            fill: "transparent",
            stroke: brushColorRef.current,
            strokeWidth: brushWidth,
            originX: "center",
            originY: "center",
            selectable: true,
            evented: true,
          });
          canvas.add(circ);
          canvas.setActiveObject(circ);
          drawingRef.current = circ;
        }
        if (selectedToolRef.current === "text") {
          if (clickedTarget && clickedTarget.type === "textbox") {
            canvas.setActiveObject(clickedTarget);
            (clickedTarget as fabric.Textbox).enterEditing();
            canvas.renderAll();

            return;
          }
          const textbox = new fabric.Textbox("Type here", {
            left: x,
            top: y,
            width: 200,
            fontSize: 20,
            fill: brushColorRef.current,
            selectable: true,
            editable: true,
            padding: 6,
            borderColor: "#4F46E5",
            cornerColor: "#4F46E5",
            cornerSize: 8,
            transparentCorners: false,
          });

          const isPlaceholderRef = { current: true };

          canvas.add(textbox);
          canvas.setActiveObject(textbox);
          textbox.enterEditing();
          textbox.selectAll();
          canvas.renderAll();

          textbox.on("changed", () => {
            if (isPlaceholderRef.current) {
              textbox.text = ""; // Clear the placeholder
              isPlaceholderRef.current = false;
              canvas.renderAll();
            }
          });

          drawingRef.current = textbox;
        }
      });
      canvas.on("mouse:move", (opt) => {
        if (!drawingRef.current || !startPointRef.current) return;
        const pointer = canvas.getScenePoint(opt.e);
        const { x, y } = pointer;
        const startX = startPointRef.current.x;
        const startY = startPointRef.current.y;
        if (drawingRef.current.type === "line") {
          console.log("Draw Line");
          drawingRef.current.set({ x2: x, y2: y });
        }
        if (drawingRef.current.type === "rect") {
          const width = x - startX;
          const height = y - startY;

          drawingRef.current.set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width < 0 ? x : startX,
            top: height < 0 ? y : startY,
          });
        }

        if (drawingRef.current.type === "circle") {
          const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2) / 2;
          const centerX = (x + startX) / 2;
          const centerY = (y + startY) / 2;

          drawingRef.current.set({
            left: centerX,
            top: centerY,
            radius,
          });
        }
        canvas.renderAll();
      });
      canvas.on("mouse:up", () => {
        console.log("End ", selectedTool);
        if (drawingRef.current?.type) {
          const message = {
            type: "draw",
            roomId,
            payload: drawingRef.current.toObject(),
          };
          ws.send(JSON.stringify(message));
        }
        drawingRef.current = null;
        startPointRef.current = null;
      });
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
    if (!canvas) return;
    if (selectedTool === "pencil") {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
    brushColorRef.current = brushColor;
  }, [brushColor, brushWidth, selectedTool]);
  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  return (
    <div
      className="relative flex-1 flex flex-col dark:bg-gray-900 overflow-hidden"
      style={{ background: canvasBackground }}
    >
      <div className="absolute m-2 z-1 flex justify-start">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-xl px-3 py-2 font-bold cursor-pointer bg-muted rounded-md border border-primary"
        >
          ☰
        </button>
      </div>
      {showMenu && (
        <div className="absolute top-15 left-2 bg-white dark:bg-gray-800 p-4 shadow-md z-50 rounded-md border border-primary">
          <div className="space-y-2">
            <div>
              <span>Tool</span>
              <div className="flex justify-between">
                {canvasShapeOptions.map((shape) => (
                  <div
                    key={shape}
                    className="w-8 h-6 rounded-sm bg-secondary text-center cursor-pointer"
                    onClick={() => setSelectedTool(shape)}
                  >
                    {shape[0]}
                  </div>
                ))}
              </div>
            </div>
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
        <span className="absolute top-90 left-10">{selectedTool}</span>
        <Canvas ref={ref} onLoad={onLoad} />
      </div>
    </div>
  );
};
