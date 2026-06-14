import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex h-8 items-center justify-center rounded border border-reactor/30 bg-reactor/10 px-3 text-xs text-reactor transition hover:bg-reactor/20",
        className
      )}
      {...props}
    />
  );
}
