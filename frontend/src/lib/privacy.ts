export type PrivacyMode = "minimal" | "balanced" | "debug";

export const privacyCopy: Record<PrivacyMode, string> = {
  minimal: "Event type, status, timings, safe counters, and no prompt or output text.",
  balanced: "Minimal data plus short safe previews with strict truncation.",
  debug: "More local metadata, still redacted and truncated. Never default."
};
