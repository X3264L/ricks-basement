import { Application, Container } from "pixi.js";
import type { NormalizedEvent, PixelCharacterId, PixelStationId, RoomMood, VisualState } from "@/lib/eventTypes";
import { LAYERS, WORLD_HEIGHT, WORLD_WIDTH, palette } from "./pixelConstants";
import { getStationPoint } from "./RoomMap";
import { PixelEffects } from "./PixelEffects";
import { PixelRoom } from "./PixelRoom";
import { PixelStations } from "./PixelStations";
import {
  getAnimationForEvent,
  getCharacterForEvent,
  getRoomMoodForVisualState,
  getStationForEvent
} from "./pixelLogic";
import { PixelCharacter } from "./sprites/PixelCharacter";
import { CHARACTER_VARIANTS, getCharacterForTool } from "./sprites/CharacterVariants";

export class PixelBasementScene {
  private readonly root = new Container();
  private readonly backgroundLayer = new Container();
  private readonly wallLayer = new Container();
  private readonly propBackLayer = new Container();
  private readonly characterLayer = new Container();
  private readonly propFrontLayer = new Container();
  private readonly effectsLayer = new Container();
  private readonly lightingLayer = new Container();
  private readonly debugLayer = new Container();
  private readonly room = new PixelRoom();
  private readonly stations = new PixelStations();
  private readonly effects = new PixelEffects();
  private readonly characters = new Map<PixelCharacterId, PixelCharacter>();
  private visualState: VisualState = "IDLE";
  private roomMood: RoomMood = "sleepy";
  private reducedMotion = false;
  private timeSinceEvent = 0;
  private demoStep = 0;

  constructor(private readonly app: Application) {
    this.app.stage.addChild(this.root);
    this.root.sortableChildren = true;
    this.buildRoom();
    this.buildStations();
    this.buildCharacters();
    this.resize(this.app.screen.width, this.app.screen.height);
  }

  buildRoom() {
    this.backgroundLayer.zIndex = LAYERS.background;
    this.wallLayer.zIndex = LAYERS.wall;
    this.root.addChild(this.backgroundLayer, this.wallLayer);
    this.wallLayer.addChild(this.room.container);
  }

  buildStations() {
    this.propBackLayer.zIndex = LAYERS.propBack;
    this.propFrontLayer.zIndex = LAYERS.propFront;
    this.effectsLayer.zIndex = LAYERS.effects;
    this.lightingLayer.zIndex = LAYERS.lighting;
    this.debugLayer.zIndex = LAYERS.debug;
    this.propBackLayer.addChild(this.stations.backLayer);
    this.propFrontLayer.addChild(this.stations.frontLayer);
    this.effectsLayer.addChild(this.effects.container);
    this.lightingLayer.addChild(this.effects.lightingLayer);
    this.root.addChild(this.propBackLayer, this.characterLayer, this.propFrontLayer, this.effectsLayer, this.lightingLayer, this.debugLayer);
  }

  buildCharacters() {
    this.characterLayer.zIndex = LAYERS.character;
    for (const variant of Object.values(CHARACTER_VARIANTS)) {
      const character = new PixelCharacter(variant, getStationPoint(variant.defaultStation));
      if (variant.id === "glitch-rick") character.setVisible(false);
      this.characters.set(variant.id, character);
      this.characterLayer.addChild(character.container);
    }
  }

  handleEvent(event: NormalizedEvent) {
    this.timeSinceEvent = 0;
    this.setVisualState(event.visual_state);
    const characterId = getCharacterForEvent(event);
    const stationId = getStationForEvent(event);
    this.sendCharacter(characterId, stationId, getAnimationForEvent(event));

    if (event.event_type === "SessionStart") this.triggerStation("main-computer", palette.toxicGreen);
    if (event.event_type === "UserPromptSubmit") this.triggerStation("whiteboard", palette.warningAmber);
    if (event.event_type === "PreToolUse") this.triggerToolAnimation(event.tool_name ?? "tool", event.status);
    if (event.event_type === "PostToolUse") this.triggerToolAnimation(event.tool_name ?? "tool", event.status);
    if (event.event_type === "PermissionRequest") this.triggerPermissionAnimation();
    if (event.event_type === "PreCompact") this.triggerMemoryAnimation(true);
    if (event.event_type === "PostCompact") this.triggerMemoryAnimation(false);
    if (event.event_type === "SubagentStart") this.triggerSubagentAnimation(true);
    if (event.event_type === "SubagentStop") this.triggerSubagentAnimation(false);
    if (event.event_type === "PostToolUse" && event.status === "failure") this.triggerErrorAnimation(event.tool_name);
    if (event.event_type === "Stop") this.returnToIdle();
  }

  setVisualState(state: VisualState) {
    this.visualState = state;
    this.setRoomMood(getRoomMoodForVisualState(state));
  }

  setRoomMood(mood: RoomMood) {
    this.roomMood = mood;
    this.stations.setMood(mood);
    this.effects.setMood(mood);
  }

  setReducedMotion(reducedMotion: boolean) {
    this.reducedMotion = reducedMotion;
  }

  triggerStation(stationId: PixelStationId, color: number = palette.toxicGreen) {
    this.stations.setActive(stationId, stationId === "containment-door" ? "warning" : "active");
    this.effects.burstAtStation(stationId, color);
  }

  triggerToolAnimation(toolName: string, status: string) {
    const actor = getCharacterForTool(toolName);
    const station = this.stationForToolName(toolName);
    const failed = status === "failure" || status === "failed";
    this.sendCharacter(actor, station, failed ? "fail" : status === "success" ? "success" : "work");
    this.stations.setActive(station, failed ? "error" : "active");
    this.effects.burstAtStation(station, failed ? palette.errorRed : palette.toxicGreen, failed ? "glitch" : "spark");
  }

  triggerPermissionAnimation() {
    this.stations.setActive("containment-door", "warning");
    this.sendCharacter("paranoid-rick", "containment-door", "panic");
    this.effects.triggerWarningFlash();
  }

  triggerMemoryAnimation(active: boolean) {
    this.stations.setActive("memory-compressor", active ? "active" : "idle");
    this.sendCharacter("archivist-rick", "memory-compressor", active ? "work" : "success");
    if (active) this.effects.triggerMemoryPull();
    this.effects.burstAtStation("memory-compressor", active ? palette.portalViolet : palette.monitorCyan, "memory");
  }

  triggerSubagentAnimation(active: boolean) {
    const drone = this.characters.get("mini-rick-drone");
    if (!drone) return;
    drone.setVisible(true);
    this.stations.setActive("drone-bay", active ? "active" : "idle");
    this.sendCharacter("mini-rick-drone", active ? "main-computer" : "drone-bay", active ? "walk" : "docked");
    this.effects.triggerDroneTrail();
  }

  triggerErrorAnimation(toolName?: string | null) {
    const originalActor = getCharacterForTool(toolName);
    this.sendCharacter(originalActor, this.stationForToolName(toolName), "fail");
    const glitch = this.characters.get("glitch-rick");
    glitch?.setVisible(true);
    this.sendCharacter("glitch-rick", "error-zone", "fail");
    this.stations.setActive("test-rig", "error");
    this.effects.triggerGlitch();
  }

  tick(delta: number) {
    this.timeSinceEvent += delta;
    this.runDemoLife(delta);
    this.room.tick(delta);
    this.stations.tick(delta);
    this.effects.tick(delta);
    for (const character of this.characters.values()) {
      character.tick(delta, this.reducedMotion);
    }
    this.sortCharactersByDepth();
    if (Math.floor(this.timeSinceEvent) % 240 === 0) this.stations.clearTransientStates();
  }

  resize(width: number, height: number) {
    const scale = Math.max(1, Math.floor(Math.min(width / WORLD_WIDTH, height / WORLD_HEIGHT)));
    this.root.scale.set(scale);
    this.root.x = Math.floor((width - WORLD_WIDTH * scale) / 2);
    this.root.y = Math.floor((height - WORLD_HEIGHT * scale) / 2);
  }

  destroy() {
    this.app.stage.removeChild(this.root);
    this.root.destroy({ children: true });
  }

  private stationForToolName(toolName?: string | null): PixelStationId {
    const fakeEvent: NormalizedEvent = {
      event_type: "PreToolUse",
      visual_state: "TOOL_ARMING",
      session_id: "local",
      tool_name: toolName,
      status: "running",
      timestamp: new Date().toISOString(),
      safe_summary: "",
      metadata: {}
    };
    return getStationForEvent(fakeEvent);
  }

  private sendCharacter(characterId: PixelCharacterId, stationId: PixelStationId, action: Parameters<PixelCharacter["setAction"]>[0]) {
    const character = this.characters.get(characterId);
    if (!character) return;
    character.setVisible(true);
    character.moveTo(getStationPoint(stationId));
    character.setAction(action);
  }

  private returnToIdle() {
    for (const variant of Object.values(CHARACTER_VARIANTS)) {
      if (variant.id === "glitch-rick") {
        this.characters.get(variant.id)?.setVisible(false);
        continue;
      }
      this.sendCharacter(variant.id, variant.defaultStation, variant.id === "mini-rick-drone" ? "docked" : "idle");
    }
  }

  private runDemoLife(delta: number) {
    if (this.visualState !== "IDLE" && this.timeSinceEvent < 480) return;
    if (this.timeSinceEvent < 120) return;
    this.demoStep += delta;
    if (this.demoStep < 280) return;
    this.demoStep = 0;
    const cycle: Array<[PixelCharacterId, PixelStationId]> = [
      ["basement-rick", "strange-machine"],
      ["terminal-rick", "shell-terminal"],
      ["patch-rick", "patch-bench"],
      ["tester-rick", "test-rig"],
      ["archivist-rick", "memory-compressor"]
    ];
    const [character, station] = cycle[Math.floor(Math.random() * cycle.length)];
    this.sendCharacter(character, station, "walk");
    this.effects.burstAtStation(station, palette.monitorCyan, "spark");
  }

  private sortCharactersByDepth() {
    this.characterLayer.children.sort((a, b) => a.y - b.y);
  }
}
