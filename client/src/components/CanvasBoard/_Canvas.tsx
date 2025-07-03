import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

const DEV_MODE = true;

declare global {
  var canvas: fabric.Canvas | undefined;
}

export const Canvas = React.forwardRef<
  fabric.Canvas,
  { onLoad?(canvas: fabric.Canvas): void }
>(({ onLoad }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current);

    DEV_MODE && (window.canvas = canvas);

    if (typeof ref === "function") {
      ref(canvas);
    } else if (typeof ref === "object" && ref) {
      ref.current = canvas;
    }

    onLoad?.(canvas);

    return () => {
      DEV_MODE && delete window.canvas;

      if (typeof ref === "function") {
        ref(null);
      } else if (typeof ref === "object" && ref) {
        ref.current = null;
      }

      canvas.dispose();
    };
  }, [canvasRef, onLoad]);

  return <canvas ref={canvasRef} />;
});
