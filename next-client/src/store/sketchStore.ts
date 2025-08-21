import { create } from "zustand";
import { CanvasToolOptions } from "@/types";

export const canvasBackgroundOptions = [
  "#FFFBF8",
  "#FFF0E6",
  "#FFB366",
  "#E8864A",
  "#2A1D15",
];

interface SketchState {
  showMenu: boolean;
  brushColor: string;
  brushWidth: number;
  canvasBackground: string;
  selectedTool: CanvasToolOptions;
  isToolLocked: boolean;
  setBrushColor: (color: string) => void;
  setBrushWidth: (width: number) => void;
  setCanvasBackground: (color: string) => void;
  setSelectedTool: (tool: CanvasToolOptions) => void;
  setShowMenu: (show: boolean) => void;
  setIsToolLocked: (locked: boolean) => void;
}

export const useSketchStore = create<SketchState>((set) => ({
  showMenu: false,
  brushColor: "#000000",
  brushWidth: 3,
  canvasBackground: canvasBackgroundOptions[0],
  selectedTool: "pencil",
  isToolLocked: false,
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushWidth: (width) => set({ brushWidth: width }),
  setCanvasBackground: (color) => set({ canvasBackground: color }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setShowMenu: (show) => set({ showMenu: show }),
  setIsToolLocked: (locked) => set({ isToolLocked: locked }),
}));
