import { useCallback, useRef } from "react";
import * as fabric from "fabric";
import { Canvas } from "./_Canvas";
import type { CanvasBoardProps, DrawMessage } from "../../types";

export const CanvasBoard = ({ ws, roomId }: CanvasBoardProps) => {
  const ref = useRef<fabric.Canvas>(null);

  const onLoad = useCallback(
    (canvas: fabric.Canvas) => {
      canvas.setDimensions({
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
      });
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      const brush = canvas.freeDrawingBrush;
      if (brush) {
        brush.width = 3;
        brush.color = "#000000";
      }
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
    },
    [ref]
  );

  return (
    <div className="position-relative">
      <Canvas ref={ref} onLoad={onLoad} />
    </div>
  );
};
