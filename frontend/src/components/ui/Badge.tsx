import { clsx } from "clsx";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "reactor" | "hazard" | "breach" | "ion" | "muted";
};

const tones = {
  reactor: "border-reactor/40 bg-reactor/10 text-reactor",
  hazard: "border-hazard/40 bg-hazard/10 text-hazard",
  breach: "border-breach/50 bg-breach/10 text-breach",
  ion: "border-ion/40 bg-ion/10 text-ion",
  muted: "border-white/10 bg-white/5 text-white/70"
};

export function Badge({ children, tone = "muted" }: BadgeProps) {
  return (
    <span className={clsx("inline-flex rounded border px-2 py-0.5 text-[10px]", tones[tone])}>
      {children}
    </span>
  );
}
