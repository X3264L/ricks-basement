import { clsx } from "clsx";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs text-white/72">
      <span>{label}</span>
      <button
        aria-pressed={checked}
        aria-label={label}
        className={clsx(
          "relative h-5 w-9 rounded-full border transition",
          checked ? "border-reactor/50 bg-reactor/25" : "border-white/15 bg-white/8"
        )}
        onClick={() => onCheckedChange(!checked)}
        type="button"
      >
        <span
          className={clsx(
            "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition",
            checked ? "left-[18px] bg-reactor" : "left-0.5"
          )}
        />
      </button>
    </label>
  );
}
