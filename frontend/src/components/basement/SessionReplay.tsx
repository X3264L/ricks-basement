import { Gauge } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { useBasementStore } from "@/stores/useBasementStore";

export function SessionReplay() {
  const recentEvents = useBasementStore((state) => state.recentEvents);
  const events = recentEvents.slice(-30);

  return (
    <Panel className="h-24" title="Session Replay" eyebrow="timeline buffer">
      <div className="flex h-8 items-end gap-1 overflow-hidden">
        {events.map((event, index) => (
          <div
            className="min-w-2 rounded-t border border-reactor/20 bg-reactor/30"
            key={`${event.id ?? index}-${event.timestamp}`}
            title={event.event_type}
            style={{
              height:
                event.visual_state === "CONTAINMENT_LOCK"
                  ? 30
                  : event.visual_state === "MEMORY_PRESSURE"
                    ? 24
                    : 15
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/45">
        <Gauge size={12} />
        scrubber-ready local event timeline
      </div>
    </Panel>
  );
}
