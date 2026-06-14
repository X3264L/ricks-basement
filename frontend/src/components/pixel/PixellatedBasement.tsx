"use client";

import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { NormalizedEvent, RoomMood, VisualState } from "@/lib/eventTypes";
import { PixelBasementScene } from "./PixelBasementScene";

type PixellatedBasementProps = {
  latestEvent: NormalizedEvent | null;
  currentVisualState: VisualState;
  roomMood: RoomMood;
};

export function PixellatedBasement({
  latestEvent,
  currentVisualState,
  roomMood
}: PixellatedBasementProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const sceneRef = useRef<PixelBasementScene | null>(null);
  const handledEventKey = useRef<string>("");
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  useEffect(() => {
    let disposed = false;
    const host = hostRef.current;
    if (!host) return;
    const target = host;

    async function boot() {
      const app = new Application();
      await app.init({
        resizeTo: target,
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
        roundPixels: true
      });
      if (disposed) {
        app.destroy();
        return;
      }
      app.canvas.classList.add("pixel-canvas");
      target.appendChild(app.canvas);
      appRef.current = app;
      const scene = new PixelBasementScene(app);
      sceneRef.current = scene;

      const resize = () => scene.resize(app.screen.width, app.screen.height);
      resize();
      window.addEventListener("resize", resize);

      app.ticker.add((ticker) => {
        scene.tick(ticker.deltaTime);
      });
    }

    boot();
    return () => {
      disposed = true;
      sceneRef.current?.destroy();
      sceneRef.current = null;
      appRef.current?.destroy(true);
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setVisualState(currentVisualState);
    sceneRef.current?.setRoomMood(roomMood);
  }, [currentVisualState, roomMood]);

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!latestEvent) return;
    const key = `${latestEvent.id ?? "no-id"}-${latestEvent.timestamp}-${latestEvent.event_type}-${latestEvent.status}`;
    if (handledEventKey.current === key) return;
    handledEventKey.current = key;
    sceneRef.current?.handleEvent(latestEvent);
  }, [latestEvent]);

  return <div className="pixel-room-canvas" ref={hostRef} />;
}
