import { useTheme } from "@/providers/ThemeProvider";
import {
  useSketchStore,
  canvasBackgroundOptions,
  fontSizeOptions,
  fontWeightOptions,
  fontFamilyOptions,
} from "@/store/sketchStore";
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
  LockKeyhole,
  CaseLower,
  Hand,
  LockKeyholeOpen,
} from "lucide-react";
import { useEffect } from "react";

export const CanvasTools = ({
  onResetCanvas,
  onToolChange,
}: {
  onResetCanvas: () => void;
  onToolChange: (tool: CanvasToolOptions) => void;
}) => {
  const showMenu = useSketchStore((state) => state.showMenu);
  const setShowMenu = useSketchStore((state) => state.setShowMenu);
  const selectedTool = useSketchStore((state) => state.selectedTool);
  const setSelectedTool = useSketchStore((state) => state.setSelectedTool);
  const isToolLocked = useSketchStore((state) => state.isToolLocked);
  const setIsToolLocked = useSketchStore((state) => state.setIsToolLocked);
  const brushColor = useSketchStore((state) => state.brushColor);
  const setBrushColor = useSketchStore((state) => state.setBrushColor);
  const brushWidth = useSketchStore((state) => state.brushWidth);
  const setBrushWidth = useSketchStore((state) => state.setBrushWidth);
  const setCanvasBackground = useSketchStore(
    (state) => state.setCanvasBackground
  );
  const fontSize = useSketchStore((state) => state.fontSize);
  const setFontSize = useSketchStore((state) => state.setFontSize);
  const fontWeight = useSketchStore((state) => state.fontWeight);
  const setFontWeight = useSketchStore((state) => state.setFontWeight);
  const fontFamily = useSketchStore((state) => state.fontFamily);
  const setFontFamily = useSketchStore((state) => state.setFontFamily);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      setCanvasBackground(
        canvasBackgroundOptions[canvasBackgroundOptions.length - 1]
      );
    } else {
      setCanvasBackground(canvasBackgroundOptions[0]);
    }
  }, [theme]);

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
        <div className="absolute w-60 top-15 left-2 p-4 shadow-md z-50 rounded-md border border-primary bg-[rgb(255,251,248)] dark:bg-[rgb(26,20,16)]">
          <div className="space-y-2">
            <div>
              <span className="font-medium text-muted-foreground text-xl">
                Tool
              </span>
              <div
                className="mt-2 w-full gap-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridTemplateRows: "repeat(3, 1fr)",
                  gridTemplateAreas: `
                    "tool1 tool2 tool3"
                    "tool4 tool5 tool6" 
                    "tool7 tool8 lock"
                  `,
                }}
              >
                {CanvasToolOptions.map((tool, index) => (
                  <div
                    key={tool}
                    className={`group aspect-square border border-primary rounded-sm cursor-pointer flex items-center justify-center ${
                      selectedTool === tool
                        ? "bg-primary text-primary-foreground"
                        : "text-primary"
                    }`}
                    style={{ gridArea: `tool${index + 1}` }}
                    onClick={() => {
                      if (tool === "select" || tool === "pan") {
                        setIsToolLocked(false);
                      }
                      onToolChange(tool);
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
                    ) : tool === "pan" ? (
                      <Hand />
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

                <div
                  className={`group border rounded-sm ${
                    selectedTool !== "pan" && selectedTool !== "select"
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  } flex items-center justify-center gap-2 px-3 ${
                    selectedTool === "pan" || selectedTool === "select"
                      ? "bg-muted text-muted-foreground border-muted-foreground"
                      : isToolLocked
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-primary border-primary"
                  }`}
                  style={{
                    gridArea: "lock",
                  }}
                  onClick={() => {
                    if (selectedTool === "pan" || selectedTool === "select") {
                      return;
                    }
                    setIsToolLocked(!isToolLocked);
                  }}
                >
                  {isToolLocked ? (
                    <LockKeyholeOpen
                      className={
                        selectedTool === "pan" || selectedTool === "select"
                          ? "text-muted-foreground"
                          : "inherit"
                      }
                    />
                  ) : (
                    <LockKeyhole
                      className={
                        selectedTool === "pan" || selectedTool === "select"
                          ? "text-muted-foreground"
                          : "inherit"
                      }
                    />
                  )}

                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                 whitespace-nowrap bg-gray-800 text-white text-xs
                 rounded px-2 py-1 opacity-0 group-hover:opacity-100
                 transition pointer-events-none z-10"
                  >
                    {isToolLocked
                      ? "Unlock tool selection"
                      : "Lock current tool selection"}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-baseline">
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

            {selectedTool != "text" ? (
              <div className="flex items-baseline gap-2">
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
            ) : (
              <>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-muted-foreground text-xl">
                    Font Size
                  </span>
                </div>
                <div className="flex justify-evenly items-baseline">
                  {Object.keys(fontSizeOptions).map((size) => (
                    <div
                      key={size}
                      className={`p-4 w-10 h-10 rounded-sm cursor-pointer border border-border flex items-center justify-center ${
                        fontSize ===
                        fontSizeOptions[size as keyof typeof fontSizeOptions]
                          ? "bg-primary text-primary-foreground"
                          : "text-primary"
                      }`}
                      onClick={() =>
                        setFontSize(
                          fontSizeOptions[size as keyof typeof fontSizeOptions]
                        )
                      }
                      title={size}
                    >
                      <span>{size.charAt(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-muted-foreground text-xl">
                    Font Weight
                  </span>
                </div>
                <div className="flex justify-evenly items-baseline">
                  {Object.keys(fontWeightOptions).map((weight) => (
                    <div
                      key={weight}
                      className={`w-10 h-10 rounded-sm cursor-pointer border border-border flex items-center justify-center ${
                        fontWeight ===
                        fontWeightOptions[
                          weight as keyof typeof fontWeightOptions
                        ]
                          ? "bg-primary text-primary-foreground"
                          : "text-primary"
                      }`}
                      onClick={() =>
                        setFontWeight(
                          fontWeightOptions[
                            weight as keyof typeof fontWeightOptions
                          ]
                        )
                      }
                      title={weight}
                    >
                      <CaseLower
                        className="w-6 h-6"
                        style={{
                          strokeWidth:
                            fontWeightOptions[
                              weight as keyof typeof fontWeightOptions
                            ] / 200,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-muted-foreground text-xl">
                    Font Family
                  </span>
                </div>
                <div className="flex justify-evenly items-baseline">
                  {Object.keys(fontFamilyOptions).map((family) => (
                    <div
                      key={family}
                      className={`w-10 h-10 rounded-sm cursor-pointer border border-border flex items-center justify-center ${
                        fontFamily ===
                        fontFamilyOptions[
                          family as keyof typeof fontFamilyOptions
                        ]
                          ? "bg-primary text-primary-foreground"
                          : "text-primary"
                      }`}
                      onClick={() =>
                        setFontFamily(
                          fontFamilyOptions[
                            family as keyof typeof fontFamilyOptions
                          ]
                        )
                      }
                      title={family}
                    >
                      <span className={`text-sm font-${family}`}>Aa</span>
                    </div>
                  ))}
                </div>
              </>
            )}
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
                className="px-3 py-2 font-bold cursor-pointer rounded-md border border-primary flex items-center gap-2 text-primary-foreground"
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
