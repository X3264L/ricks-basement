import { describe, expect, it } from "vitest";
import type { NormalizedEvent } from "@/lib/eventTypes";
import { initialBasementState, reduceBasementEvent } from "@/stores/useBasementStore";

function event(overrides: Partial<NormalizedEvent>): NormalizedEvent {
  return {
    event_type: "Unknown",
    visual_state: "SIGNAL_RECEIVED",
    session_id: "s1",
    status: "received",
    timestamp: new Date(0).toISOString(),
    safe_summary: "Unknown:received",
    metadata: {},
    ...overrides
  };
}

describe("pixel basement event reducer", () => {
  it("maps permission requests to containment state", () => {
    const next = reduceBasementEvent(
      initialBasementState,
      event({ event_type: "PermissionRequest", visual_state: "CONTAINMENT_LOCK" })
    );
    expect(next.containmentActive).toBe(true);
    expect(next.activeStation).toBe("containment-door");
    expect(next.activeCharacters["paranoid-rick"]?.animation).toBe("panic");
    expect(next.roomMood).toBe("warning");
  });

  it("activates and deactivates memory compression", () => {
    const pressure = reduceBasementEvent(
      initialBasementState,
      event({ event_type: "PreCompact", visual_state: "MEMORY_PRESSURE" })
    );
    expect(pressure.memoryCompressionActive).toBe(true);
    expect(pressure.activeStation).toBe("memory-compressor");
    expect(pressure.activeCharacters["archivist-rick"]?.animation).toBe("work");

    const stable = reduceBasementEvent(
      pressure,
      event({ event_type: "PostCompact", visual_state: "MEMORY_STABILIZED" })
    );
    expect(stable.memoryCompressionActive).toBe(false);
    expect(stable.memoryPressure).toBeLessThan(0.5);
  });

  it("selects terminal character and station for shell tools", () => {
    const next = reduceBasementEvent(
      initialBasementState,
      event({
        event_type: "PreToolUse",
        tool_name: "shell_command",
        visual_state: "TOOL_ARMING",
        status: "running"
      })
    );
    expect(next.activeStation).toBe("shell-terminal");
    expect(next.toolActivity.shell_command?.characterId).toBe("terminal-rick");
    expect(next.activeCharacters["terminal-rick"]?.animation).toBe("work");
  });

  it("selects coder character and patch desk for apply patch tools", () => {
    const next = reduceBasementEvent(
      initialBasementState,
      event({
        event_type: "PreToolUse",
        tool_name: "apply_patch",
        visual_state: "TOOL_ARMING",
        status: "running"
      })
    );
    expect(next.activeStation).toBe("patch-bench");
    expect(next.toolActivity.apply_patch?.characterId).toBe("patch-rick");
  });

  it("routes tool failures to Glitch Rick and error state", () => {
    const next = reduceBasementEvent(
      initialBasementState,
      event({
        event_type: "PostToolUse",
        tool_name: "shell_command",
        visual_state: "TOOL_FAILED",
        status: "failure"
      })
    );
    expect(next.activeStation).toBe("error-zone");
    expect(next.activeCharacters["glitch-rick"]?.animation).toBe("fail");
    expect(next.roomMood).toBe("glitch");
  });

  it("launches and docks the mini drone for subagents", () => {
    const launched = reduceBasementEvent(
      initialBasementState,
      event({
        event_type: "SubagentStart",
        tool_name: "frontend-probe",
        visual_state: "DRONE_DEPLOYED",
        status: "running"
      })
    );
    expect(launched.activeDrones["frontend-probe"]).toBeDefined();
    expect(launched.activeCharacters["mini-rick-drone"]?.stationId).toBe("drone-bay");

    const docked = reduceBasementEvent(
      launched,
      event({
        event_type: "SubagentStop",
        tool_name: "frontend-probe",
        visual_state: "DRONE_DOCKED",
        status: "docked"
      })
    );
    expect(docked.activeDrones["frontend-probe"]).toBeUndefined();
    expect(docked.activeCharacters["mini-rick-drone"]?.animation).toBe("sleep");
  });
});
