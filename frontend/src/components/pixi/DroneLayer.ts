import { Container, Graphics } from "pixi.js";

export class DroneLayer {
  readonly container = new Container();
  private count = 0;
  private time = 0;
  private width = 0;
  private height = 0;

  setDroneCount(count: number) {
    this.count = count;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  tick(delta: number) {
    this.time += delta / 60;
    this.container.removeChildren();
    for (let i = 0; i < this.count; i += 1) {
      const angle = this.time * 1.3 + (Math.PI * 2 * i) / Math.max(this.count, 1);
      const x = this.width / 2 + Math.cos(angle) * 170;
      const y = this.height / 2 - 10 + Math.sin(angle) * 110;
      const drone = new Graphics();
      drone.circle(x, y, 7);
      drone.fill({ color: 0x6ea8fe, alpha: 0.75 });
      drone.circle(x, y, 15);
      drone.stroke({ width: 1, color: 0x6ea8fe, alpha: 0.35 });
      this.container.addChild(drone);
    }
  }
}
