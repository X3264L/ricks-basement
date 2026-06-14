import { Container, Graphics } from "pixi.js";
import type { VisualState } from "@/lib/eventTypes";

const colors: Record<string, number> = {
  normal: 0x42f5c8,
  hazard: 0xffbd4a,
  breach: 0xff4d6d,
  ion: 0x6ea8fe
};

export class ReactorScene {
  readonly container = new Container();
  private core = new Graphics();
  private rings = new Graphics();
  private state: VisualState = "IDLE";
  private time = 0;
  private width = 0;
  private height = 0;

  constructor() {
    this.container.addChild(this.rings, this.core);
  }

  setState(state: VisualState) {
    this.state = state;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  tick(delta: number) {
    this.time += delta / 60;
    const cx = this.width / 2;
    const cy = this.height / 2 - 10;
    const alert = this.state === "CONTAINMENT_LOCK" || this.state === "TOOL_FAILED";
    const memory = this.state === "MEMORY_PRESSURE";
    const color = alert ? colors.breach : memory ? colors.hazard : colors.normal;
    const pulse = 1 + Math.sin(this.time * (alert ? 7 : 3)) * 0.08;

    this.rings.clear();
    for (let i = 0; i < 5; i += 1) {
      const radius = (88 + i * 34) * pulse + Math.sin(this.time * 2 + i) * 5;
      this.rings.circle(cx, cy, radius);
      this.rings.stroke({ width: 2, color, alpha: 0.18 - i * 0.02 });
    }

    this.core.clear();
    this.core.circle(cx, cy, 56 * pulse);
    this.core.fill({ color, alpha: 0.18 });
    this.core.circle(cx, cy, 29 * pulse);
    this.core.fill({ color, alpha: 0.65 });
    this.core.circle(cx, cy, 8);
    this.core.fill({ color: 0xffffff, alpha: 0.9 });
  }
}
