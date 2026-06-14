import { Graphics, Text } from "pixi.js";
import { TILE, palette } from "./pixelConstants";
import type { SpriteMatrix, SpritePalette } from "./sprites/SpriteMatrix";

export type PixelRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function drawPixelRect(
  graphics: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha = 1
) {
  graphics.rect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  graphics.fill({ color, alpha });
}

export function drawOutlinedRect(
  graphics: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: number,
  outlineColor: number = palette.outline,
  outline = 2
) {
  drawPixelRect(graphics, x, y, width, height, outlineColor);
  drawPixelRect(graphics, x + outline, y + outline, width - outline * 2, height - outline * 2, fillColor);
}

export function drawDitherRect(
  graphics: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  baseColor: number,
  ditherColor: number,
  step = 4
) {
  drawPixelRect(graphics, x, y, width, height, baseColor);
  for (let yy = y; yy < y + height; yy += step) {
    for (let xx = x + ((yy / step) % 2) * step; xx < x + width; xx += step * 2) {
      drawPixelRect(graphics, xx, yy, step, step, ditherColor, 0.38);
    }
  }
}

export function drawTileFloor(graphics: Graphics, width: number, y: number, height: number) {
  drawDitherRect(graphics, 0, y, width, height, palette.floorDark, palette.floorMid, 8);
  for (let row = 0; row < height / TILE; row += 1) {
    const yy = y + row * TILE;
    drawPixelRect(graphics, 0, yy, width, 1, palette.outline, 0.38);
    const offset = row % 2 === 0 ? 0 : TILE / 2;
    for (let x = -offset; x < width; x += TILE * 2) {
      drawPixelRect(graphics, x, yy, 1, TILE, palette.outline, 0.24);
    }
  }
}

export function drawWallPanels(graphics: Graphics, width: number, height: number) {
  drawDitherRect(graphics, 0, 0, width, height, palette.wallDark, palette.wallMid, 6);
  for (let x = 0; x < width; x += 40) {
    drawPixelRect(graphics, x, 0, 2, height, palette.outline, 0.18);
  }
  for (let y = 16; y < height; y += 32) {
    drawPixelRect(graphics, 0, y, width, 2, palette.wallLight, 0.15);
  }
}

export function drawPipe(graphics: Graphics, x: number, y: number, width: number, color: number = palette.metalDark) {
  drawPixelRect(graphics, x, y, width, 5, palette.outline);
  drawPixelRect(graphics, x, y + 1, width, 3, color);
  for (let xx = x + 12; xx < x + width; xx += 32) {
    drawOutlinedRect(graphics, xx, y - 2, 7, 9, palette.metalMid);
  }
}

export function drawCable(
  graphics: Graphics,
  points: Array<{ x: number; y: number }>,
  color: number = palette.cableBlack
) {
  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const point = points[i];
    const x = Math.min(previous.x, point.x);
    const y = Math.min(previous.y, point.y);
    drawPixelRect(graphics, x, y, Math.abs(point.x - previous.x) + 2, Math.abs(point.y - previous.y) + 2, color);
  }
}

export function drawMonitor(
  graphics: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  active: boolean
) {
  drawOutlinedRect(graphics, x, y, width, height, palette.metalDark);
  drawPixelRect(graphics, x + 4, y + 4, width - 8, height - 9, active ? color : palette.wallDark);
  drawPixelRect(graphics, x + 7, y + 7, width - 14, 2, palette.labWhite, active ? 0.2 : 0.06);
  drawPixelRect(graphics, x + 5, y + height - 4, width - 10, 2, palette.outline, 0.45);
}

export function drawCRT(graphics: Graphics, x: number, y: number, active: boolean, color: number = palette.monitorCyan) {
  drawMonitor(graphics, x, y, 34, 25, color, active);
  drawOutlinedRect(graphics, x + 10, y + 25, 14, 6, palette.metalMid);
  drawPixelRect(graphics, x + 5, y + 31, 24, 3, palette.outline);
}

export function drawNeonTube(graphics: Graphics, x: number, y: number, width: number, color: number, active: boolean) {
  drawPixelRect(graphics, x - 2, y - 2, width + 4, 6, palette.outline);
  drawPixelRect(graphics, x, y, width, 2, active ? color : palette.metalMid);
  if (active) {
    drawPixelRect(graphics, x, y + 3, width, 1, color, 0.4);
  }
}

export function drawWarningStripe(graphics: Graphics, x: number, y: number, width: number, height: number) {
  drawPixelRect(graphics, x, y, width, height, palette.warningAmber);
  for (let xx = x - height; xx < x + width; xx += height) {
    drawPixelRect(graphics, xx, y, Math.ceil(height / 2), height, palette.outline, 0.78);
  }
}

export function drawSign(graphics: Graphics, x: number, y: number, width: number, height: number, color: number = palette.paper) {
  drawOutlinedRect(graphics, x, y, width, height, color);
  drawPixelRect(graphics, x + 5, y + 6, width - 10, 2, palette.wallMid);
  drawPixelRect(graphics, x + 5, y + 12, width - 18, 2, palette.wallMid);
}

export function drawSpriteMatrix(
  graphics: Graphics,
  matrix: SpriteMatrix,
  spritePalette: SpritePalette,
  x: number,
  y: number,
  scale = 1,
  flip = false
) {
  const height = matrix.length;
  for (let row = 0; row < height; row += 1) {
    const line = matrix[row];
    for (let col = 0; col < line.length; col += 1) {
      const key = line[col];
      const color = spritePalette[key];
      if (color === undefined) continue;
      const px = flip ? x + (line.length - col - 1) * scale : x + col * scale;
      drawPixelRect(graphics, px, y + row * scale, scale, scale, color);
    }
  }
}

export function drawSpriteFrame(
  graphics: Graphics,
  matrix: SpriteMatrix,
  spritePalette: SpritePalette,
  x: number,
  y: number,
  scale = 1,
  flip = false
) {
  drawSpriteMatrix(graphics, matrix, spritePalette, x, y, scale, flip);
}

export function makePixelTextLabel(text: string, fill = "#f8f4d8", fontSize = 8) {
  return new Text({
    text,
    style: {
      fill,
      fontFamily: "Courier New, monospace",
      fontSize,
      fontWeight: "700",
      letterSpacing: 0
    }
  });
}
