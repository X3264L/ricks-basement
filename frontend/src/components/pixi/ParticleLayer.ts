import { Container, Graphics } from "pixi.js";
import type { VisualState } from "@/lib/eventTypes";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: number;
};

export class ParticleLayer {
  readonly container = new Container();
  private particles: Particle[] = [];
  private width = 0;
  private height = 0;

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  burst(state: VisualState) {
    const color =
      state === "CONTAINMENT_LOCK" || state === "TOOL_FAILED"
        ? 0xff4d6d
        : state === "MEMORY_PRESSURE"
          ? 0xffbd4a
          : 0x42f5c8;
    for (let i = 0; i < 22; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x: this.width / 2,
        y: this.height / 2 - 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color
      });
    }
  }

  tick(delta: number) {
    this.container.removeChildren();
    this.particles = this.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * delta,
        y: particle.y + particle.vy * delta,
        life: particle.life - 0.018 * delta
      }))
      .filter((particle) => particle.life > 0);

    for (const particle of this.particles) {
      const dot = new Graphics();
      dot.circle(particle.x, particle.y, 2 + particle.life * 2);
      dot.fill({ color: particle.color, alpha: particle.life * 0.7 });
      this.container.addChild(dot);
    }
  }
}
