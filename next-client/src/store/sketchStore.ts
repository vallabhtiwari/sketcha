import { create } from "zustand";
import { CanvasToolOptions } from "@/types";

export const canvasBackgroundOptions = [
  "#f8f8f8",
  "#444444",
  "#586071",
  "#6a5c5c",
  "#6a3c3c",
];

interface SketchState {
  showMenu: boolean;
  brushColor: string;
  brushWidth: number;
  canvasBackground: string;
  selectedTool: CanvasToolOptions;
  setBrushColor: (color: string) => void;
  setBrushWidth: (width: number) => void;
  setCanvasBackground: (color: string) => void;
  setSelectedTool: (tool: CanvasToolOptions) => void;
  setShowMenu: (show: boolean) => void;
}

export const useSketchStore = create<SketchState>((set) => ({
  showMenu: false,
  brushColor: "#000000",
  brushWidth: 3,
  canvasBackground: canvasBackgroundOptions[0],
  selectedTool: "pencil",
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushWidth: (width) => set({ brushWidth: width }),
  setCanvasBackground: (color) => set({ canvasBackground: color }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setShowMenu: (show) => set({ showMenu: show }),
}));
