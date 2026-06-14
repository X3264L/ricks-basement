import { compactId } from "@/lib/format";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { EventBubble } from "./EventBubble";
import { PixelEventLog } from "./PixelEventLog";
import type { BasementState } from "@/lib/eventTypes";

type PixelHudProps = Pick<
  BasementState,
  | "connectionStatus"
  | "currentSession"
  | "currentVisualState"
  | "latestEvent"
  | "recentEvents"
  | "containmentActive"
  | "memoryCompressionActive"
  | "roomMood"
>;

export function PixelHud({
  connectionStatus,
  currentSession,
  currentVisualState,
  latestEvent,
  recentEvents,
  containmentActive,
  memoryCompressionActive,
  roomMood
}: PixelHudProps) {
  const privacyMode = useSettingsStore((state) => state.privacyMode);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3">
      <header className="pixel-top-hud pointer-events-auto">
        <div>
          <h1>Rick&apos;s Basement</h1>
          <p>8-bit local Codex visualizer</p>
        </div>
        <div className="pixel-hud-chips">
          <span data-status={connectionStatus}>{connectionStatus}</span>
          <span>session {compactId(currentSession)}</span>
          <span>{privacyMode}</span>
          <span>{currentVisualState}</span>
          <span>{roomMood}</span>
        </div>
      </header>

      <EventBubble event={latestEvent} containmentActive={containmentActive} />

      <div className="pixel-side-hud pointer-events-auto">
        <PixelEventLog events={recentEvents} />
      </div>

      <footer className="pixel-bottom-hud pointer-events-auto">
        <div className="pixel-hud-label">ticker</div>
        <div className="pixel-ticker">
          {recentEvents.slice(-6).map((event, index) => (
            <span key={`${event.id ?? index}-${event.timestamp}`}>
              {event.event_type}:{event.status}
            </span>
          ))}
          {recentEvents.length === 0 ? <span>Basement idle. Start backend and simulate events.</span> : null}
        </div>
        {memoryCompressionActive ? <strong>memory compressor active</strong> : null}
      </footer>
    </div>
  );
}
