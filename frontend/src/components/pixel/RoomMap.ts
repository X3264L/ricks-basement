import type { PixelStationId } from "@/lib/eventTypes";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./pixelConstants";

export type PixelPoint = {
  x: number;
  y: number;
};

export type RoomStation = PixelPoint & {
  id: PixelStationId;
  label: string;
  facing?: "left" | "right";
};

export const ROOM_WIDTH = WORLD_WIDTH;
export const ROOM_HEIGHT = WORLD_HEIGHT;

export const ROOM_STATIONS: Record<PixelStationId, RoomStation> = {
  "idle-couch": { id: "idle-couch", label: "Idle couch", x: 70, y: 215, facing: "right" },
  "main-computer": { id: "main-computer", label: "Main computer", x: 236, y: 150, facing: "right" },
  "shell-terminal": { id: "shell-terminal", label: "Shell terminal", x: 375, y: 172, facing: "left" },
  "patch-bench": { id: "patch-bench", label: "Patch bench", x: 312, y: 218, facing: "left" },
  "test-rig": { id: "test-rig", label: "Test rig", x: 414, y: 220, facing: "left" },
  "memory-compressor": { id: "memory-compressor", label: "Memory compressor", x: 108, y: 158, facing: "right" },
  "containment-door": { id: "containment-door", label: "Containment door", x: 38, y: 188, facing: "right" },
  "drone-bay": { id: "drone-bay", label: "Drone bay", x: 426, y: 96, facing: "left" },
  whiteboard: { id: "whiteboard", label: "Mission board", x: 136, y: 104, facing: "right" },
  "error-zone": { id: "error-zone", label: "Error zone", x: 52, y: 232, facing: "right" },
  "strange-machine": { id: "strange-machine", label: "Strange machine", x: 236, y: 214, facing: "right" },
  "shelf-area": { id: "shelf-area", label: "Shelf area", x: 64, y: 116, facing: "right" }
};

export function getStationPoint(stationId: PixelStationId): PixelPoint {
  return ROOM_STATIONS[stationId];
}

export function getStationForTool(toolName?: string | null): PixelStationId {
  const normalized = (toolName ?? "").toLowerCase();
  if (normalized.includes("shell") || normalized.includes("terminal") || normalized.includes("bash")) {
    return "shell-terminal";
  }
  if (
    normalized.includes("patch") ||
    normalized.includes("edit") ||
    normalized.includes("apply") ||
    normalized.includes("file")
  ) {
    return "patch-bench";
  }
  if (
    normalized.includes("test") ||
    normalized.includes("pytest") ||
    normalized.includes("vitest") ||
    normalized.includes("lint") ||
    normalized.includes("typecheck")
  ) {
    return "test-rig";
  }
  return "main-computer";
}
