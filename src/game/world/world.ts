import { Npc } from "../npc/npc";
import { GroundItem, WorldObject } from "./objects";
import { Position, posKey, samePosition, translate } from "./position";
import { TILE_INFO, TileType } from "./tiles";

/** The tile grid plus everything standing on it. */
export class World {
  readonly objects = new Map<string, WorldObject>();
  readonly npcs: Npc[] = [];
  readonly groundItems: GroundItem[] = [];

  constructor(
    readonly name: string,
    readonly width: number,
    readonly height: number,
    private readonly tiles: TileType[][],
    readonly spawn: Position,
  ) {}

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  tile(x: number, y: number): TileType {
    return this.inBounds(x, y) ? this.tiles[y][x] : "wall";
  }

  tileAt(position: Position): TileType {
    return this.tile(position.x, position.y);
  }

  isWalkable(position: Position): boolean {
    const { x, y } = position;
    if (!this.inBounds(x, y) || !TILE_INFO[this.tiles[y][x]].walkable) return false;
    const object = this.objects.get(posKey(position));
    return !object || !object.blocksMovement();
  }

  addObject(object: WorldObject): void {
    this.objects.set(posKey(object.position), object);
  }

  objectAt(position: Position): WorldObject | null {
    return this.objects.get(posKey(position)) ?? null;
  }

  removeObject(position: Position): void {
    this.objects.delete(posKey(position));
  }

  npcAt(position: Position): Npc | null {
    return this.npcs.find((npc) => npc.isVisible() && samePosition(npc.position, position)) ?? null;
  }

  addGroundItem(item: GroundItem): void {
    this.groundItems.push(item);
  }

  groundItemAt(position: Position): GroundItem | null {
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      if (samePosition(this.groundItems[i].position, position)) return this.groundItems[i];
    }
    return null;
  }

  removeGroundItem(item: GroundItem): void {
    const index = this.groundItems.indexOf(item);
    if (index >= 0) this.groundItems.splice(index, 1);
  }

  /** Advances respawn timers, burns fires down and despawns dropped loot. */
  tick(): void {
    for (const [key, object] of this.objects) {
      if (!object.tick()) this.objects.delete(key);
    }
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      if (!this.groundItems[i].tick()) this.groundItems.splice(i, 1);
    }
  }

  /** The closest walkable tile to a blocked destination. */
  nearestWalkable(target: Position, maxRadius: number): Position | null {
    if (this.isWalkable(target)) return target;
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const candidate = translate(target, dx, dy);
          if (this.isWalkable(candidate)) return candidate;
        }
      }
    }
    return null;
  }
}
