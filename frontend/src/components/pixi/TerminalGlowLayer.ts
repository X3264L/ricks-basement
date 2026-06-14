import { Container, Graphics } from "pixi.js";
import type { VisualState } from "@/lib/eventTypes";

export class TerminalGlowLayer {
  readonly container = new Container();
  private width = 0;
  private height = 0;
  private time = 0;
  private alert = false;

  setState(state: VisualState) {
    this.alert = state === "CONTAINMENT_LOCK" || state === "TOOL_FAILED";
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  tick(delta: number) {
    this.time += delta / 60;
    this.container.removeChildren();
    const color = this.alert ? 0xff4d6d : 0x42f5c8;
    for (let i = 0; i < 9; i += 1) {
      const glow = new Graphics();
      const x = 40 + i * 90;
      const y = this.height - 140 + Math.sin(this.time * 4 + i) * 3;
      glow.roundRect(x, y, 48, 7, 2);
      glow.fill({ color, alpha: 0.16 + Math.random() * 0.16 });
      this.container.addChild(glow);
    }
    const warning = new Graphics();
    warning.rect(0, 0, this.width, 5);
    warning.fill({ color, alpha: this.alert ? 0.5 + Math.sin(this.time * 12) * 0.3 : 0.06 });
    this.container.addChild(warning);
  }
}
