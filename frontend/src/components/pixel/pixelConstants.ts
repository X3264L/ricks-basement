export const WORLD_WIDTH = 480;
export const WORLD_HEIGHT = 270;
export const TILE = 8;
export const PIXEL_SCALE = 3;

export const LAYERS = {
  background: 0,
  wall: 10,
  propBack: 20,
  character: 30,
  propFront: 40,
  effects: 50,
  lighting: 60,
  debug: 70
} as const;

export const palette = {
  wallDark: 0x17111f,
  wallMid: 0x282036,
  wallLight: 0x3a2d4a,
  floorDark: 0x211711,
  floorMid: 0x3a2619,
  floorLight: 0x60412a,
  outline: 0x070508,
  toxicGreen: 0x7dff7a,
  monitorCyan: 0x5df7ff,
  warningAmber: 0xffc857,
  errorRed: 0xff4d61,
  portalViolet: 0xa855f7,
  labWhite: 0xe8fff4,
  cableBlack: 0x08070a,
  metalDark: 0x252833,
  metalMid: 0x46515f,
  metalLight: 0x8aa0a7,
  skin: 0xf0bc92,
  hair: 0xb6fff2,
  shadow: 0x000000,
  grime: 0x0d0a10,
  paper: 0xe7ddb3,
  brown: 0x7a4d2a,
  blue: 0x5aa9ff,
  magenta: 0xff5bd6
} as const;

export type PixelColorName = keyof typeof palette;
