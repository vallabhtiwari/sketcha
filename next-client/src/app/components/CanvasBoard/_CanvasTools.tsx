import {
  useSketchStore,
  canvasShapeOptions,
  canvasBackgroundOptions,
} from "@/store/sketchStore";

export const CanvasTools = () => {
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
    </>
  );
};
