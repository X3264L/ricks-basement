import type { SpriteFrameSet, SpriteKey, SpriteMatrix } from "./SpriteMatrix";
import { normalizeFrame } from "./SpriteMatrix";

const idle: SpriteMatrix = normalizeFrame([
  ".....XXXHHXXX.....",
  "...XXHHHHHHHXX....",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVVVVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  "...XXCCCCCCXX.....",
  "..XCCCAACCCCX.....",
  "..XCCCAACCCCX.....",
  ".XCCCAXXACCCX.....",
  ".XCCCX..XCCCX.....",
  "..XXXP..PXXX......",
  "...XPP..PPX.......",
  "...XPP..PPX.......",
  "...XBB..BBX.......",
  "....XX..XX........"
]);

const walkA: SpriteMatrix = normalizeFrame([
  ".....XXXHHXXX.....",
  "...XXHHHHHHHXX....",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVVVVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  "...XXCCCCCCXX.....",
  "..XCCAACCCCX......",
  ".XCCCAACCCCXX.....",
  ".XCCXAXXACCCX.....",
  "..XX....XCCCX.....",
  "...XP...PXXX......",
  "...XPP.PPX........",
  "..XPP...PPX.......",
  "..XBB....BX.......",
  "...XX...XX........"
]);

const walkB: SpriteMatrix = normalizeFrame([
  ".....XXXHHXXX.....",
  "...XXHHHHHHHXX....",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVVVVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  "...XXCCCCCCXX.....",
  "....XCCCCAACCX....",
  "...XXCCCCAACCX....",
  "...XCCCAXXAXCCX...",
  "...XCCCX....XX....",
  "....XXXP...PX.....",
  "......XPP.PPX.....",
  ".....XPP...PPX....",
  ".....XB....BBX....",
  "......XX...XX....."
]);

const work: SpriteMatrix = normalizeFrame([
  ".....XXXHHXXX.....",
  "...XXHHHHHHHXX....",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVVVVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  "...XXCCCCCCXX.....",
  "..XCCCAACCCCX..A..",
  "..XCCCAACCCCXXAA..",
  "..XCCCAXXACCCX.A..",
  "...XCCX..XCCX.....",
  "...XXP...PXX......",
  "...XPP..PPX.......",
  "...XPP..PPX.......",
  "...XBB..BBX.......",
  "....XX..XX........"
]);

const panic: SpriteMatrix = normalizeFrame([
  "..R..XXXHHXXX..R..",
  "...XXHHHHHHHXX....",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVRRVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  ".X.XXCCCCCCXX.X...",
  ".XXCCCAACCCCXX....",
  "..XCCCAACCCCX.....",
  "..XCCCAXXACCCX....",
  "...XCCX..XCCX.....",
  "....XP....PX......",
  "...XPP....PPX.....",
  "..XPP......PPX....",
  "..XBB......BBX....",
  "...XX......XX....."
]);

const success: SpriteMatrix = normalizeFrame([
  ".....XXXHHXXX..A..",
  "...XXHHHHHHHXXAA..",
  "..XHHHHHHHHHHXA...",
  "..XHHHSSSSHHHX....",
  "...XSSVVVVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  "...XXCCCCCCXX.....",
  "..XCCCAACCCCX.....",
  "..XCCCAACCCCX.....",
  "..XCCCAXXACCCX....",
  "...XCCX..XCCX.....",
  "....XPP..PPX......",
  "...XPP....PPX.....",
  "..XPP......PPX....",
  "..XBB......BBX....",
  "...XX......XX....."
]);

const fail: SpriteMatrix = normalizeFrame([
  "R....XXXHHXXX.....",
  "..RXXHHHHHHHXX.R..",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVRRVSSX.....",
  "...XSSSSSSSSX..R..",
  "....XXSSSSXX......",
  "..XXXCCCCCCXX.....",
  ".XCCCAACCCCX......",
  "..XCCCAACCCCXX....",
  "...XCCAXXACCCX....",
  "...XCCX..XCCX.....",
  "...XXP....PX......",
  "..XPP......PX.....",
  "...XPP....PPX.....",
  "....XBB..BBX......",
  ".....XX..XX......."
]);

const sleep: SpriteMatrix = normalizeFrame([
  ".........A........",
  "......A.AA........",
  ".....XXXHHXXX.....",
  "...XXHHHHHHHXX....",
  "..XHHHHHHHHHHX....",
  "..XHHHSSSSHHHX....",
  "...XSSVVVVSSX.....",
  "...XSSSSSSSSX.....",
  "....XXSSSSXX......",
  "......XCCCCXX.....",
  ".....XCCCCCCX.....",
  "....XCCCAXXAX.....",
  "...XPPPXX.........",
  "..XPPPX...........",
  "...XBBX...........",
  "....XX............"
]);

function frames(overrides: Partial<SpriteFrameSet> = {}): SpriteFrameSet {
  return {
    idle: [idle],
    walk: [walkA, walkB],
    work: [work, idle],
    think: [idle, work],
    panic: [panic, fail],
    success: [success, idle],
    fail: [fail, panic],
    sleep: [sleep],
    docked: [sleep],
    ...overrides
  };
}

const droneIdle: SpriteMatrix = normalizeFrame([
  "....A....A....",
  "..XXHHHHHXX...",
  ".XHHSSSSHHX...",
  ".XSSVVVVSSX...",
  "..XSSSSSSX....",
  "XXXCCCCCCXXX..",
  "..XCAAACX.....",
  "...XPPPX......",
  "..A.....A....."
]);

const droneFly: SpriteMatrix = normalizeFrame([
  "A...A....A..A.",
  "..XXHHHHHXX...",
  ".XHHSSSSHHX...",
  ".XSSVVVVSSX...",
  "..XSSSSSSX....",
  "XXXCCCCCCXXX..",
  "..XCAAACX.....",
  "...XPPPX......",
  ".A.......A...."
]);

const glitchIdle: SpriteMatrix = normalizeFrame([
  "R....XXXHHXXX....",
  "...XXHHHHHHHXX.R.",
  "..XHHHHHHHHHHX...",
  ".RXHHHSSSSHHHX...",
  "...XSSVRRVSSX....",
  "..RXSSSSSSSSX....",
  "....XXSSSSXX..R..",
  "...XXCCCCCCXX....",
  ".RXCCCAACCCCX....",
  "..XCCCAACCCCX.R..",
  ".R.XCCAXXACCCX...",
  "...XCCX..XCCX....",
  "R...XP....PX.....",
  "...XPP....PPX....",
  "..XBB......BBX...",
  "...XX......XX.R.."
]);

export const CHARACTER_SPRITES: Record<SpriteKey, SpriteFrameSet> = {
  scientist: frames(),
  terminal: frames({ work: [work, success] }),
  patch: frames({ work: [work, walkA] }),
  tester: frames({ work: [work, panic] }),
  archivist: frames({ work: [work, idle], think: [idle, success] }),
  paranoid: frames({ idle: [panic], walk: [panic, walkA], panic: [panic, fail] }),
  glitch: frames({ idle: [glitchIdle], walk: [glitchIdle, fail], fail: [glitchIdle, fail], panic: [glitchIdle, panic] }),
  drone: frames({
    idle: [droneIdle],
    walk: [droneIdle, droneFly],
    work: [droneFly, droneIdle],
    think: [droneIdle],
    panic: [droneFly],
    success: [droneFly],
    fail: [droneFly],
    sleep: [droneIdle],
    docked: [droneIdle]
  })
};
