import { Shield } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Switch } from "@/components/ui/Switch";
import { privacyCopy } from "@/lib/privacy";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function PrivacyPanel() {
  const { privacyMode, reducedMotion, showDebugMetadata, setReducedMotion, setShowDebugMetadata } =
    useSettingsStore();

  return (
    <Panel title="Privacy Panel" eyebrow="local telemetry">
      <div className="mb-3 flex gap-3">
        <Shield size={22} className="text-reactor" />
        <p className="text-xs leading-5 text-white/62">{privacyCopy[privacyMode]}</p>
      </div>
      <div className="space-y-3">
        <Switch checked={reducedMotion} label="Reduced motion" onCheckedChange={setReducedMotion} />
        <Switch
          checked={showDebugMetadata}
          label="Show debug metadata"
          onCheckedChange={setShowDebugMetadata}
        />
      </div>
    </Panel>
  );
}
