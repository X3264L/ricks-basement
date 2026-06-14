import { LockKeyhole } from "lucide-react";
import { useBasementStore } from "@/stores/useBasementStore";

export function ContainmentLock() {
  const request = useBasementStore((state) => state.containmentRequests[0]);
  if (!request) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-breach/35 bg-breach/8" />
      <div className="rounded-md border border-breach/70 bg-black/80 p-5 shadow-breach">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded border border-breach/70 bg-breach/15">
            <LockKeyhole className="text-breach" size={24} />
          </div>
          <div>
            <p className="tactical-label text-breach">containment lock</p>
            <h2 className="text-lg font-bold text-white">Operator clearance required</h2>
            <p className="mt-1 max-w-md text-xs text-white/62">
              Visual indicator only. Approve or reject the request in the real Codex approval UI.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded border border-breach/30 bg-breach/10 p-3 text-xs text-white/72">
          tool: {request.tool_name ?? "unknown"} | status: {request.status}
        </div>
      </div>
    </div>
  );
}
