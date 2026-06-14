export function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return date.toLocaleTimeString([], { hour12: false });
}

export function formatDuration(value?: number | null): string {
  if (value === null || value === undefined) return "live";
  if (value < 1000) return `${value}ms`;
  return `${(value / 1000).toFixed(1)}s`;
}

export function compactId(value?: string | null): string {
  if (!value) return "none";
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-5)}`;
}
