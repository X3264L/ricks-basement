import { DatabaseZap } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { useBasementStore } from "@/stores/useBasementStore";

export function MemoryCore() {
  const pressure = useBasementStore((state) => state.memoryPressure);
  const pct = Math.round(pressure * 100);

  return (
    <Panel title="Memory Core" eyebrow="compression chamber">
      <div className="flex items-center gap-3">
        <DatabaseZap className={pressure > 0.8 ? "text-hazard" : "text-reactor"} size={24} />
        <div className="flex-1">
          <div className="h-3 overflow-hidden rounded bg-white/8">
            <div
              className="h-full bg-gradient-to-r from-reactor via-hazard to-breach transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/55">
            {pressure > 0.8 ? "pressure rising" : "stable memory glow"}
          </p>
        </div>
      </div>
    </Panel>
  );
}
