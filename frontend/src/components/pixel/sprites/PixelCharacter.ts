import { Container, Graphics } from "pixi.js";
import type { PixelAnimation } from "@/lib/eventTypes";
import type { PixelPoint } from "../RoomMap";
import type { CharacterVariant } from "./CharacterVariants";

const PIXEL = 4;

export class PixelCharacter {
  readonly container = new Container();
  private sprite = new Graphics();
  private shadow = new Graphics();
  private target: PixelPoint;
  private action: PixelAnimation = "idle";
  private time = 0;

  constructor(
    readonly variant: CharacterVariant,
    start: PixelPoint
  ) {
    this.target = start;
    this.container.x = start.x;
    this.container.y = start.y;
    this.container.addChild(this.shadow, this.sprite);
    this.draw();
  }

  moveTo(point: PixelPoint) {
    this.target = point;
    if (this.action === "idle" || this.action === "sleep") {
      this.action = "walk";
    }
  }

  setAction(action: PixelAnimation) {
    this.action = action;
  }

  setVisible(visible: boolean) {
    this.container.visible = visible;
  }

  tick(delta: number, reducedMotion: boolean) {
    this.time += delta / 10;
    const dx = this.target.x - this.container.x;
    const dy = this.target.y - this.container.y;
    const distance = Math.hypot(dx, dy);
    if (!reducedMotion && distance > 1) {
      const speed = Math.min(distance, 1.7 * delta);
      this.container.x += (dx / distance) * speed;
      this.container.y += (dy / distance) * speed;
      if (this.action !== "panic" && this.action !== "fail") this.action = "walk";
    } else {
      this.container.x = this.target.x;
      this.container.y = this.target.y;
      if (this.action === "walk") this.action = "idle";
    }
    this.draw();
  }

  private rect(x: number, y: number, w: number, h: number, color: number, alpha = 1) {
    this.sprite.rect(x * PIXEL, y * PIXEL, w * PIXEL, h * PIXEL);
    this.sprite.fill({ color, alpha });
  }

  private draw() {
    const palette = this.variant.palette;
    const bob = this.action === "walk" ? Math.round(Math.sin(this.time) * 1) : 0;
    const panic = this.action === "panic" ? Math.round(Math.sin(this.time * 3) * 1) : 0;
    const workArm = this.action === "work" ? Math.round(Math.sin(this.time * 2) * 1) : 0;
    const successArm = this.action === "success" ? -2 : 0;
    const failSkew = this.action === "fail" ? Math.round(Math.sin(this.time * 7) * 2) : 0;

    this.sprite.clear();
    this.shadow.clear();
    this.shadow.ellipse(0, 42, 28, 7);
    this.shadow.fill({ color: 0x000000, alpha: 0.28 });

    this.rect(-4 + failSkew, -18 + bob, 8, 2, palette.hair);
    this.rect(-5 - panic, -16 + bob, 10, 2, palette.hair);
    this.rect(-3, -14 + bob, 7, 2, palette.hair);
    this.rect(-4, -12 + bob, 8, 6, palette.skin);
    this.rect(-3, -11 + bob, 6, 1, palette.visor);
    this.rect(-5, -6 + bob, 10, 11, palette.coat);
    this.rect(-3, 5 + bob, 3, 8, palette.pants);
    this.rect(1, 5 + bob, 3, 8, palette.pants);
    this.rect(-7, -4 + bob, 2, 8 + workArm + successArm, palette.coat);
    this.rect(5, -4 + bob, 2, 8 - workArm + successArm, palette.coat);
    this.rect(-6, 13 + bob, 4, 2, 0x111111);
    this.rect(1, 13 + bob, 4, 2, 0x111111);

    if (this.action === "think") {
      this.rect(7, -22, 2, 2, palette.accent, 0.8);
      this.rect(10, -26, 1, 1, palette.accent, 0.8);
    }
    if (this.action === "panic" || this.action === "fail") {
      this.rect(-9, -24, 3, 2, 0xff4d6d);
      this.rect(7, -25, 2, 3, 0xff4d6d);
    }
    if (this.action === "success") {
      this.rect(8, -24, 2, 5, palette.accent);
      this.rect(6, -22, 6, 2, palette.accent);
    }
    if (this.variant.id === "mini-rick-drone") {
      this.rect(-9, -2, 3, 1, palette.accent);
      this.rect(6, -2, 3, 1, palette.accent);
      this.rect(-1, -22, 2, 3, palette.accent);
    }
  }
}
