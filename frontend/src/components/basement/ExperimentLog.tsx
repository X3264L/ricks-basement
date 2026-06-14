import { Activity, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { formatTime } from "@/lib/format";
import { useBasementStore } from "@/stores/useBasementStore";

export function ExperimentLog() {
  const { recentEvents, selectEvent, selectedEvent } = useBasementStore();
  const events = [...recentEvents].reverse().slice(0, 18);

  return (
    <Panel title="Experiment Log" eyebrow="live telemetry" className="min-h-0">
      <div className="mb-3 flex h-8 items-center gap-2 rounded border border-white/10 bg-black/20 px-2 text-xs text-white/40">
        <Search size={13} />
        <span>filter later</span>
      </div>
      <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 230px)" }}>
        {events.map((event, index) => (
          <button
            className={`w-full rounded border p-2 text-left transition ${
              selectedEvent?.id === event.id
                ? "border-reactor/60 bg-reactor/10"
                : "border-white/10 bg-black/20 hover:border-reactor/30"
            }`}
            key={`${event.id ?? index}-${event.timestamp}`}
            onClick={() => selectEvent(event)}
            type="button"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <Activity size={12} className="text-reactor" />
                {event.event_type}
              </span>
              <span className="text-[10px] text-white/45">{formatTime(event.timestamp)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge tone={event.status === "failure" ? "breach" : "muted"}>{event.status}</Badge>
              <Badge tone="ion">{event.visual_state}</Badge>
              {event.tool_name ? <Badge tone="hazard">{event.tool_name}</Badge> : null}
            </div>
          </button>
        ))}
        {events.length === 0 ? (
          <div className="rounded border border-dashed border-white/10 p-5 text-center text-xs text-white/45">
            Awaiting basement signal.
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
