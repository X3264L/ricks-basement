import type { ReactNode } from "react";
import { clsx } from "clsx";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-md border border-white/10 bg-black/20 p-3", className)}>
      {children}
    </div>
  );
}
