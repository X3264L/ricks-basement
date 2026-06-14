import type { NormalizedEvent, VisualState } from "@/lib/eventTypes";
import { DroneLayer } from "./DroneLayer";
import { ParticleLayer } from "./ParticleLayer";
import { ReactorScene } from "./ReactorScene";
import { TerminalGlowLayer } from "./TerminalGlowLayer";

export class AnimationBus {
  constructor(
    private reactor: ReactorScene,
    private particles: ParticleLayer,
    private drones: DroneLayer,
    private terminals: TerminalGlowLayer
  ) {}

  setState(state: VisualState, droneCount: number) {
    this.reactor.setState(state);
    this.terminals.setState(state);
    this.drones.setDroneCount(droneCount);
  }

  emit(event: NormalizedEvent, droneCount: number) {
    this.setState(event.visual_state, droneCount);
    this.particles.burst(event.visual_state);
  }
}
