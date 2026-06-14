import type { NormalizedEvent } from "@/lib/eventTypes";
import { formatTime } from "@/lib/format";

type PixelEventLogProps = {
  events: NormalizedEvent[];
};

export function PixelEventLog({ events }: PixelEventLogProps) {
  const latest = events.slice(-8).reverse();
  return (
    <aside className="pixel-log">
      <div className="pixel-hud-label">event monitor</div>
      {latest.length === 0 ? (
        <p className="pixel-muted">waiting for local hooks</p>
      ) : (
        <ol>
          {latest.map((event, index) => (
            <li key={`${event.id ?? index}-${event.timestamp}`}>
              <span>{formatTime(event.timestamp)}</span>
              <b>{event.event_type}</b>
              <em>{event.status}</em>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
