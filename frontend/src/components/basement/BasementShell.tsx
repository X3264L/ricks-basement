"use client";

import { useEffect } from "react";
import { fetchRecentEvents } from "@/lib/api";
import { connectEvents } from "@/lib/websocket";
import { PixelHud } from "@/components/pixel/PixelHud";
import { PixellatedBasement } from "@/components/pixel/PixellatedBasement";
import { useBasementStore } from "@/stores/useBasementStore";

export function BasementShell() {
  const { ingestEvent, setConnectionStatus, setEvents } = useBasementStore();
  const connectionStatus = useBasementStore((state) => state.connectionStatus);
  const currentSession = useBasementStore((state) => state.currentSession);
  const currentVisualState = useBasementStore((state) => state.currentVisualState);
  const latestEvent = useBasementStore((state) => state.latestEvent);
  const recentEvents = useBasementStore((state) => state.recentEvents);
  const containmentActive = useBasementStore((state) => state.containmentActive);
  const memoryCompressionActive = useBasementStore((state) => state.memoryCompressionActive);
  const roomMood = useBasementStore((state) => state.roomMood);

  useEffect(() => {
    let alive = true;
    fetchRecentEvents()
      .then((events) => {
        if (alive) setEvents(events);
      })
      .catch(() => setConnectionStatus("offline"));

    const disconnect = connectEvents(
      (event) => ingestEvent(event as Parameters<typeof ingestEvent>[0]),
      (online) => setConnectionStatus(online ? "online" : "offline")
    );
    return () => {
      alive = false;
      disconnect();
    };
  }, [ingestEvent, setConnectionStatus, setEvents]);

  return (
    <main className="pixel-app-shell">
      <div className="pixel-room-frame">
        <PixellatedBasement
          currentVisualState={currentVisualState}
          latestEvent={latestEvent}
          roomMood={roomMood}
        />
        <PixelHud
          connectionStatus={connectionStatus}
          containmentActive={containmentActive}
          currentSession={currentSession}
          currentVisualState={currentVisualState}
          latestEvent={latestEvent}
          memoryCompressionActive={memoryCompressionActive}
          recentEvents={recentEvents}
          roomMood={roomMood}
        />
      </div>
    </main>
  );
}
