import { RadioTower, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { compactId } from "@/lib/format";
import { useBasementStore } from "@/stores/useBasementStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function TopStatusBar() {
  const { connectionStatus, currentSession, recentEvents, currentVisualState } = useBasementStore();
  const privacyMode = useSettingsStore((state) => state.privacyMode);
  const online = connectionStatus === "online";

  return (
    <header className="basement-panel z-20 flex h-14 items-center justify-between rounded-md px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-reactor/40 bg-reactor/10 shadow-reactor">
          <Zap size={16} className="text-reactor" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">Rick&apos;s Basement</h1>
          <p className="tactical-label">secret command center for Codex</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={online ? "reactor" : "breach"}>
          <RadioTower size={11} className="mr-1" />
          {connectionStatus}
        </Badge>
        <Badge tone="ion">session {compactId(currentSession)}</Badge>
        <Badge tone="hazard">{recentEvents.length} events</Badge>
        <Badge tone="reactor">
          <ShieldCheck size={11} className="mr-1" />
          {privacyMode}
        </Badge>
        <Badge tone={currentVisualState === "CONTAINMENT_LOCK" ? "breach" : "muted"}>
          {currentVisualState}
        </Badge>
      </div>
    </header>
  );
}
