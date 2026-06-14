import { create } from "zustand";
import type { BasementState, NormalizedEvent } from "@/lib/eventTypes";

export const initialBasementState: BasementState = {
  connectionStatus: "connecting",
  currentSession: null,
  recentEvents: [],
  activeTools: {},
  activeDrones: {},
  currentVisualState: "IDLE",
  containmentRequests: [],
  memoryPressure: 0,
  selectedEvent: null,
  replayMode: false
};

export function reduceBasementEvent(
  state: BasementState,
  event: NormalizedEvent
): BasementState {
  const toolKey = event.tool_name ?? event.safe_summary;
  const recentEvents = [...state.recentEvents, event].slice(-100);
  const activeTools = { ...state.activeTools };
  const activeDrones = { ...state.activeDrones };
  let containmentRequests = state.containmentRequests;
  let memoryPressure = state.memoryPressure;

  if (event.event_type === "PreToolUse") {
    activeTools[toolKey] = event;
  }

  if (event.event_type === "PostToolUse") {
    delete activeTools[toolKey];
  }

  if (event.event_type === "PermissionRequest") {
    containmentRequests = [event, ...state.containmentRequests].slice(0, 3);
  }

  if (event.event_type === "PreCompact") {
    memoryPressure = 1;
  }

  if (event.event_type === "PostCompact") {
    memoryPressure = 0.22;
  }

  if (event.event_type === "SubagentStart") {
    activeDrones[toolKey] = event;
  }

  if (event.event_type === "SubagentStop") {
    delete activeDrones[toolKey];
  }

  return {
    ...state,
    currentSession: event.session_id,
    recentEvents,
    activeTools,
    activeDrones,
    currentVisualState: event.visual_state,
    containmentRequests,
    memoryPressure
  };
}

type BasementActions = {
  setConnectionStatus: (connectionStatus: BasementState["connectionStatus"]) => void;
  setEvents: (events: NormalizedEvent[]) => void;
  ingestEvent: (event: NormalizedEvent) => void;
  selectEvent: (event: NormalizedEvent | null) => void;
};

export const useBasementStore = create<BasementState & BasementActions>((set) => ({
  ...initialBasementState,
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setEvents: (events) => {
    const nextState = events.reduce<BasementState>(
      (nextState, event) => reduceBasementEvent(nextState, event),
      { ...initialBasementState, connectionStatus: "online" }
    );
    set(nextState);
  },
  ingestEvent: (event) => set((state) => reduceBasementEvent(state, event)),
  selectEvent: (event) => set({ selectedEvent: event })
}));
