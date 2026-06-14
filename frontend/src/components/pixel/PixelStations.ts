import { Container, Graphics } from "pixi.js";
import type { PixelStationId, RoomMood } from "@/lib/eventTypes";
import { ROOM_STATIONS } from "./RoomMap";
import { palette } from "./pixelConstants";
import {
  drawCRT,
  drawMonitor,
  drawOutlinedRect,
  drawPixelRect,
  drawSign,
  drawWarningStripe
} from "./PixelRenderer";

type StationState = "idle" | "active" | "warning" | "error";

export class PixelStations {
  readonly backLayer = new Container();
  readonly frontLayer = new Container();
  private readonly backGraphics = new Graphics();
  private readonly frontGraphics = new Graphics();
  private readonly stationStates = new Map<PixelStationId, StationState>();
  private mood: RoomMood = "sleepy";
  private time = 0;

  constructor() {
    this.backLayer.addChild(this.backGraphics);
    this.frontLayer.addChild(this.frontGraphics);
    this.buildStations();
  }

  setMood(mood: RoomMood) {
    this.mood = mood;
  }

  setActive(stationId: PixelStationId, state: StationState = "active") {
    this.stationStates.set(stationId, state);
  }

  clearTransientStates() {
    for (const [station, state] of this.stationStates.entries()) {
      if (state === "active") this.stationStates.set(station, "idle");
    }
  }

  tick(delta: number) {
    this.time += delta / 10;
    this.buildStations();
  }

  private state(station: PixelStationId): StationState {
    return this.stationStates.get(station) ?? "idle";
  }

  private isActive(station: PixelStationId) {
    return this.state(station) === "active";
  }

  private isWarning(station: PixelStationId) {
    return this.state(station) === "warning" || this.mood === "warning";
  }

  private buildStations() {
    this.backGraphics.clear();
    this.frontGraphics.clear();
    this.drawContainmentDoor(this.backGraphics);
    this.drawMemoryCompressor(this.backGraphics);
    this.drawMainComputer(this.backGraphics);
    this.drawShellTerminal(this.backGraphics);
    this.drawDroneBay(this.backGraphics);
    this.drawStrangeMachine(this.backGraphics);
    this.drawCouch(this.backGraphics);
    this.drawPatchBench(this.frontGraphics);
    this.drawTestRig(this.frontGraphics);
    this.drawStationPads(this.frontGraphics);
  }

  private drawMainComputer(g: Graphics) {
    const blink = Math.sin(this.time * 4) > -0.2;
    drawOutlinedRect(g, 202, 62, 88, 82, palette.metalDark);
    drawMonitor(g, 210, 72, 30, 25, palette.monitorCyan, blink || this.isActive("main-computer"));
    drawMonitor(g, 246, 69, 36, 30, palette.toxicGreen, this.isActive("main-computer") || blink);
    drawMonitor(g, 225, 104, 44, 22, palette.portalViolet, this.mood === "glitch" ? blink : true);
    drawOutlinedRect(g, 215, 132, 62, 11, palette.metalMid);
    for (let x = 220; x < 272; x += 7) drawPixelRect(g, x, 136, 3, 2, palette.monitorCyan, blink ? 1 : 0.35);
  }

  private drawShellTerminal(g: Graphics) {
    drawOutlinedRect(g, 360, 114, 54, 42, palette.metalDark);
    drawCRT(g, 369, 86, this.isActive("shell-terminal"), palette.toxicGreen);
    drawPixelRect(g, 367, 126, 38, 5, palette.outline);
    for (let x = 370; x < 402; x += 6) drawPixelRect(g, x, 128, 3, 2, palette.toxicGreen);
  }

  private drawPatchBench(g: Graphics) {
    drawOutlinedRect(g, 286, 198, 78, 13, palette.brown);
    drawPixelRect(g, 294, 211, 5, 26, palette.brown);
    drawPixelRect(g, 348, 211, 5, 26, palette.brown);
    drawOutlinedRect(g, 305, 180, 34, 18, palette.metalDark);
    drawPixelRect(g, 310, 185, 24, 6, this.isActive("patch-bench") ? palette.warningAmber : palette.monitorCyan);
    drawPixelRect(g, 318, 196, 28, 2, palette.labWhite, 0.75);
    if (this.isActive("patch-bench")) {
      drawPixelRect(g, 345, 184, 3, 3, palette.warningAmber);
      drawPixelRect(g, 351, 190, 2, 2, palette.labWhite);
    }
  }

  private drawTestRig(g: Graphics) {
    const state = this.state("test-rig");
    const color = state === "error" ? palette.errorRed : state === "active" ? palette.toxicGreen : palette.warningAmber;
    drawOutlinedRect(g, 388, 190, 62, 48, palette.metalDark);
    drawPixelRect(g, 396, 198, 16, 16, color);
    drawPixelRect(g, 419, 198, 22, 4, palette.metalLight);
    drawPixelRect(g, 419, 207, 17, 4, palette.metalLight);
    drawPixelRect(g, 419, 216, 20, 4, palette.metalLight);
    drawOutlinedRect(g, 398, 222, 42, 10, palette.metalMid);
  }

  private drawMemoryCompressor(g: Graphics) {
    const active = this.isActive("memory-compressor") || this.mood === "memory";
    const pulse = active ? Math.round(Math.sin(this.time * 3) * 2) : 0;
    drawOutlinedRect(g, 72, 104, 76, 68, palette.metalDark);
    drawOutlinedRect(g, 88 - pulse, 116 - pulse, 44 + pulse * 2, 32 + pulse * 2, active ? palette.portalViolet : palette.metalMid);
    drawPixelRect(g, 102, 126, 18, 10, active ? palette.monitorCyan : palette.wallDark);
    drawPixelRect(g, 78, 154, 64, 7, palette.metalMid);
  }

  private drawContainmentDoor(g: Graphics) {
    const warning = this.isWarning("containment-door");
    drawOutlinedRect(g, 12, 105, 54, 92, warning ? 0x4d1118 : palette.metalDark);
    drawWarningStripe(g, 17, 112, 44, 7);
    drawPixelRect(g, 24, 126, 30, 48, warning ? palette.errorRed : palette.metalMid);
    drawPixelRect(g, 34, 146, 10, 5, palette.outline);
    drawSign(g, 15, 178, 48, 14, warning ? palette.warningAmber : palette.paper);
  }

  private drawDroneBay(g: Graphics) {
    const active = this.isActive("drone-bay");
    drawOutlinedRect(g, 404, 54, 56, 44, palette.metalDark);
    drawPixelRect(g, 412, 63, 40, 12, active ? palette.blue : palette.metalMid);
    drawPixelRect(g, 420, 82, 24, 8, palette.outline);
    drawPixelRect(g, 426, 86, 12, 4, active ? palette.monitorCyan : palette.metalLight);
  }

  private drawStrangeMachine(g: Graphics) {
    const active = this.mood !== "sleepy";
    const ring = Math.sin(this.time * 2) > 0;
    drawOutlinedRect(g, 210, 178, 58, 58, palette.metalDark);
    drawPixelRect(g, 220, 188, 38, 38, ring && active ? palette.portalViolet : palette.wallMid);
    drawPixelRect(g, 229, 197, 20, 20, active ? palette.toxicGreen : palette.metalMid);
    drawPixelRect(g, 236, 204, 6, 6, palette.outline);
  }

  private drawCouch(g: Graphics) {
    drawOutlinedRect(g, 42, 205, 66, 24, 0x5b2d45);
    drawPixelRect(g, 48, 194, 52, 15, 0x7f3d5c);
    drawPixelRect(g, 50, 214, 48, 4, 0x2b1625);
  }

  private drawStationPads(g: Graphics) {
    for (const station of Object.values(ROOM_STATIONS)) {
      if (["whiteboard", "shelf-area"].includes(station.id)) continue;
      const active = this.state(station.id) !== "idle";
      drawPixelRect(g, station.x - 12, station.y + 2, 24, 4, active ? palette.toxicGreen : palette.shadow, active ? 0.45 : 0.22);
    }
  }
}
