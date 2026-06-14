export type SpriteMatrix = string[];

export type SpritePalette = Record<string, number | undefined>;

export type SpriteFrameSet = {
  idle: SpriteMatrix[];
  walk: SpriteMatrix[];
  work: SpriteMatrix[];
  think: SpriteMatrix[];
  panic: SpriteMatrix[];
  success: SpriteMatrix[];
  fail: SpriteMatrix[];
  sleep: SpriteMatrix[];
  docked: SpriteMatrix[];
};

export type SpriteKey =
  | "scientist"
  | "terminal"
  | "patch"
  | "tester"
  | "archivist"
  | "paranoid"
  | "glitch"
  | "drone";

export function mirrorFrame(frame: SpriteMatrix): SpriteMatrix {
  return frame.map((line) => [...line].reverse().join(""));
}

export function normalizeFrame(frame: SpriteMatrix): SpriteMatrix {
  const width = Math.max(...frame.map((line) => line.length));
  return frame.map((line) => line.padEnd(width, "."));
}
