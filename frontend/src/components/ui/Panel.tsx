import type { ReactNode } from "react";
import { clsx } from "clsx";

type PanelProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, eyebrow, children, className }: PanelProps) {
  return (
    <section className={clsx("basement-panel rounded-md p-3", className)}>
      {(title || eyebrow) && (
        <header className="mb-3 flex items-center justify-between gap-3">
          <div>
            {eyebrow ? <p className="tactical-label">{eyebrow}</p> : null}
            {title ? <h2 className="text-sm font-semibold text-white">{title}</h2> : null}
          </div>
        </header>
      )}
      {children}
    </section>
  );
}
