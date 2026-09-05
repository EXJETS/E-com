import { AttackStyle } from "../combat/formulas";
import { Equipment } from "./equipment";
import { Bank } from "./bank";
import { Inventory } from "./inventory";
import { ItemDef, ToolType, itemDef } from "./items";
import { SkillType, Skills } from "./skills";
import { Position } from "../world/position";

export const MAX_RUN_ENERGY = 100;

/** The character: where they are walking, what they carry and how well trained they are. */
export class Player {
  name = "Adventurer";
  position: Position;
  path: Position[] = [];
  readonly skills = new Skills();
  readonly inventory = new Inventory();
  readonly bank = new Bank();
  readonly equipment = new Equipment();

  attackStyle: AttackStyle = "aggressive";
  runToggled = true;
  runEnergy = MAX_RUN_ENERGY;
  questStage = 0;
  deaths = 0;

  private attackCooldown = 0;
  private damageShown = -1;
  private hitsplatTimer = 0;

  constructor(position: Position) {
    this.position = position;
  }

  isMoving(): boolean {
    return this.path.length > 0;
  }

  clearPath(): void {
    this.path = [];
  }

  isRunning(): boolean {
    return this.runToggled && this.runEnergy > 0;
  }

  setRunEnergy(energy: number): void {
    this.runEnergy = Math.max(0, Math.min(MAX_RUN_ENERGY, energy));
  }

  canAttackNow(): boolean {
    return this.attackCooldown <= 0;
  }

  startAttackCooldown(ticks: number): void {
    this.attackCooldown = ticks;
  }

  tickTimers(): void {
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitsplatTimer > 0 && --this.hitsplatTimer === 0) this.damageShown = -1;
  }

  takeDamage(amount: number): void {
    this.skills.damage(amount);
    this.damageShown = amount;
    this.hitsplatTimer = 3;
  }

  lastDamage(): number {
    return this.damageShown;
  }

  /** The best tool of a kind the player can actually use, or null if they have none. */
  bestTool(toolType: ToolType, skill: SkillType): ItemDef | null {
    let best: ItemDef | null = null;
    const consider = (id: string) => {
      const def = itemDef(id);
      if (def.toolType !== toolType || def.toolTier > this.skills.level(skill)) return;
      if (!best || def.toolTier > best.toolTier) best = def;
    };
    this.inventory.distinctIds().forEach(consider);
    this.equipment.entries().forEach(([, id]) => consider(id));
    return best;
  }
}
