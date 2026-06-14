import type { PixelAnimation, PixelCharacterId, PixelStationId } from "@/lib/eventTypes";

export type PixelPalette = {
  hair: number;
  skin: number;
  coat: number;
  pants: number;
  visor: number;
  accent: number;
};

export type CharacterVariant = {
  id: PixelCharacterId;
  displayName: string;
  role: string;
  palette: PixelPalette;
  defaultStation: PixelStationId;
  animations: PixelAnimation[];
};

export const CHARACTER_VARIANTS: Record<PixelCharacterId, CharacterVariant> = {
  "basement-rick": {
    id: "basement-rick",
    displayName: "Basement Rick",
    role: "room generalist",
    defaultStation: "idle-couch",
    palette: { hair: 0xa7f3d0, skin: 0xf2c29b, coat: 0xd7f7ff, pants: 0x4b5563, visor: 0x67e8f9, accent: 0x84cc16 },
    animations: ["idle", "walk", "work", "think", "success", "sleep"]
  },
  "coder-rick": {
    id: "coder-rick",
    displayName: "Coder Rick",
    role: "patch desk operator",
    defaultStation: "patch-desk",
    palette: { hair: 0xc4b5fd, skin: 0xf0b790, coat: 0xf8fafc, pants: 0x312e81, visor: 0xf0abfc, accent: 0xa78bfa },
    animations: ["idle", "walk", "work", "success", "fail"]
  },
  "terminal-rick": {
    id: "terminal-rick",
    displayName: "Terminal Rick",
    role: "shell jockey",
    defaultStation: "shell-terminal",
    palette: { hair: 0x93c5fd, skin: 0xeeb68f, coat: 0xe0f2fe, pants: 0x111827, visor: 0x22d3ee, accent: 0x38bdf8 },
    animations: ["idle", "walk", "work", "panic", "success", "fail"]
  },
  "tester-rick": {
    id: "tester-rick",
    displayName: "Tester Rick",
    role: "test rig wrangler",
    defaultStation: "test-rig",
    palette: { hair: 0xfde68a, skin: 0xf1c49d, coat: 0xecfccb, pants: 0x365314, visor: 0xfacc15, accent: 0xf97316 },
    animations: ["idle", "walk", "work", "success", "fail"]
  },
  "archivist-rick": {
    id: "archivist-rick",
    displayName: "Archivist Rick",
    role: "memory compressor",
    defaultStation: "memory-compressor",
    palette: { hair: 0x99f6e4, skin: 0xeab994, coat: 0xccfbf1, pants: 0x134e4a, visor: 0x2dd4bf, accent: 0x14b8a6 },
    animations: ["idle", "walk", "work", "success", "think"]
  },
  "paranoid-rick": {
    id: "paranoid-rick",
    displayName: "Paranoid Rick",
    role: "containment lookout",
    defaultStation: "containment-door",
    palette: { hair: 0xfca5a5, skin: 0xe8ad8b, coat: 0xffedd5, pants: 0x7f1d1d, visor: 0xfb7185, accent: 0xef4444 },
    animations: ["idle", "walk", "panic", "work"]
  },
  "glitch-rick": {
    id: "glitch-rick",
    displayName: "Glitch Rick",
    role: "error phantom",
    defaultStation: "error-corner",
    palette: { hair: 0x22d3ee, skin: 0xf472b6, coat: 0x18181b, pants: 0x09090b, visor: 0xff4d6d, accent: 0x00ff95 },
    animations: ["idle", "walk", "panic", "fail"]
  },
  "mini-rick-drone": {
    id: "mini-rick-drone",
    displayName: "Mini Rick Drone",
    role: "subagent probe",
    defaultStation: "drone-bay",
    palette: { hair: 0xbfdbfe, skin: 0xf2c29b, coat: 0xdbeafe, pants: 0x1d4ed8, visor: 0x60a5fa, accent: 0x93c5fd },
    animations: ["idle", "walk", "work", "success", "sleep"]
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
    return "coder-rick";
  }
  if (
    normalized.includes("test") ||
    normalized.includes("pytest") ||
    normalized.includes("vitest") ||
    normalized.includes("lint")
  ) {
    return "tester-rick";
  }
  return "basement-rick";
}
