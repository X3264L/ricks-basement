import { describe, expect, it } from "vitest";
import { initialBasementState, reduceBasementEvent } from "@/stores/useBasementStore";
import type { NormalizedEvent } from "@/lib/eventTypes";

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

describe("basement event reducer", () => {
  it("updates current visual state", () => {
    const next = reduceBasementEvent(initialBasementState, event({ visual_state: "BOOTING" }));
    expect(next.currentVisualState).toBe("BOOTING");
  });

  it("creates containment lock state on permission request", () => {
    const next = reduceBasementEvent(
      initialBasementState,
      event({ event_type: "PermissionRequest", visual_state: "CONTAINMENT_LOCK" })
    );
    expect(next.containmentRequests).toHaveLength(1);
  });

  it("updates memory pressure on compaction events", () => {
    const pressure = reduceBasementEvent(
      initialBasementState,
      event({ event_type: "PreCompact", visual_state: "MEMORY_PRESSURE" })
    );
    expect(pressure.memoryPressure).toBe(1);
    const stable = reduceBasementEvent(
      pressure,
      event({ event_type: "PostCompact", visual_state: "MEMORY_STABILIZED" })
    );
    expect(stable.memoryPressure).toBeLessThan(0.5);
  });

  it("tracks tool success and failure completion", () => {
    const running = reduceBasementEvent(
      initialBasementState,
      event({ event_type: "PreToolUse", tool_name: "shell", visual_state: "TOOL_ARMING" })
    );
    expect(running.activeTools.shell).toBeDefined();
    const success = reduceBasementEvent(
      running,
      event({
        event_type: "PostToolUse",
        tool_name: "shell",
        visual_state: "TOOL_COMPLETE",
        status: "success"
      })
    );
    expect(success.activeTools.shell).toBeUndefined();
    expect(success.currentVisualState).toBe("TOOL_COMPLETE");
    const failed = reduceBasementEvent(
      success,
      event({ event_type: "PostToolUse", tool_name: "shell", visual_state: "TOOL_FAILED", status: "failure" })
    );
    expect(failed.currentVisualState).toBe("TOOL_FAILED");
  });
});
