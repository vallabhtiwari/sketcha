import { useCallback, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Canvas } from "./_Canvas";
import type {
  CanvasBoardProps,
  DrawMessage,
  Action,
  CanvasToolOptions,
  EraseMessage,
  Message,
  ResetCanvasMessage,
  TextUpdateMessage,
  ObjectModifiedMessage,
} from "@/types";
import { useSketchStore } from "@/store/sketchStore";
import { CanvasTools } from "./_CanvasTools";

export const CanvasBoard = ({ ws, roomId }: CanvasBoardProps) => {
  const ref = useRef<fabric.Canvas>(null);
  const brushColor = useSketchStore((state) => state.brushColor);
  const brushWidth = useSketchStore((state) => state.brushWidth);
  const canvasBackground = useSketchStore((state) => state.canvasBackground);
  const selectedTool = useSketchStore((state) => state.selectedTool);
  const setShowMenu = useSketchStore((state) => state.setShowMenu);

  const brushColorRef = useRef(brushColor);
  const brushWidthRef = useRef(brushWidth);
  const selectedToolRef = useRef(selectedTool);
  const drawingRef = useRef<fabric.Object | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const undoStackRef = useRef<Action[]>([]);
  const redoStackRef = useRef<Action[]>([]);
  const hasMovedRef = useRef(false);
  const didResetRef = useRef(false);
  const objectIDRef = useRef("");
  const handleUndoRef = useRef<(() => void) | null>(null);
  const handleRedoRef = useRef<(() => void) | null>(null);
  const handleResetCanvasRef = useRef<(() => void) | null>(null);
  const isReceivingModificationRef = useRef(false);

  const onLoad = useCallback(
    (canvas: fabric.Canvas) => {
      ref.current = canvas;

      const resizeCanvas = () => {
        const el = canvas.lowerCanvasEl;
        if (el && el.parentElement?.parentElement) {
          const { width, height } =
            el.parentElement.parentElement.getBoundingClientRect();
          canvas.setDimensions({ width, height });
        }
      };
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

      // Track pencil drawing for undo
      canvas.on("path:created", (e) => {
        if (e.path) {
          e.path.set("objectID", crypto.randomUUID());
          undoStackRef.current.push({ type: "add", object: e.path });
          if (ws && ws.readyState === WebSocket.OPEN) {
            console.log("sending draw message in path created");
            const pathData = e.path.toObject();
            pathData.objectID = e.path.get("objectID");
            const message: DrawMessage = {
              type: "draw",
              roomId,
              payload: pathData,
            };
            ws.send(JSON.stringify(message));
          }
        }
      });
      canvas.on("mouse:down", (opt) => {
        objectIDRef.current = crypto.randomUUID();
        const pointer = canvas.getScenePoint(opt.e);
        const clickedTarget = opt.target;
        const { x, y } = pointer;
        startPointRef.current = { x, y };
        hasMovedRef.current = false;
        if (selectedToolRef.current === "eraser") {
          if (clickedTarget) {
            // Store the removed object for undo
            undoStackRef.current.push({
              type: "remove",
              object: clickedTarget,
            });
            canvas.remove(clickedTarget);
            canvas.requestRenderAll();
            const message: EraseMessage = {
              type: "erase",
              roomId,
              objectID: clickedTarget.get("objectID"),
            };
            ws.send(JSON.stringify(message));
          }
        }
        if (selectedToolRef.current === "line") {
          const line = new fabric.Line([x, y, x, y], {
            stroke: brushColorRef.current,
            strokeWidth: brushWidthRef.current,
            selectable: true,
            objectID: objectIDRef.current,
          });
          canvas.add(line);
          canvas.setActiveObject(line);
          drawingRef.current = line;
        }
        if (selectedToolRef.current === "rect") {
          const rect = new fabric.Rect({
            left: x,
            top: y,
            width: 0,
            height: 0,
            fill: "transparent",
            stroke: brushColorRef.current,
            strokeWidth: brushWidthRef.current,
            selectable: true,
            objectID: objectIDRef.current,
          });
          canvas.add(rect);
          canvas.setActiveObject(rect);
          drawingRef.current = rect;
        }
        if (selectedToolRef.current === "circle") {
          const ellipse = new fabric.Ellipse({
            left: x,
            top: y,
            rx: 0,
            ry: 0,
            fill: "transparent",
            stroke: brushColorRef.current,
            strokeWidth: brushWidthRef.current,
            originX: "center",
            originY: "center",
            selectable: true,
            evented: true,
            objectID: objectIDRef.current,
          });
          canvas.add(ellipse);
          canvas.setActiveObject(ellipse);
          drawingRef.current = ellipse;
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
            selectable: true,
            editable: true,
            padding: 6,
            borderColor: "#4F46E5",
            cornerColor: "#4F46E5",
            cornerSize: 8,
            transparentCorners: false,
            stroke: brushColorRef.current,
            objectID: objectIDRef.current,
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
            if (ws && ws.readyState === WebSocket.OPEN) {
              const message: TextUpdateMessage = {
                type: "text-update",
                roomId,
                objectID: textbox.get("objectID"),
                text: textbox.text,
              };
              ws.send(JSON.stringify(message));
            }
          });

          drawingRef.current = textbox;
        }
      });
      canvas.on("mouse:move", (opt) => {
        const pointer = canvas.getScenePoint(opt.e);
        const { x, y } = pointer;
        if (!startPointRef.current || !drawingRef.current) return;

        hasMovedRef.current = true;

        if (selectedToolRef.current === "line") {
          const line = drawingRef.current as fabric.Line;
          if (line) {
            line.set({ x2: x, y2: y });
            canvas.requestRenderAll();
          }
        }
        if (selectedToolRef.current === "rect") {
          const rect = drawingRef.current as fabric.Rect;
          if (rect) {
            const width = x - startPointRef.current.x;
            const height = y - startPointRef.current.y;
            rect.set({
              width: Math.abs(width),
              height: Math.abs(height),
              left: Math.min(x, startPointRef.current.x),
              top: Math.min(y, startPointRef.current.y),
            });
            canvas.requestRenderAll();
          }
        }
        if (selectedToolRef.current === "circle") {
          const ellipse = drawingRef.current as fabric.Ellipse;
          if (ellipse) {
            const rx = Math.abs(x - startPointRef.current.x) / 2;
            const ry = Math.abs(y - startPointRef.current.y) / 2;
            const center = {
              x: (x + startPointRef.current.x) / 2,
              y: (y + startPointRef.current.y) / 2,
            };
            ellipse.set({
              rx,
              ry,
              left: center.x,
              top: center.y,
            });
            canvas.requestRenderAll();
          }
        }
      });
      canvas.on("mouse:up", () => {
        if (
          selectedToolRef.current !== "pencil" &&
          (hasMovedRef.current ||
            (drawingRef.current && selectedToolRef.current === "text"))
        ) {
          const objects = canvas.getObjects();
          if (objects.length > 0) {
            const lastObject = objects[objects.length - 1];
            undoStackRef.current.push({ type: "add", object: lastObject });

            if (ws && ws.readyState === WebSocket.OPEN) {
              lastObject.setCoords();
              const boundingRect = lastObject.getBoundingRect();
              const objectData = lastObject.toObject();
              objectData.objectID =
                lastObject.get("objectID") || objectIDRef.current;
              if (selectedToolRef.current == "circle") {
                objectData.left = boundingRect.left;
                objectData.top = boundingRect.top;
                objectData.originX = "left";
                objectData.originY = "top";
              } else {
                objectData.left = boundingRect.left;
                objectData.top = boundingRect.top;
              }
              const message: DrawMessage = {
                type: "draw",
                roomId,
                payload: objectData,
              };
              ws.send(JSON.stringify(message));
            }
          }
        }
        startPointRef.current = null;
        drawingRef.current = null;
        hasMovedRef.current = false;
      });

      canvas.on("object:modified", (opt) => {
        if (isReceivingModificationRef.current) return;

        const obj = opt.target;
        if (!obj || !obj.get("objectID")) return;

        if (ws && ws.readyState === WebSocket.OPEN) {
          const message: ObjectModifiedMessage = {
            type: "object-modified",
            roomId,
            objectID: obj.get("objectID"),
            properties: {
              left: obj.get("left"),
              top: obj.get("top"),
              width: obj.get("width"),
              height: obj.get("height"),
              fill: obj.get("fill"),
              stroke: obj.get("stroke"),
              strokeWidth: obj.get("strokeWidth"),
              scaleX: obj.get("scaleX"),
              scaleY: obj.get("scaleY"),
              angle: obj.get("angle"),
              originX: obj.get("originX"),
              originY: obj.get("originY"),
            },
          };
          ws.send(JSON.stringify(message));
        }
      });

      const handleUndo = () => {
        if (!canvas) return;
        if (didResetRef.current) {
          while (undoStackRef.current.length > 0) {
            const action = undoStackRef.current.shift();
            if (!action) break;
            if (action.type === "remove") {
              canvas.add(action.object);
              redoStackRef.current.push(action);
              if (ws && ws.readyState === WebSocket.OPEN) {
                const message: DrawMessage = {
                  type: "draw",
                  roomId,
                  payload: action.object.toObject(),
                };
                ws.send(JSON.stringify(message));
              }
            }
          }
          didResetRef.current = false;
          return;
        }
        const activeObject = canvas.getActiveObject();
        if (activeObject?.type === "textbox") {
          return;
        }
        const action = undoStackRef.current.pop();
        if (!action) return;
        if (action.type === "add") {
          canvas.remove(action.object);
          redoStackRef.current.push(action);
          if (ws && ws.readyState === WebSocket.OPEN) {
            const message: EraseMessage = {
              type: "erase",
              roomId,
              objectID: action.object.get("objectID"),
            };
            ws.send(JSON.stringify(message));
          }
        } else if (action.type === "remove") {
          canvas.add(action.object);
          redoStackRef.current.push(action);
          if (ws && ws.readyState === WebSocket.OPEN) {
            const message: DrawMessage = {
              type: "draw",
              roomId,
              payload: action.object.toObject(),
            };
            ws.send(JSON.stringify(message));
          }
        }
      };

      const handleRedo = () => {
        if (!canvas) return;

        const action = redoStackRef.current.pop();
        if (!action) return;
        if (action.type === "add") {
          canvas.add(action.object);
          undoStackRef.current.push(action);
          if (ws && ws.readyState === WebSocket.OPEN) {
            const message: DrawMessage = {
              type: "draw",
              roomId,
              payload: action.object.toObject(),
            };
            ws.send(JSON.stringify(message));
          }
        } else if (action.type === "remove") {
          canvas.remove(action.object);
          undoStackRef.current.push(action);
          if (ws && ws.readyState === WebSocket.OPEN) {
            const message: EraseMessage = {
              type: "erase",
              roomId,
              objectID: action.object.get("objectID"),
            };
            ws.send(JSON.stringify(message));
          }
        }
      };

      const handleResetCanvas = () => {
        if (!canvas) return;
        const objects = canvas.getObjects();
        undoStackRef.current = [];
        objects.forEach((object) => {
          undoStackRef.current.push({ type: "remove", object });
        });
        redoStackRef.current = [];
        canvas.clear();
        didResetRef.current = true;
        if (ws && ws.readyState === WebSocket.OPEN) {
          const message: ResetCanvasMessage = {
            type: "reset-canvas",
            roomId,
          };
          ws.send(JSON.stringify(message));
        }
      };

      handleUndoRef.current = handleUndo;
      handleRedoRef.current = handleRedo;
      handleResetCanvasRef.current = handleResetCanvas;

      ws.onmessage = async (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          if (message.type === "draw") {
            const [obj] = await fabric.util.enlivenObjects([message.payload]);
            if (obj && "type" in obj && typeof obj.type === "string") {
              const fabricObj = obj as fabric.Object;
              if (message.payload.objectID) {
                fabricObj.set("objectID", message.payload.objectID);
              }
              canvas.add(fabricObj);
              canvas.renderAll();
            } else {
              console.log("Received non-displayable object", obj);
            }
          }
          if (message.type === "erase") {
            if (message.objectID) {
              const obj = canvas.getObjects().find((obj) => {
                return obj.get("objectID") === message.objectID;
              });
              if (obj) {
                canvas.remove(obj);
                canvas.renderAll();
              } else {
                console.log("Object to be erased not found", message.objectID);
              }
            }
          }
          if (message.type === "reset-canvas") {
            canvas.clear();
            canvas.renderAll();
          }
          if (message.type === "text-update") {
            const obj = canvas.getObjects().find((obj) => {
              return obj.get("objectID") === message.objectID;
            });
            if (obj && obj.type === "textbox") {
              (obj as fabric.Textbox).set("text", message.text);
              canvas.renderAll();
            }
          }
          if (message.type === "object-modified") {
            const obj = canvas.getObjects().find((obj) => {
              return obj.get("objectID") === message.objectID;
            });
            if (obj) {
              isReceivingModificationRef.current = true;
              console.log("object modified", obj.get("type"));
              obj.set(message.properties);
              obj.setCoords();
              obj.set("selectable", true);
              canvas.renderAll();
              isReceivingModificationRef.current = false;
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

  const handleUndo = () => handleUndoRef.current?.();

  const handleRedo = () => handleRedoRef.current?.();

  const handleResetCanvas = () => handleResetCanvasRef.current?.();

  const handleToolChange = (tool: CanvasToolOptions) => {
    const canvas = ref.current;
    if (!canvas) return;
    if (tool === "select" || tool === "eraser") {
      canvas.defaultCursor = "default";
    } else {
      canvas.defaultCursor = "crosshair";
    }
  };
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        handleUndo();
      } else if (
        e.ctrlKey &&
        (e.key === "y" || (e.shiftKey && e.key === "Z"))
      ) {
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    brushColorRef.current = brushColor;
    brushWidthRef.current = brushWidth;
  }, [brushColor, brushWidth]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    selectedToolRef.current = selectedTool;
    if (selectedTool === "pencil") {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushWidth;
      }
    } else {
      canvas.isDrawingMode = false;
    }
  }, [selectedTool]);

  return (
    <div
      className="relative flex-1 flex flex-col dark:bg-gray-900 overflow-hidden"
      style={{ background: canvasBackground }}
    >
      <CanvasTools
        onResetCanvas={handleResetCanvas}
        onToolChange={handleToolChange}
      />
      <div className="flex-1" onPointerDown={() => setShowMenu(false)}>
        <Canvas ref={ref} onLoad={onLoad} />
      </div>
    </div>
  );
};
