import { Container, Graphics } from "pixi.js";
import type { PixelStationId, RoomMood } from "@/lib/eventTypes";
import { ROOM_STATIONS } from "./RoomMap";
import { WORLD_HEIGHT, WORLD_WIDTH, palette } from "./pixelConstants";
import { drawPixelRect } from "./PixelRenderer";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: number;
  size: number;
  kind: "spark" | "smoke" | "glitch" | "memory" | "trail" | "dust";
};

export class PixelEffects {
  readonly container = new Container();
  readonly lightingLayer = new Container();
  private readonly graphics = new Graphics();
  private readonly lighting = new Graphics();
  private particles: Particle[] = [];
  private mood: RoomMood = "sleepy";
  private time = 0;

  constructor() {
    this.container.addChild(this.graphics);
    this.lightingLayer.addChild(this.lighting);
    this.seedDust();
  }

  setMood(mood: RoomMood) {
    this.mood = mood;
  }

  burstAtStation(stationId: PixelStationId, color: number = palette.toxicGreen, kind: Particle["kind"] = "spark") {
    const station = ROOM_STATIONS[stationId];
    for (let i = 0; i < 20; i += 1) {
      this.particles.push({
        x: station.x,
        y: station.y - 24,
        vx: -1.2 + Math.random() * 2.4,
        vy: -1.8 + Math.random() * 0.8,
        life: 1,
        color,
        size: kind === "glitch" ? 3 + Math.floor(Math.random() * 5) : 2 + Math.floor(Math.random() * 3),
        kind
      });
    }
  }

  triggerWarningFlash() {
    this.burstAtStation("containment-door", palette.errorRed, "glitch");
  }

  triggerMemoryPull() {
    for (let i = 0; i < 36; i += 1) {
      this.particles.push({
        x: 40 + Math.random() * 360,
        y: 60 + Math.random() * 170,
        vx: 0,
        vy: 0,
        life: 1.3,
        color: i % 2 === 0 ? palette.monitorCyan : palette.portalViolet,
        size: 2,
        kind: "memory"
      });
    }
  }

  triggerDroneTrail() {
    this.burstAtStation("drone-bay", palette.blue, "trail");
  }

  triggerGlitch() {
    for (let i = 0; i < 28; i += 1) {
      this.particles.push({
        x: 10 + Math.random() * (WORLD_WIDTH - 20),
        y: 40 + Math.random() * 190,
        vx: -2 + Math.random() * 4,
        vy: -0.4 + Math.random() * 0.8,
        life: 0.75,
        color: i % 2 === 0 ? palette.magenta : palette.errorRed,
        size: 3 + Math.floor(Math.random() * 7),
        kind: "glitch"
      });
    }
  }

  tick(delta: number) {
    this.time += delta / 12;
    if (Math.random() < 0.025) this.addDust();
    this.updateParticles(delta);
    this.draw();
  }

  private seedDust() {
    for (let i = 0; i < 20; i += 1) this.addDust();
  }

  private addDust() {
    this.particles.push({
      x: Math.random() * WORLD_WIDTH,
      y: 25 + Math.random() * 200,
      vx: -0.08 + Math.random() * 0.16,
      vy: 0.03 + Math.random() * 0.12,
      life: 2 + Math.random() * 2,
      color: palette.labWhite,
      size: 1,
      kind: "dust"
    });
  }

  private updateParticles(delta: number) {
    const memoryTarget = ROOM_STATIONS["memory-compressor"];
    this.particles = this.particles
      .map((particle) => {
        if (particle.kind === "memory") {
          const dx = memoryTarget.x - particle.x;
          const dy = memoryTarget.y - 34 - particle.y;
          return {
            ...particle,
            x: particle.x + dx * 0.035 * delta,
            y: particle.y + dy * 0.035 * delta,
            life: particle.life - 0.018 * delta
          };
        }
        return {
          ...particle,
          x: particle.x + particle.vx * delta,
          y: particle.y + particle.vy * delta,
          vy: particle.kind === "spark" ? particle.vy + 0.04 * delta : particle.vy,
          life: particle.life - (particle.kind === "dust" ? 0.004 : 0.026) * delta
        };
      })
      .filter((particle) => particle.life > 0);
  }

  private draw() {
    this.graphics.clear();
    for (const particle of this.particles) {
      drawPixelRect(this.graphics, particle.x, particle.y, particle.size, particle.size, particle.color, Math.min(1, particle.life));
    }

    this.lighting.clear();
    const warning = this.mood === "warning";
    const glitch = this.mood === "glitch";
    drawPixelRect(this.lighting, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, warning ? palette.errorRed : glitch ? palette.magenta : palette.toxicGreen, warning || glitch ? 0.1 : 0.035);
    if (warning && Math.sin(this.time * 7) > 0) {
      drawPixelRect(this.lighting, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, palette.errorRed, 0.12);
    }
  }
}
