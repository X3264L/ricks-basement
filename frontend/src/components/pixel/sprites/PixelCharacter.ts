import { Container, Graphics } from "pixi.js";
import type { PixelAnimation } from "@/lib/eventTypes";
import type { PixelPoint } from "../RoomMap";
import { drawPixelRect, drawSpriteFrame } from "../PixelRenderer";
import { palette } from "../pixelConstants";
import { CHARACTER_SPRITES } from "./CharacterSprites";
import type { CharacterVariant } from "./CharacterVariants";

export class PixelCharacter {
  readonly container = new Container();
  private readonly shadow = new Graphics();
  private readonly sprite = new Graphics();
  private target: PixelPoint;
  private action: PixelAnimation = "idle";
  private facing: "left" | "right" = "right";
  private time = 0;
  private frameIndex = 0;

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

  get bubbleAnchor(): PixelPoint {
    return { x: this.container.x, y: this.container.y - 44 };
  }

  moveTo(point: PixelPoint) {
    if (point.x < this.container.x) this.facing = "left";
    if (point.x > this.container.x) this.facing = "right";
    this.target = point;
    if (this.action === "idle" || this.action === "sleep" || this.action === "docked") {
      this.action = "walk";
    }
  }

  setAction(action: PixelAnimation) {
    this.action = action;
    this.frameIndex = 0;
  }

  setVisible(visible: boolean) {
    this.container.visible = visible;
  }

  tick(delta: number, reducedMotion: boolean) {
    this.time += delta;
    const dx = this.target.x - this.container.x;
    const dy = this.target.y - this.container.y;
    const distance = Math.hypot(dx, dy);
    if (!reducedMotion && distance > 0.8) {
      const speed = Math.min(distance, (this.variant.id === "mini-rick-drone" ? 1.9 : 1.15) * delta);
      this.container.x += (dx / distance) * speed;
      this.container.y += (dy / distance) * speed;
      if (!["panic", "fail", "work"].includes(this.action)) this.action = "walk";
    } else {
      this.container.x = this.target.x;
      this.container.y = this.target.y;
      if (this.action === "walk") this.action = this.variant.id === "mini-rick-drone" ? "docked" : "idle";
    }

    const frames = CHARACTER_SPRITES[this.variant.spriteKey][this.action] ?? CHARACTER_SPRITES[this.variant.spriteKey].idle;
    this.frameIndex = Math.floor(this.time / 10) % frames.length;
    this.draw();
  }

  private draw() {
    const frameSet = CHARACTER_SPRITES[this.variant.spriteKey];
    const frames = frameSet[this.action] ?? frameSet.idle;
    const frame = frames[this.frameIndex % frames.length];
    const scale = this.variant.scale;
    const width = Math.max(...frame.map((line) => line.length)) * scale;
    const height = frame.length * scale;
    const bob = this.action === "walk" ? Math.round(Math.sin(this.time / 5) * 1) : 0;
    const hover = this.variant.id === "mini-rick-drone" ? Math.round(Math.sin(this.time / 8) * 2) : 0;

    this.shadow.clear();
    this.shadow.ellipse(0, 5, width * 0.42, 4);
    this.shadow.fill({ color: palette.shadow, alpha: 0.35 });

    this.sprite.clear();
    drawSpriteFrame(this.sprite, frame, this.variant.palette, -width / 2, -height + bob + hover, scale, this.facing === "left");

    if (this.action === "work") {
      drawPixelRect(this.sprite, width * 0.24, -height * 0.48 + bob, 3, 3, this.variant.palette.A ?? palette.toxicGreen);
    }
    if (this.action === "fail" || this.action === "panic") {
      drawPixelRect(this.sprite, -width * 0.54, -height + 4, 4, 4, palette.errorRed);
      drawPixelRect(this.sprite, width * 0.44, -height + 10, 3, 5, palette.errorRed);
    }
  }
}
