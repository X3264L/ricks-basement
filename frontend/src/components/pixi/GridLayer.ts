import { Container, Graphics } from "pixi.js";

export class GridLayer {
  readonly container = new Container();
  private grid = new Graphics();

  constructor() {
    this.container.addChild(this.grid);
  }

  resize(width: number, height: number) {
    this.grid.clear();
    for (let x = 0; x < width; x += 34) {
      this.grid.moveTo(x, 0);
      this.grid.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 34) {
      this.grid.moveTo(0, y);
      this.grid.lineTo(width, y);
    }
    this.grid.stroke({ width: 1, color: 0x42f5c8, alpha: 0.08 });
  }
}
