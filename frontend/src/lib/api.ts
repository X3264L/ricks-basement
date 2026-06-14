import type { NormalizedEvent } from "./eventTypes";

const API_BASE = process.env.NEXT_PUBLIC_RICKS_BASEMENT_API ?? "http://127.0.0.1:8787";

export async function fetchRecentEvents(): Promise<NormalizedEvent[]> {
  const response = await fetch(`${API_BASE}/api/events?limit=100`, { cache: "no-store" });
  if (!response.ok) return [];
  const payload = (await response.json()) as { events: NormalizedEvent[] };
  return payload.events.reverse();
}
