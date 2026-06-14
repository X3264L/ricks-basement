import { Application, Container } from "pixi.js";
import type { NormalizedEvent, RoomMood, VisualState } from "@/lib/eventTypes";
import { ROOM_HEIGHT, ROOM_STATIONS, ROOM_WIDTH, getStationPoint } from "./RoomMap";
import { PixelProps } from "./PixelProps";
import { getCharacterForEvent, getRoomMoodForVisualState, getStationForEvent } from "./pixelLogic";
import { PixelCharacter } from "./sprites/PixelCharacter";
import { CHARACTER_VARIANTS } from "./sprites/CharacterVariants";

export class PixelBasementScene {
  private readonly root = new Container();
  private readonly props = new PixelProps();
  private readonly characters = new Map<string, PixelCharacter>();
  private visualState: VisualState = "IDLE";
  private roomMood: RoomMood = "sleepy";
  private reducedMotion = false;

  constructor(private readonly app: Application) {
    this.app.stage.addChild(this.root);
    this.root.addChild(this.props.container);

    for (const variant of Object.values(CHARACTER_VARIANTS)) {
      const character = new PixelCharacter(variant, getStationPoint(variant.defaultStation));
      if (variant.id === "glitch-rick" || variant.id === "mini-rick-drone") {
        character.setVisible(false);
      }
      this.characters.set(variant.id, character);
      this.root.addChild(character.container);
    }

    this.resize(this.app.screen.width, this.app.screen.height);
  }

  handleEvent(event: NormalizedEvent) {
    this.setVisualState(event.visual_state);
    const characterId = getCharacterForEvent(event);
    const stationId = getStationForEvent(event);
    const character = this.characters.get(characterId);
    if (character) {
      character.setVisible(true);
      character.moveTo(getStationPoint(stationId));
      character.setAction(event.event_type === "PostToolUse" && event.status === "failure" ? "fail" : "work");
    }

    if (event.event_type === "SessionStart") this.triggerStation("main-terminal", 0x86efac);
    if (event.event_type === "UserPromptSubmit") this.triggerStation("whiteboard", 0xfacc15);
    if (event.event_type === "PreToolUse") this.triggerToolAnimation(event.tool_name ?? "tool", event.status);
    if (event.event_type === "PostToolUse") this.triggerToolAnimation(event.tool_name ?? "tool", event.status);
    if (event.event_type === "PermissionRequest") this.triggerPermissionAnimation();
    if (event.event_type === "PreCompact" || event.event_type === "PostCompact") this.triggerMemoryAnimation();
    if (event.event_type === "SubagentStart" || event.event_type === "SubagentStop") {
      this.triggerSubagentAnimation(event.event_type === "SubagentStart");
    }
    if (event.event_type === "Stop") this.returnToIdle();
  }

  setVisualState(state: VisualState) {
    this.visualState = state;
    this.setRoomMood(getRoomMoodForVisualState(state));
  }

  setRoomMood(mood: RoomMood) {
    this.roomMood = mood;
    this.props.setMood(mood);
  }

  setReducedMotion(reducedMotion: boolean) {
    this.reducedMotion = reducedMotion;
  }

  triggerToolAnimation(toolName: string, status: string) {
    const stationId = getStationForEvent({
      event_type: status === "failure" ? "PostToolUse" : "PreToolUse",
      visual_state: status === "failure" ? "TOOL_FAILED" : "TOOL_ARMING",
      session_id: "local",
      tool_name: toolName,
      status,
      timestamp: new Date().toISOString(),
      safe_summary: "",
      metadata: {}
    });
    this.triggerStation(stationId, status === "failure" ? 0xff4d6d : 0x86efac);
  }

  triggerPermissionAnimation() {
    this.triggerStation("containment-door", 0xff4d6d);
    this.characters.get("paranoid-rick")?.setAction("panic");
  }

  triggerMemoryAnimation() {
    this.triggerStation("memory-compressor", 0x2dd4bf);
    this.characters.get("archivist-rick")?.setAction("work");
  }

  triggerSubagentAnimation(active: boolean) {
    const drone = this.characters.get("mini-rick-drone");
    if (!drone) return;
    drone.setVisible(true);
    drone.moveTo(getStationPoint(active ? "main-terminal" : "drone-bay"));
    drone.setAction(active ? "walk" : "sleep");
    this.triggerStation("drone-bay", 0x60a5fa);
  }

  tick(delta: number) {
    this.props.tick(delta);
    for (const character of this.characters.values()) {
      character.tick(delta, this.reducedMotion);
    }
  }

  resize(width: number, height: number) {
    const scale = Math.min(width / ROOM_WIDTH, height / ROOM_HEIGHT);
    this.root.scale.set(scale);
    this.root.x = Math.floor((width - ROOM_WIDTH * scale) / 2);
    this.root.y = Math.floor((height - ROOM_HEIGHT * scale) / 2);
  }

  destroy() {
    this.app.stage.removeChild(this.root);
    this.root.destroy({ children: true });
  }

  private triggerStation(stationId: keyof typeof ROOM_STATIONS, color: number) {
    this.props.triggerStation(stationId, color);
  }

  private returnToIdle() {
    for (const character of this.characters.values()) {
      character.setAction("idle");
    }
    this.characters.get("basement-rick")?.moveTo(getStationPoint("idle-couch"));
  }
}
