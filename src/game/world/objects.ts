import { SkillType } from "../core/skills";
import { ToolType } from "../core/items";
import { Position } from "./position";

export type ObjectType =
  | "tree" | "oak" | "willow"
  | "copper_rock" | "tin_rock" | "iron_rock" | "coal_rock"
  | "shrimp_spot" | "trout_spot"
  | "furnace" | "anvil" | "bank_booth" | "range" | "fire" | "shop_counter" | "door";

export interface ObjectInfo {
  symbol: string;
  name: string;
  /** The verb shown in menus, such as "Chop down". */
  action: string;
  skill?: SkillType;
  levelRequired: number;
  experience: number;
  product?: string;
  /** Ticks before a depleted node returns; 0 means it never depletes. */
  respawnTicks: number;
  toolType?: ToolType;
  blocks: boolean;
}

export const OBJECT_INFO: Record<ObjectType, ObjectInfo> = {
  tree: { symbol: "T", name: "Tree", action: "Chop down", skill: "woodcutting", levelRequired: 1,
    experience: 25, product: "logs", respawnTicks: 12, toolType: "axe", blocks: true },
  oak: { symbol: "O", name: "Oak tree", action: "Chop down", skill: "woodcutting", levelRequired: 15,
    experience: 37, product: "oak_logs", respawnTicks: 20, toolType: "axe", blocks: true },
  willow: { symbol: "W", name: "Willow tree", action: "Chop down", skill: "woodcutting", levelRequired: 30,
    experience: 67, product: "willow_logs", respawnTicks: 25, toolType: "axe", blocks: true },
  copper_rock: { symbol: "c", name: "Copper rocks", action: "Mine", skill: "mining", levelRequired: 1,
    experience: 17, product: "copper_ore", respawnTicks: 8, toolType: "pickaxe", blocks: true },
  tin_rock: { symbol: "t", name: "Tin rocks", action: "Mine", skill: "mining", levelRequired: 1,
    experience: 17, product: "tin_ore", respawnTicks: 8, toolType: "pickaxe", blocks: true },
  iron_rock: { symbol: "i", name: "Iron rocks", action: "Mine", skill: "mining", levelRequired: 15,
    experience: 35, product: "iron_ore", respawnTicks: 14, toolType: "pickaxe", blocks: true },
  coal_rock: { symbol: "k", name: "Coal rocks", action: "Mine", skill: "mining", levelRequired: 30,
    experience: 50, product: "coal", respawnTicks: 30, toolType: "pickaxe", blocks: true },
  shrimp_spot: { symbol: "f", name: "Fishing spot", action: "Net", skill: "fishing", levelRequired: 1,
    experience: 10, product: "raw_shrimp", respawnTicks: 0, toolType: "net", blocks: false },
  trout_spot: { symbol: "F", name: "Fishing spot", action: "Lure", skill: "fishing", levelRequired: 20,
    experience: 50, product: "raw_trout", respawnTicks: 0, toolType: "rod", blocks: false },
  furnace: { symbol: "U", name: "Furnace", action: "Smelt", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: true },
  anvil: { symbol: "A", name: "Anvil", action: "Smith", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: true },
  bank_booth: { symbol: "B", name: "Bank booth", action: "Bank", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: true },
  range: { symbol: "R", name: "Range", action: "Cook", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: true },
  fire: { symbol: "*", name: "Fire", action: "Cook", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: true },
  shop_counter: { symbol: "C", name: "Shop counter", action: "Trade", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: false },
  door: { symbol: "D", name: "Doorway", action: "Walk through", levelRequired: 0, experience: 0, respawnTicks: 0, blocks: false },
};

const BY_SYMBOL = new Map<string, ObjectType>(
  (Object.keys(OBJECT_INFO) as ObjectType[]).map((type) => [OBJECT_INFO[type].symbol, type]),
);

export function objectFromSymbol(symbol: string): ObjectType | null {
  return BY_SYMBOL.get(symbol) ?? null;
}

export function isResource(type: ObjectType): boolean {
  return OBJECT_INFO[type].skill !== undefined;
}

/** A specific tree, rock, anvil or fire standing in the world. */
export class WorldObject {
  private respawnTimer = 0;
  private lifeTimer = -1;

  constructor(readonly type: ObjectType, readonly position: Position) {}

  get info(): ObjectInfo {
    return OBJECT_INFO[this.type];
  }

  isDepleted(): boolean {
    return this.respawnTimer > 0;
  }

  deplete(): void {
    if (this.info.respawnTicks > 0) this.respawnTimer = this.info.respawnTicks;
  }

  /** Fires burn out; a positive number of ticks makes the object temporary. */
  setLifeTimer(ticks: number): void {
    this.lifeTimer = ticks;
  }

  /** @returns true while the object should stay in the world */
  tick(): boolean {
    if (this.respawnTimer > 0) this.respawnTimer--;
    if (this.lifeTimer > 0) this.lifeTimer--;
    return this.lifeTimer !== 0;
  }

  blocksMovement(): boolean {
    return this.info.blocks;
  }
}

/** An item lying on a tile, dropped by the player or left behind by a kill. */
export class GroundItem {
  private timer = 300;

  constructor(readonly itemId: string, readonly count: number, readonly position: Position) {}

  /** @returns true while the item is still on the ground */
  tick(): boolean {
    return --this.timer > 0;
  }
}
