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
};
