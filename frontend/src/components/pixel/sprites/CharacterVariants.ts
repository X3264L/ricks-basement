import type { PixelAnimation, PixelCharacterId, PixelStationId } from "@/lib/eventTypes";
import type { SpriteKey, SpritePalette } from "./SpriteMatrix";
import { palette } from "../pixelConstants";

export type CharacterVariant = {
  id: PixelCharacterId;
  displayName: string;
  role: string;
  palette: SpritePalette;
  defaultStation: PixelStationId;
  spriteKey: SpriteKey;
  scale: number;
  personalityLabel: string;
  animations: PixelAnimation[];
};

function scientistPalette(overrides: Partial<SpritePalette>): SpritePalette {
  return {
    X: palette.outline,
    H: palette.hair,
    S: palette.skin,
    V: palette.monitorCyan,
    C: palette.labWhite,
    A: palette.toxicGreen,
    P: 0x303848,
    B: palette.outline,
    R: palette.errorRed,
    ...overrides
  };
}

export const CHARACTER_VARIANTS: Record<PixelCharacterId, CharacterVariant> = {
  "basement-rick": {
    id: "basement-rick",
    displayName: "Basement Rick",
    role: "chaotic generalist",
    defaultStation: "idle-couch",
    spriteKey: "scientist",
    scale: 2,
    personalityLabel: "half-awake basement genius",
    palette: scientistPalette({ H: 0xa7fff0, A: 0x9eff70, P: 0x2f3948 }),
    animations: ["idle", "walk", "work", "think", "success", "sleep"]
  },
  "patch-rick": {
    id: "patch-rick",
    displayName: "Patch Rick",
    role: "patch bench operator",
    defaultStation: "patch-bench",
    spriteKey: "patch",
    scale: 2,
    personalityLabel: "tool-belt code surgeon",
    palette: scientistPalette({ H: 0xd3b5ff, V: 0xff9bf2, A: 0xffc857, P: 0x402a6f }),
    animations: ["idle", "walk", "work", "success", "fail"]
  },
  "terminal-rick": {
    id: "terminal-rick",
    displayName: "Terminal Rick",
    role: "shell jockey",
    defaultStation: "shell-terminal",
    spriteKey: "terminal",
    scale: 2,
    personalityLabel: "green-screen keyboard goblin",
    palette: scientistPalette({ H: 0x98d7ff, V: 0x7dff7a, A: 0x5df7ff, P: 0x101820 }),
    animations: ["idle", "walk", "work", "panic", "success", "fail"]
  },
  "tester-rick": {
    id: "tester-rick",
    displayName: "Tester Rick",
    role: "test rig wrangler",
    defaultStation: "test-rig",
    spriteKey: "tester",
    scale: 2,
    personalityLabel: "hazard-goggle verifier",
    palette: scientistPalette({ H: 0xffe18a, V: 0xffc857, A: 0xff8a3d, P: 0x4a3613 }),
    animations: ["idle", "walk", "work", "success", "fail"]
  },
  "archivist-rick": {
    id: "archivist-rick",
    displayName: "Archivist Rick",
    role: "memory compressor",
    defaultStation: "memory-compressor",
    spriteKey: "archivist",
    scale: 2,
    personalityLabel: "teal memory monk",
    palette: scientistPalette({ H: 0x99ffee, V: 0x60ffe0, C: 0xb6fff2, A: 0xa855f7, P: 0x12433f }),
    animations: ["idle", "walk", "work", "success", "think"]
  },
  "paranoid-rick": {
    id: "paranoid-rick",
    displayName: "Paranoid Rick",
    role: "containment lookout",
    defaultStation: "containment-door",
    spriteKey: "paranoid",
    scale: 2,
    personalityLabel: "red-alert door watcher",
    palette: scientistPalette({ H: 0xffa8a8, V: 0xff4d61, C: 0xffdfb0, A: 0xffc857, P: 0x5a171e }),
    animations: ["idle", "walk", "panic", "work"]
  },
  "glitch-rick": {
    id: "glitch-rick",
    displayName: "Glitch Rick",
    role: "error phantom",
    defaultStation: "error-zone",
    spriteKey: "glitch",
    scale: 2,
    personalityLabel: "magenta crash echo",
    palette: scientistPalette({ H: 0x5df7ff, S: 0xff5bd6, V: 0xff4d61, C: 0x19101f, A: 0x7dff7a, P: 0x09070d }),
    animations: ["idle", "walk", "panic", "fail"]
  },
  "mini-rick-drone": {
    id: "mini-rick-drone",
    displayName: "Mini Rick Drone",
    role: "subagent probe",
    defaultStation: "drone-bay",
    spriteKey: "drone",
    scale: 2,
    personalityLabel: "tiny hover scientist probe",
    palette: scientistPalette({ H: 0xc7e8ff, V: 0x5aa9ff, C: 0x8fd2ff, A: 0x5df7ff, P: 0x1b3a7a }),
    animations: ["idle", "walk", "work", "success", "sleep", "docked"]
  }
};

export function getCharacterForTool(toolName?: string | null): PixelCharacterId {
  const normalized = (toolName ?? "").toLowerCase();
  if (normalized.includes("shell") || normalized.includes("terminal") || normalized.includes("bash")) {
    return "terminal-rick";
  }
  if (
    normalized.includes("patch") ||
    normalized.includes("edit") ||
    normalized.includes("apply") ||
    normalized.includes("file")
  ) {
    return "patch-rick";
  }
  if (
    normalized.includes("test") ||
    normalized.includes("pytest") ||
    normalized.includes("vitest") ||
    normalized.includes("lint") ||
    normalized.includes("typecheck")
  ) {
    return "tester-rick";
  }
  return "basement-rick";
}
