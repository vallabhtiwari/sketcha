import { useSketchStore, canvasBackgroundOptions } from "@/store/sketchStore";
import { CanvasToolOptions } from "@/types";
import {
  Menu,
  Pencil,
  Eraser,
  Circle,
  TextCursor,
  Square,
  MousePointer,
  Minus,
  Trash,
} from "lucide-react";
import { useState } from "react";

export const CanvasTools = ({
  onResetCanvas,
  onToolChange,
}: {
  onResetCanvas: () => void;
  onToolChange: (tool: CanvasToolOptions) => void;
}) => {
  const [selected, setSelected] = useState("pencil");
  const showMenu = useSketchStore((state) => state.showMenu);
  const setShowMenu = useSketchStore((state) => state.setShowMenu);
  const setSelectedTool = useSketchStore((state) => state.setSelectedTool);
  const brushColor = useSketchStore((state) => state.brushColor);
  const setBrushColor = useSketchStore((state) => state.setBrushColor);
  const brushWidth = useSketchStore((state) => state.brushWidth);
  const setBrushWidth = useSketchStore((state) => state.setBrushWidth);
  const setCanvasBackground = useSketchStore(
    (state) => state.setCanvasBackground
  );

  return (
    <>
      <div className="absolute m-2 z-1 flex justify-start">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-xl px-3 py-2 font-bold cursor-pointer bg-[rgb(255,251,248)] dark:bg-[rgb(26,20,16)] rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Menu />
        </button>
      </div>
      {showMenu && (
        <div className="absolute top-15 left-2 p-4 shadow-md z-50 rounded-md border border-primary bg-[rgb(255,251,248)] dark:bg-[rgb(26,20,16)]">
          <div className="space-y-2">
            <div>
              <span className="font-medium text-muted-foreground text-xl">
                Tool
              </span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {CanvasToolOptions.map((tool) => (
                  <div
                    key={tool}
                    className={`group w-10 h-8 p-2 border border-primary rounded-sm text-center cursor-pointer flex items-center justify-center ${
                      selected === tool
                        ? "bg-primary text-primary-foreground"
                        : "text-primary"
                    }`}
                    onClick={() => {
                      onToolChange(tool);
                      setSelected(tool);
                      setSelectedTool(tool);
                    }}
                  >
                    {tool === "pencil" ? (
                      <Pencil />
                    ) : tool === "eraser" ? (
                      <Eraser />
                    ) : tool === "circle" ? (
                      <Circle />
                    ) : tool === "text" ? (
                      <TextCursor />
                    ) : tool === "rect" ? (
                      <Square />
                    ) : tool === "select" ? (
                      <MousePointer />
                    ) : tool === "line" ? (
                      <Minus />
                    ) : null}
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                   whitespace-nowrap bg-gray-800 text-white text-xs
                   rounded px-2 py-1 opacity-0 group-hover:opacity-100
                   transition pointer-events-none z-10"
                    >
                      {tool.charAt(0).toUpperCase() + tool.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <label className="font-medium text-muted-foreground text-xl">
                Color
              </label>
              <div className="relative ml-2 mt-2">
                <div
                  className="w-6 h-4 border border-primary cursor-pointer rounded-sm"
                  style={{ backgroundColor: brushColor }}
                  onClick={() =>
                    document.getElementById("color-picker")?.click()
                  }
                />
                <input
                  id="color-picker"
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-medium text-muted-foreground text-xl mb-2">
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
              <span className="font-medium text-muted-foreground text-xl">
                Canvas background
              </span>
              <div className="flex justify-between mt-2">
                {canvasBackgroundOptions.map((item) => (
                  <div
                    key={item}
                    className="w-8 h-6 rounded-sm cursor-pointer border border-border"
                    style={{ backgroundColor: item }}
                    title={item}
                    onClick={() => setCanvasBackground(item)}
                  ></div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={onResetCanvas}
                className="px-3 py-2 font-bold cursor-pointer rounded-md border border-primary flex items-center gap-2 text-muted-foreground"
              >
                <Trash className="w-5 h-5" /> <span>Reset Canvas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
