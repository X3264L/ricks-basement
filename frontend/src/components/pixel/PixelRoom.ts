import { Container, Graphics } from "pixi.js";
import { WORLD_HEIGHT, WORLD_WIDTH, palette } from "./pixelConstants";
import {
  drawCable,
  drawDitherRect,
  drawNeonTube,
  drawOutlinedRect,
  drawPipe,
  drawPixelRect,
  drawSign,
  drawTileFloor,
  drawWallPanels
} from "./PixelRenderer";

export class PixelRoom {
  readonly container = new Container();
  private readonly staticArt = new Graphics();
  private readonly ambientArt = new Graphics();
  private time = 0;

  constructor() {
    this.container.addChild(this.staticArt, this.ambientArt);
    this.buildRoom();
  }

  buildRoom() {
    const g = this.staticArt;
    g.clear();

    drawWallPanels(g, WORLD_WIDTH, 152);
    drawTileFloor(g, WORLD_WIDTH, 152, WORLD_HEIGHT - 152);

    drawDitherRect(g, 0, 0, WORLD_WIDTH, 22, 0x0e0b13, palette.wallDark, 4);
    drawPipe(g, 8, 12, 188, palette.metalDark);
    drawPipe(g, 252, 14, 208, palette.metalDark);
    drawPipe(g, 112, 28, 118, 0x38404e);
    drawPixelRect(g, 36, 22, 5, 25, palette.metalDark);
    drawPixelRect(g, 330, 20, 5, 30, palette.metalDark);

    drawNeonTube(g, 42, 38, 58, palette.toxicGreen, true);
    drawNeonTube(g, 340, 42, 72, palette.monitorCyan, true);
    drawPixelRect(g, 0, 150, WORLD_WIDTH, 4, palette.outline, 0.75);

    this.drawShelves(g);
    this.drawWhiteboard(g);
    this.drawBasementJunk(g);
    this.drawWallDamage(g);
  }

  tick(delta: number) {
    this.time += delta / 15;
    const g = this.ambientArt;
    g.clear();
    const flicker = Math.sin(this.time * 5) > -0.4;
    drawPixelRect(g, 42, 40, 58, 4, palette.toxicGreen, flicker ? 0.18 : 0.06);
    drawPixelRect(g, 340, 44, 72, 4, palette.monitorCyan, flicker ? 0.16 : 0.05);

    for (let i = 0; i < 18; i += 1) {
      const x = (i * 37 + Math.floor(this.time * 5)) % WORLD_WIDTH;
      const y = 34 + ((i * 23 + Math.floor(this.time * 3)) % 205);
      drawPixelRect(g, x, y, 1, 1, palette.labWhite, 0.2);
    }
  }

  private drawShelves(g: Graphics) {
    drawOutlinedRect(g, 18, 70, 92, 10, palette.brown);
    drawOutlinedRect(g, 18, 104, 92, 10, palette.brown);
    for (let i = 0; i < 6; i += 1) {
      const x = 26 + i * 13;
      drawOutlinedRect(g, x, 51 + (i % 2) * 4, 7, 18, i % 2 === 0 ? palette.portalViolet : palette.metalMid);
      drawPixelRect(g, x + 2, 54 + (i % 2) * 4, 3, 3, palette.toxicGreen);
    }
    drawOutlinedRect(g, 78, 84, 18, 18, palette.metalDark);
    drawPixelRect(g, 83, 89, 8, 8, palette.warningAmber);
    drawOutlinedRect(g, 30, 88, 18, 14, palette.metalMid);
    drawPixelRect(g, 34, 91, 10, 3, palette.monitorCyan);
  }

  private drawWhiteboard(g: Graphics) {
    drawSign(g, 122, 48, 78, 48, 0xd9f5c9);
    drawPixelRect(g, 130, 58, 38, 2, palette.wallMid);
    drawPixelRect(g, 130, 66, 56, 2, palette.wallMid);
    drawPixelRect(g, 130, 74, 28, 2, palette.errorRed);
    drawPixelRect(g, 176, 75, 12, 12, palette.portalViolet, 0.55);
    drawPixelRect(g, 181, 70, 2, 22, palette.portalViolet, 0.8);
  }

  private drawBasementJunk(g: Graphics) {
    drawCable(g, [
      { x: 92, y: 214 },
      { x: 150, y: 228 },
      { x: 216, y: 218 },
      { x: 300, y: 230 }
    ]);
    drawCable(g, [
      { x: 346, y: 219 },
      { x: 388, y: 238 },
      { x: 448, y: 230 }
    ], 0x101621);
    drawOutlinedRect(g, 26, 229, 26, 16, palette.brown);
    drawPixelRect(g, 31, 234, 16, 3, palette.warningAmber);
    drawOutlinedRect(g, 116, 229, 20, 12, 0x7c2d12);
    drawPixelRect(g, 119, 232, 14, 3, 0xffd093);
    drawOutlinedRect(g, 146, 236, 14, 8, palette.paper);
    drawOutlinedRect(g, 164, 240, 20, 10, palette.metalDark);
    drawPixelRect(g, 402, 247, 40, 5, palette.cableBlack);
  }

  private drawWallDamage(g: Graphics) {
    drawPixelRect(g, 226, 70, 2, 22, palette.outline, 0.35);
    drawPixelRect(g, 228, 91, 12, 2, palette.outline, 0.32);
    drawPixelRect(g, 248, 42, 30, 2, palette.wallLight, 0.18);
    drawPixelRect(g, 282, 70, 18, 2, palette.wallLight, 0.14);
    drawPixelRect(g, 442, 84, 16, 2, palette.outline, 0.3);
  }
}
