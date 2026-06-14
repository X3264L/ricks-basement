import type { PixelStationId } from "@/lib/eventTypes";

export type PixelPoint = {
  x: number;
  y: number;
};

export type RoomStation = PixelPoint & {
  id: PixelStationId;
  label: string;
};

export const ROOM_WIDTH = 960;
export const ROOM_HEIGHT = 540;

export const ROOM_STATIONS: Record<PixelStationId, RoomStation> = {
  "idle-couch": { id: "idle-couch", label: "Idle couch", x: 170, y: 390 },
  "main-terminal": { id: "main-terminal", label: "Main computer", x: 480, y: 265 },
  "shell-terminal": { id: "shell-terminal", label: "Shell terminal", x: 760, y: 310 },
  "patch-desk": { id: "patch-desk", label: "Patch desk", x: 690, y: 405 },
  "test-rig": { id: "test-rig", label: "Test rig", x: 820, y: 405 },
  "memory-compressor": { id: "memory-compressor", label: "Memory compressor", x: 210, y: 260 },
  "containment-door": { id: "containment-door", label: "Containment door", x: 84, y: 330 },
  "drone-bay": { id: "drone-bay", label: "Drone bay", x: 875, y: 180 },
  whiteboard: { id: "whiteboard", label: "Mission board", x: 255, y: 165 },
  "error-corner": { id: "error-corner", label: "Error corner", x: 84, y: 430 }
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
    return "patch-desk";
  }
  if (
    normalized.includes("test") ||
    normalized.includes("pytest") ||
    normalized.includes("vitest") ||
    normalized.includes("lint")
  ) {
    return "test-rig";
  }
  return "main-terminal";
}
