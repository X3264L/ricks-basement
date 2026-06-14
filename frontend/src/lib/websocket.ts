const WS_BASE = process.env.NEXT_PUBLIC_RICKS_BASEMENT_WS ?? "ws://127.0.0.1:8787/ws";

export function connectEvents(onEvent: (event: unknown) => void, onStatus: (online: boolean) => void) {
  const socket = new WebSocket(WS_BASE);
  socket.addEventListener("open", () => onStatus(true));
  socket.addEventListener("close", () => onStatus(false));
  socket.addEventListener("error", () => onStatus(false));
  socket.addEventListener("message", (message) => {
    try {
      const payload = JSON.parse(message.data);
      if (payload?.type === "event") onEvent(payload.event);
    } catch {
      // Ignore malformed local telemetry frames.
    }
  });
  return () => socket.close();
}
