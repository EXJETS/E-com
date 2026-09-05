import { NpcDef } from "./defs";
import { Position, distance } from "../world/position";

/** A spawned creature: where it stands, how hurt it is and what it is doing. */
export class Npc {
  position: Position;
  private hp: number;
  private respawnTimer = 0;
  private attackCooldown = 0;
  private fighting = false;
  private damageShown = -1;
  private hitsplatTimer = 0;

  constructor(readonly def: NpcDef, readonly spawn: Position, readonly wanderRadius: number) {
    this.position = spawn;
    this.hp = def.hitpoints;
  }

  get name(): string {
    return this.def.name;
  }

  hitpoints(): number {
    return this.hp;
  }

  maxHitpoints(): number {
    return this.def.hitpoints;
  }

  damage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
    this.damageShown = amount;
    this.hitsplatTimer = 3;
  }

  isDead(): boolean {
    return this.hp <= 0;
  }

  /** Dead creatures stay out of the world until their respawn timer elapses. */
  isVisible(): boolean {
    return this.respawnTimer <= 0;
  }

  kill(): void {
    this.respawnTimer = this.def.respawnTicks;
    this.fighting = false;
    this.attackCooldown = 0;
  }

  tickTimers(): void {
    if (this.respawnTimer > 0 && --this.respawnTimer === 0) {
      this.hp = this.def.hitpoints;
      this.position = this.spawn;
    }
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitsplatTimer > 0 && --this.hitsplatTimer === 0) this.damageShown = -1;
  }

  canAttackNow(): boolean {
    return this.attackCooldown <= 0;
  }

  startAttackCooldown(ticks: number): void {
    this.attackCooldown = ticks;
  }

  isInCombat(): boolean {
    return this.fighting;
  }

  setInCombat(fighting: boolean): void {
    this.fighting = fighting;
  }

  /** The damage number floating over the creature, or -1 when there is none. */
  lastDamage(): number {
    return this.damageShown;
  }

  isWithinWanderRange(candidate: Position): boolean {
    return distance(candidate, this.spawn) <= Math.max(this.wanderRadius, 1);
  }
}
