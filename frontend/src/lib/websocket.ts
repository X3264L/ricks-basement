const WS_BASE = process.env.NEXT_PUBLIC_RICKS_BASEMENT_WS ?? "ws://127.0.0.1:8787/ws";
const RECONNECT_DELAY_MS = 1200;

export function connectEvents(onEvent: (event: unknown) => void, onStatus: (online: boolean) => void) {
  let socket: WebSocket | null = null;
  let reconnectTimer: number | null = null;
  let closedByClient = false;

  const scheduleReconnect = () => {
    if (closedByClient || reconnectTimer) return;
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      openSocket();
    }, RECONNECT_DELAY_MS);
  };

  const openSocket = () => {
    if (socket && socket.readyState <= WebSocket.OPEN) return;
    socket = new WebSocket(WS_BASE);
    socket.addEventListener("open", () => onStatus(true));
    socket.addEventListener("close", () => {
      onStatus(false);
      scheduleReconnect();
    });
    socket.addEventListener("error", () => {
      onStatus(false);
      socket?.close();
    });
    socket.addEventListener("message", (message) => {
      try {
        const payload = JSON.parse(message.data);
        if (payload?.type === "event") onEvent(payload.event);
      } catch {
        // Ignore malformed local telemetry frames.
      }
    });
  };

  openSocket();

  return () => {
    closedByClient = true;
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    socket?.close();
  };
}
