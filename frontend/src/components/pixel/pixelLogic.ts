import type {
  NormalizedEvent,
  PixelAnimation,
  PixelCharacterId,
  PixelStationId,
  RoomMood,
  VisualState
} from "@/lib/eventTypes";
import { getStationForTool } from "./RoomMap";
import { getCharacterForTool } from "./sprites/CharacterVariants";

export function getRoomMoodForVisualState(state: VisualState): RoomMood {
  if (state === "CONTAINMENT_LOCK") return "warning";
  if (state === "TOOL_FAILED") return "glitch";
  if (state === "MEMORY_PRESSURE" || state === "MEMORY_STABILIZED") return "memory";
  if (state === "TOOL_COMPLETE" || state === "EXPERIMENT_COMPLETE") return "celebrating";
  if (state === "IDLE") return "sleepy";
  return "busy";
}

export function getCharacterForEvent(event: NormalizedEvent): PixelCharacterId {
  if (event.event_type === "PermissionRequest") return "paranoid-rick";
  if (event.event_type === "PreCompact" || event.event_type === "PostCompact") return "archivist-rick";
  if (event.event_type === "SubagentStart" || event.event_type === "SubagentStop") return "mini-rick-drone";
  if (event.event_type === "PostToolUse" && event.status === "failure") return "glitch-rick";
  if (event.event_type === "PreToolUse" || event.event_type === "PostToolUse") {
    return getCharacterForTool(event.tool_name);
  }
  return "basement-rick";
}

export function getStationForEvent(event: NormalizedEvent): PixelStationId {
  if (event.event_type === "SessionStart") return "idle-couch";
  if (event.event_type === "UserPromptSubmit") return "whiteboard";
  if (event.event_type === "PermissionRequest") return "containment-door";
  if (event.event_type === "PreCompact" || event.event_type === "PostCompact") {
    return "memory-compressor";
  }
  if (event.event_type === "SubagentStart" || event.event_type === "SubagentStop") return "drone-bay";
  if (event.event_type === "PostToolUse" && event.status === "failure") return "error-corner";
  if (event.event_type === "PreToolUse" || event.event_type === "PostToolUse") {
    return getStationForTool(event.tool_name);
  }
  return "main-terminal";
}

export function getAnimationForEvent(event: NormalizedEvent): PixelAnimation {
  if (event.event_type === "SessionStart") return "walk";
  if (event.event_type === "UserPromptSubmit") return "think";
  if (event.event_type === "PreToolUse") return "work";
  if (event.event_type === "PostToolUse") return event.status === "failure" ? "fail" : "success";
  if (event.event_type === "PermissionRequest") return "panic";
  if (event.event_type === "PreCompact") return "work";
  if (event.event_type === "PostCompact") return "success";
  if (event.event_type === "SubagentStart") return "walk";
  if (event.event_type === "SubagentStop") return "sleep";
  if (event.event_type === "Stop") return "sleep";
  return "think";
}

export function getSafeEventBubble(event: NormalizedEvent | null): string {
  if (!event) return "Waiting for Codex.";
  if (event.event_type === "SessionStart") return "Basement online.";
  if (event.event_type === "UserPromptSubmit") return "New experiment.";
  if (event.event_type === "PreToolUse") return "Tool running.";
  if (event.event_type === "PostToolUse" && event.status === "failure") return "Tool failed.";
  if (event.event_type === "PostToolUse") return "Tool complete.";
  if (event.event_type === "PermissionRequest") return "Permission needed.";
  if (event.event_type === "PreCompact") return "Memory compacting.";
  if (event.event_type === "PostCompact") return "Memory stabilized.";
  if (event.event_type === "SubagentStart") return "Drone launched.";
  if (event.event_type === "SubagentStop") return "Drone docked.";
  if (event.event_type === "Stop") return "Experiment complete.";
  return "Strange signal.";
}
