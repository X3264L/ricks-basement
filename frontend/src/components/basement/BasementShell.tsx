"use client";

import { useEffect } from "react";
import { BasementCanvas } from "@/components/pixi/BasementCanvas";
import { fetchRecentEvents } from "@/lib/api";
import { connectEvents } from "@/lib/websocket";
import { useBasementStore } from "@/stores/useBasementStore";
import { ContainmentLock } from "./ContainmentLock";
import { DroneBay } from "./DroneBay";
import { ExperimentLog } from "./ExperimentLog";
import { MemoryCore } from "./MemoryCore";
import { PrivacyPanel } from "./PrivacyPanel";
import { ReactorStatus } from "./ReactorStatus";
import { SessionReplay } from "./SessionReplay";
import { ToolConsole } from "./ToolConsole";
import { TopStatusBar } from "./TopStatusBar";

export function BasementShell() {
  const { ingestEvent, setConnectionStatus, setEvents } = useBasementStore();

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
    <main className="scanlines relative min-h-screen overflow-hidden p-3">
      <div className="relative z-10 grid min-h-[calc(100vh-24px)] grid-rows-[auto_1fr_auto] gap-3">
        <TopStatusBar />
        <div className="grid min-h-0 grid-cols-[320px_1fr_330px] gap-3">
          <ExperimentLog />
          <section className="relative min-h-[560px] overflow-hidden rounded-md border border-reactor/20 bg-black/30">
            <BasementCanvas />
            <div className="absolute left-4 top-4 grid w-56 gap-3">
              <ReactorStatus />
              <MemoryCore />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <SessionReplay />
            </div>
            <ContainmentLock />
          </section>
          <div className="grid content-start gap-3">
            <ToolConsole />
            <DroneBay />
            <PrivacyPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
