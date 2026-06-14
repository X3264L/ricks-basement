import { Hammer, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { formatDuration } from "@/lib/format";
import { useBasementStore } from "@/stores/useBasementStore";

export function ToolConsole() {
  const { activeTools, recentEvents } = useBasementStore();
  const recentTools = recentEvents
    .filter((event) => event.event_type.includes("Tool"))
    .slice(-8)
    .reverse();

  return (
    <Panel title="Tool Console" eyebrow="machine deck">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded border border-reactor/20 bg-reactor/10 p-2">
          <p className="tactical-label">active</p>
          <p className="text-2xl font-bold text-reactor">{Object.keys(activeTools).length}</p>
        </div>
        <div className="rounded border border-hazard/20 bg-hazard/10 p-2">
          <p className="tactical-label">recent</p>
          <p className="text-2xl font-bold text-hazard">{recentTools.length}</p>
        </div>
      </div>
      <div className="space-y-2">
        {recentTools.map((event, index) => (
          <div className="rounded border border-white/10 bg-black/20 p-2" key={`${event.id ?? index}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs text-white">
                {event.event_type === "PreToolUse" ? <Hammer size={12} /> : <Terminal size={12} />}
                {event.tool_name ?? "unknown-tool"}
              </span>
              <Badge tone={event.status === "failure" ? "breach" : "reactor"}>
                {formatDuration(event.duration_ms)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
