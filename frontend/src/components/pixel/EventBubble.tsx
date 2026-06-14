import { getSafeEventBubble } from "./pixelLogic";
import type { NormalizedEvent } from "@/lib/eventTypes";

type EventBubbleProps = {
  event: NormalizedEvent | null;
  containmentActive: boolean;
};

export function EventBubble({ event, containmentActive }: EventBubbleProps) {
  return (
    <div className={`pixel-bubble ${containmentActive ? "pixel-bubble-warning" : ""}`}>
      <span>{getSafeEventBubble(event)}</span>
      {containmentActive ? (
        <small>Visual only. Use Codex approval controls.</small>
      ) : null}
    </div>
  );
}
