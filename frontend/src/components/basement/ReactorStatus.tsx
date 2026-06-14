import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { useBasementStore } from "@/stores/useBasementStore";

export function ReactorStatus() {
  const state = useBasementStore((store) => store.currentVisualState);
  const tone = state === "TOOL_FAILED" || state === "CONTAINMENT_LOCK" ? "breach" : "reactor";

  return (
    <Panel title="Reactor Status" eyebrow="codex core">
      <div className="flex items-center justify-between gap-4">
        <Cpu className={tone === "breach" ? "text-breach" : "text-reactor"} size={26} />
        <Badge tone={tone}>{state}</Badge>
      </div>
    </Panel>
  );
}
