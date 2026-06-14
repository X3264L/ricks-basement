import { create } from "zustand";
import {
  getAnimationForEvent,
  getCharacterForEvent,
  getRoomMoodForVisualState,
  getStationForEvent
} from "@/components/pixel/pixelLogic";
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
  replayMode: false,
  activeCharacters: {},
  activeStation: null,
  latestEvent: null,
  containmentActive: false,
  memoryCompressionActive: false,
  toolActivity: {},
  roomMood: "sleepy"
};

export function reduceBasementEvent(
  state: BasementState,
  event: NormalizedEvent
): BasementState {
  const toolKey = event.tool_name ?? event.safe_summary;
  const recentEvents = [...state.recentEvents, event].slice(-100);
  const activeTools = { ...state.activeTools };
  const activeDrones = { ...state.activeDrones };
  const activeCharacters = { ...state.activeCharacters };
  const toolActivity = { ...state.toolActivity };
  const characterId = getCharacterForEvent(event);
  const stationId = getStationForEvent(event);
  const animation = getAnimationForEvent(event);
  let containmentRequests = state.containmentRequests;
  let containmentActive = state.containmentActive;
  let memoryPressure = state.memoryPressure;
  let memoryCompressionActive = state.memoryCompressionActive;

  if (event.event_type === "PreToolUse") {
    activeTools[toolKey] = event;
    toolActivity[toolKey] = {
      toolName: event.tool_name ?? "unknown-tool",
      characterId,
      stationId,
      status: event.status
    };
  }

  if (event.event_type === "PostToolUse") {
    delete activeTools[toolKey];
    toolActivity[toolKey] = {
      toolName: event.tool_name ?? "unknown-tool",
      characterId,
      stationId,
      status: event.status
    };
  }

  if (event.event_type === "PermissionRequest") {
    containmentRequests = [event, ...state.containmentRequests].slice(0, 3);
    containmentActive = true;
  }

  if (event.event_type === "PreCompact") {
    memoryPressure = 1;
    memoryCompressionActive = true;
  }

  if (event.event_type === "PostCompact") {
    memoryPressure = 0.22;
    memoryCompressionActive = false;
  }

  if (event.event_type === "SubagentStart") {
    activeDrones[toolKey] = event;
  }

  if (event.event_type === "SubagentStop") {
    delete activeDrones[toolKey];
  }

  if (event.event_type === "Stop") {
    containmentActive = false;
    memoryCompressionActive = false;
  }

  activeCharacters[characterId] = {
    characterId,
    stationId,
    animation,
    eventType: event.event_type
  };

  return {
    ...state,
    currentSession: event.session_id,
    recentEvents,
    activeTools,
    activeDrones,
    activeCharacters,
    currentVisualState: event.visual_state,
    containmentRequests,
    memoryPressure,
    activeStation: stationId,
    latestEvent: event,
    containmentActive,
    memoryCompressionActive,
    toolActivity,
    roomMood: getRoomMoodForVisualState(event.visual_state)
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
