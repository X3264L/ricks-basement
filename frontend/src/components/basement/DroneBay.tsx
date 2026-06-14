import { Orbit } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { useBasementStore } from "@/stores/useBasementStore";

export function DroneBay() {
  const droneRecord = useBasementStore((state) => state.activeDrones);
  const activeDrones = Object.values(droneRecord);

  return (
    <Panel title="Drone Bay" eyebrow="subagents and probes">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((slot) => {
          const drone = activeDrones[slot];
          return (
            <div className="rounded border border-white/10 bg-black/20 p-2" key={slot}>
              <div className="flex items-center justify-between">
                <Orbit size={15} className={drone ? "text-reactor" : "text-white/22"} />
                <Badge tone={drone ? "reactor" : "muted"}>{drone ? "live" : "dock"}</Badge>
              </div>
              <p className="mt-2 truncate text-xs text-white/72">{drone?.tool_name ?? `bay-${slot + 1}`}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
