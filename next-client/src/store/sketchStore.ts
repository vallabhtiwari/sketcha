import { create } from "zustand";
import { CanvasToolOptions } from "@/types";

export const canvasBackgroundOptions = [
  "#FFFBF8",
  "#FFF0E6",
  "#E8864A",
  "#2A1D15",
  "#261410",
];

export const fontSizeOptions = {
  Small: 16,
  Medium: 24,
  Large: 32,
};

export const fontWeightOptions = {
  Normal: 500,
  Bold: 700,
};

export const fontFamilyOptions = {
  Sans: "sans-serif",
  Serif: "serif",
  Mono: "monospace",
};

interface SketchState {
  showMenu: boolean;
  brushColor: string;
  brushWidth: number;
  canvasBackground: string;
  selectedTool: CanvasToolOptions;
  isToolLocked: boolean;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  setBrushColor: (color: string) => void;
  setBrushWidth: (width: number) => void;
  setCanvasBackground: (color: string) => void;
  setSelectedTool: (tool: CanvasToolOptions) => void;
  setShowMenu: (show: boolean) => void;
  setIsToolLocked: (locked: boolean) => void;
  setFontSize: (size: number) => void;
  setFontWeight: (weight: number) => void;
  setFontFamily: (family: string) => void;
}

export const useSketchStore = create<SketchState>((set) => ({
  showMenu: false,
  brushColor: "#000000",
  brushWidth: 3,
  canvasBackground: canvasBackgroundOptions[0],
  selectedTool: "pencil",
  isToolLocked: false,
  fontSize: fontSizeOptions.Medium,
  fontWeight: fontWeightOptions.Normal,
  fontFamily: fontFamilyOptions.Sans,
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushWidth: (width) => set({ brushWidth: width }),
  setCanvasBackground: (color) => set({ canvasBackground: color }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setShowMenu: (show) => set({ showMenu: show }),
  setIsToolLocked: (locked) => set({ isToolLocked: locked }),
  setFontSize: (size) => set({ fontSize: size }),
  setFontWeight: (weight) => set({ fontWeight: weight }),
  setFontFamily: (family) => set({ fontFamily: family }),
}));
