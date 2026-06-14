import { Container, Graphics } from "pixi.js";
import type { PixelStationId, RoomMood } from "@/lib/eventTypes";
import { ROOM_HEIGHT, ROOM_STATIONS, ROOM_WIDTH } from "./RoomMap";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: number;
};

export class PixelProps {
  readonly container = new Container();
  private background = new Graphics();
  private props = new Graphics();
  private effects = new Graphics();
  private mood: RoomMood = "sleepy";
  private activeStation: PixelStationId | null = null;
  private time = 0;
  private sparks: Spark[] = [];

  constructor() {
    this.container.addChild(this.background, this.props, this.effects);
    this.drawBackground();
  }

  setMood(mood: RoomMood) {
    this.mood = mood;
  }

  triggerStation(station: PixelStationId, color = 0x7dd3fc) {
    this.activeStation = station;
    const point = ROOM_STATIONS[station];
    for (let i = 0; i < 18; i += 1) {
      this.sparks.push({
        x: point.x,
        y: point.y - 28,
        vx: -1.5 + Math.random() * 3,
        vy: -2 - Math.random() * 2,
        life: 1,
        color
      });
    }
  }

  tick(delta: number) {
    this.time += delta / 12;
    this.drawProps();
    this.drawEffects(delta);
  }

  private drawBackground() {
    this.background.clear();
    this.background.rect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    this.background.fill({ color: 0x1f1b24 });
    this.background.rect(0, 0, ROOM_WIDTH, 248);
    this.background.fill({ color: 0x2f2735 });
    this.background.rect(0, 248, ROOM_WIDTH, ROOM_HEIGHT - 248);
    this.background.fill({ color: 0x34261f });

    for (let x = 0; x < ROOM_WIDTH; x += 32) {
      this.background.rect(x, 248, 16, ROOM_HEIGHT - 248);
      this.background.fill({ color: 0x3b2c24, alpha: 0.34 });
    }
    for (let y = 272; y < ROOM_HEIGHT; y += 32) {
      this.background.rect(0, y, ROOM_WIDTH, 4);
      this.background.fill({ color: 0x251b18, alpha: 0.5 });
    }
  }

  private drawMachine(x: number, y: number, width: number, height: number, color: number) {
    this.props.rect(x, y, width, height);
    this.props.fill({ color: 0x171717 });
    this.props.rect(x + 8, y + 8, width - 16, height - 16);
    this.props.fill({ color });
    this.props.rect(x + 14, y + height - 18, width - 28, 6);
    this.props.fill({ color: 0x000000, alpha: 0.4 });
  }

  private drawProps() {
    this.props.clear();
    const warning = this.mood === "warning";
    const memory = this.mood === "memory";
    const glitch = this.mood === "glitch";
    const blink = Math.sin(this.time * 5) > 0;
    const activeColor = warning ? 0xff4d6d : memory ? 0x2dd4bf : glitch ? 0xf472b6 : 0x86efac;

    this.props.rect(176, 86, 188, 82);
    this.props.fill({ color: 0xd7f7c2 });
    this.props.rect(188, 100, 86, 6);
    this.props.fill({ color: 0x334155 });
    this.props.rect(188, 118, 138, 6);
    this.props.fill({ color: 0x334155 });
    this.props.rect(188, 138, 108, 6);
    this.props.fill({ color: 0x334155 });

    this.drawMachine(390, 88, 190, 140, 0x0f766e);
    this.props.rect(434, 114, 102, 52);
    this.props.fill({ color: blink ? activeColor : 0x083344 });
    this.props.rect(454, 238, 62, 22);
    this.props.fill({ color: 0x111827 });

    this.drawMachine(706, 206, 124, 110, 0x075985);
    this.drawMachine(650, 352, 112, 74, 0x581c87);
    this.drawMachine(784, 352, 112, 74, 0x854d0e);
    this.drawMachine(142, 188, 130, 112, memory ? 0x14b8a6 : 0x3f3f46);

    this.props.rect(28, 182, 96, 186);
    this.props.fill({ color: warning && blink ? 0x7f1d1d : 0x27272a });
    this.props.rect(42, 210, 68, 120);
    this.props.fill({ color: warning ? 0xff4d6d : 0x52525b });
    this.props.rect(55, 252, 42, 10);
    this.props.fill({ color: 0x09090b });

    this.props.rect(838, 96, 86, 76);
    this.props.fill({ color: 0x1e293b });
    this.props.rect(852, 112, 58, 18);
    this.props.fill({ color: blink ? 0x60a5fa : 0x1d4ed8 });

    this.props.rect(92, 396, 104, 36);
    this.props.fill({ color: 0x4b5563 });
    this.props.rect(118, 368, 56, 30);
    this.props.fill({ color: 0x78350f });
    this.props.rect(418, 416, 80, 8);
    this.props.fill({ color: 0x22c55e });
    this.props.rect(510, 430, 110, 8);
    this.props.fill({ color: 0xeab308 });
    this.props.rect(240, 430, 34, 20);
    this.props.fill({ color: 0xb45309 });
    this.props.rect(284, 438, 22, 12);
    this.props.fill({ color: 0x991b1b });

    if (this.activeStation) {
      const station = ROOM_STATIONS[this.activeStation];
      this.props.rect(station.x - 28, station.y - 14, 56, 8);
      this.props.fill({ color: activeColor, alpha: 0.45 });
    }
  }

  private drawEffects(delta: number) {
    this.effects.clear();
    this.sparks = this.sparks
      .map((spark) => ({
        ...spark,
        x: spark.x + spark.vx * delta,
        y: spark.y + spark.vy * delta,
        vy: spark.vy + 0.08 * delta,
        life: spark.life - 0.025 * delta
      }))
      .filter((spark) => spark.life > 0);

    for (const spark of this.sparks) {
      this.effects.rect(spark.x, spark.y, 5, 5);
      this.effects.fill({ color: spark.color, alpha: spark.life });
    }
  }
}
