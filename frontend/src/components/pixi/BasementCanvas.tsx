"use client";

import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { useBasementStore } from "@/stores/useBasementStore";
import { AnimationBus } from "./AnimationBus";
import { DroneLayer } from "./DroneLayer";
import { GridLayer } from "./GridLayer";
import { ParticleLayer } from "./ParticleLayer";
import { ReactorScene } from "./ReactorScene";
import { TerminalGlowLayer } from "./TerminalGlowLayer";

export function BasementCanvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const busRef = useRef<AnimationBus | null>(null);
  const lastEvent = useBasementStore((state) => state.recentEvents.at(-1));
  const visualState = useBasementStore((state) => state.currentVisualState);
  const droneCount = useBasementStore((state) => Object.keys(state.activeDrones).length);

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
        antialias: true,
        autoDensity: true
      });
      if (disposed) {
        app.destroy();
        return;
      }
      target.appendChild(app.canvas);
      appRef.current = app;

      const grid = new GridLayer();
      const reactor = new ReactorScene();
      const particles = new ParticleLayer();
      const drones = new DroneLayer();
      const terminals = new TerminalGlowLayer();
      app.stage.addChild(grid.container, terminals.container, reactor.container, drones.container, particles.container);
      busRef.current = new AnimationBus(reactor, particles, drones, terminals);

      const resize = () => {
        const { width, height } = app.screen;
        grid.resize(width, height);
        reactor.resize(width, height);
        particles.resize(width, height);
        drones.resize(width, height);
        terminals.resize(width, height);
      };
      resize();
      window.addEventListener("resize", resize);

      app.ticker.add((ticker) => {
        reactor.tick(ticker.deltaTime);
        particles.tick(ticker.deltaTime);
        drones.tick(ticker.deltaTime);
        terminals.tick(ticker.deltaTime);
      });
    }

    boot();
    return () => {
      disposed = true;
      appRef.current?.destroy(true);
      appRef.current = null;
    };
  }, []);

  useEffect(() => {
    busRef.current?.setState(visualState, droneCount);
  }, [visualState, droneCount]);

  useEffect(() => {
    if (lastEvent) busRef.current?.emit(lastEvent, droneCount);
  }, [lastEvent, droneCount]);

  return <div className="absolute inset-0" ref={hostRef} />;
}
