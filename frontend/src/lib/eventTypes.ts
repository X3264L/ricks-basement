export const VISUAL_STATES = [
  "IDLE",
  "BOOTING",
  "EXPERIMENT_RECEIVED",
  "THINKING",
  "TOOL_ARMING",
  "TOOL_RUNNING",
  "TOOL_COMPLETE",
  "TOOL_FAILED",
  "CONTAINMENT_LOCK",
  "MEMORY_PRESSURE",
  "MEMORY_STABILIZED",
  "DRONE_DEPLOYED",
  "DRONE_DOCKED",
  "EXPERIMENT_COMPLETE",
  "SIGNAL_RECEIVED"
] as const;

export type VisualState = (typeof VISUAL_STATES)[number];

export type NormalizedEvent = {
  id?: number;
  event_type: string;
  visual_state: VisualState;
  session_id: string;
  turn_id?: string | null;
  tool_name?: string | null;
  status: string;
  timestamp: string;
  duration_ms?: number | null;
  safe_summary: string;
  metadata: Record<string, unknown>;
  created_at?: string;
};

export type ConnectionStatus = "offline" | "connecting" | "online";

export type PixelCharacterId =
  | "basement-rick"
  | "coder-rick"
  | "terminal-rick"
  | "tester-rick"
  | "archivist-rick"
  | "paranoid-rick"
  | "glitch-rick"
  | "mini-rick-drone";

export type PixelStationId =
  | "idle-couch"
  | "main-terminal"
  | "shell-terminal"
  | "patch-desk"
  | "test-rig"
  | "memory-compressor"
  | "containment-door"
  | "drone-bay"
  | "whiteboard"
  | "error-corner";

export type PixelAnimation =
  | "idle"
  | "walk"
  | "work"
  | "panic"
  | "success"
  | "fail"
  | "think"
  | "sleep";

export type RoomMood = "sleepy" | "busy" | "celebrating" | "warning" | "memory" | "glitch";

export type CharacterActivity = {
  characterId: PixelCharacterId;
  stationId: PixelStationId;
  animation: PixelAnimation;
  eventType: string;
};

export type ToolActivity = {
  toolName: string;
  characterId: PixelCharacterId;
  stationId: PixelStationId;
  status: string;
};

export type BasementState = {
  connectionStatus: ConnectionStatus;
  currentSession: string | null;
  recentEvents: NormalizedEvent[];
  activeTools: Record<string, NormalizedEvent>;
  activeDrones: Record<string, NormalizedEvent>;
  currentVisualState: VisualState;
  containmentRequests: NormalizedEvent[];
  memoryPressure: number;
  selectedEvent: NormalizedEvent | null;
  replayMode: boolean;
  activeCharacters: Partial<Record<PixelCharacterId, CharacterActivity>>;
  activeStation: PixelStationId | null;
  latestEvent: NormalizedEvent | null;
  containmentActive: boolean;
  memoryCompressionActive: boolean;
  toolActivity: Record<string, ToolActivity>;
  roomMood: RoomMood;
};
