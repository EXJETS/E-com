import { itemName } from "../core/items";
import { Npc } from "../npc/npc";
import { OBJECT_INFO, WorldObject } from "../world/objects";
import { Position } from "../world/position";
import type { GameEngine } from "./engine";
import { Recipe, burnChance } from "./recipes";

/**
 * Something the player is busy with. The engine walks them to the target first and then
 * calls tick() once per game tick until it returns false.
 */
export interface GameAction {
  readonly description: string;
  /** Where the action happens; combat re-reads this as the creature moves. */
  target(): Position;
  /** Most actions are worked from an adjacent tile; picking things up is not. */
  readonly requiresAdjacent: boolean;
  /** True when the target moves, so the engine re-paths every tick. */
  readonly chasesTarget: boolean;
  /** @returns true to keep going next tick, false when finished */
  tick(engine: GameEngine): boolean;
  onCancel?(engine: GameEngine): void;
}

/** A one-shot action: walk there, do the thing once, stop. */
export class SimpleAction implements GameAction {
  readonly chasesTarget = false;

  constructor(
    private readonly position: Position,
    readonly description: string,
    readonly requiresAdjacent: boolean,
    private readonly effect: (engine: GameEngine) => void,
  ) {}

  target(): Position {
    return this.position;
  }

  tick(engine: GameEngine): boolean {
    this.effect(engine);
    return false;
  }
}

/** Chopping a tree, mining a rock or fishing a spot: one loop with different numbers. */
export class HarvestAction implements GameAction {
  readonly requiresAdjacent = true;
  readonly chasesTarget = false;
  readonly description: string;

  constructor(private readonly node: WorldObject) {
    const info = OBJECT_INFO[node.type];
    this.description = `${info.action} ${info.name.toLowerCase()}`;
  }

  target(): Position {
    return this.node.position;
  }

  tick(engine: GameEngine): boolean {
    const info = this.node.info;
    const player = engine.player;
    if (this.node.isDepleted() || engine.world.objectAt(this.node.position) !== this.node) return false;
    if (!info.skill || !info.product || !info.toolType) return false;

    const level = player.skills.level(info.skill);
    if (level < info.levelRequired) {
      engine.message(`You need a ${info.skill} level of ${info.levelRequired} to do that.`);
      return false;
    }
    const tool = player.bestTool(info.toolType, info.skill);
    if (!tool) {
      engine.message(`You need ${toolPhrase(info.toolType)} to do that.`);
      return false;
    }
    if (!player.inventory.hasSpaceFor(info.product, 1)) {
      engine.message("Your inventory is too full to hold any more.");
      return false;
    }
    if (engine.random() < harvestChance(info.levelRequired, level, tool.toolTier)) {
      player.inventory.add(info.product, 1);
      engine.awardXp(info.skill, info.experience);
      engine.message(`You get some ${itemName(info.product).toLowerCase()}.`);
      this.node.deplete();
      if (this.node.isDepleted()) return false;
    }
    return true;
  }
}

/** Higher skill and better tools mean more successful swings per tick. */
export function harvestChance(levelRequired: number, level: number, toolTier: number): number {
  return Math.max(0.08, Math.min(0.85, (5 + (level - levelRequired) + toolTier * 3) / 40));
}

function toolPhrase(toolType: string): string {
  switch (toolType) {
    case "axe": return "an axe";
    case "pickaxe": return "a pickaxe";
    case "net": return "a small fishing net";
    case "rod": return "a fishing rod";
    default: return "the right tool";
  }
}

/** Fighting a creature until one side dies or the player walks away. */
export class CombatAction implements GameAction {
  readonly requiresAdjacent = true;
  readonly chasesTarget = true;
  readonly description: string;

  constructor(readonly npc: Npc) {
    this.description = `Attacking ${npc.name}`;
  }

  target(): Position {
    return this.npc.position;
  }

  tick(engine: GameEngine): boolean {
    if (!this.npc.isVisible() || this.npc.isDead()) return false;
    this.npc.setInCombat(true);
    if (engine.player.canAttackNow()) {
      engine.playerAttack(this.npc);
      engine.player.startAttackCooldown(engine.attackSpeedTicks);
    }
    return !this.npc.isDead();
  }

  onCancel(): void {
    this.npc.setInCombat(false);
  }
}

/**
 * A repeating crafting loop: consume inputs, produce an output and award experience, one
 * item every few ticks, until the inputs run out or the player stops.
 */
export class ProcessAction implements GameAction {
  readonly requiresAdjacent = true;
  readonly chasesTarget = false;
  readonly description: string;
  private delay = 0;

  constructor(
    private readonly position: Position,
    private readonly recipe: Recipe,
    private remaining: number,
  ) {
    this.description = recipe.name;
  }

  target(): Position {
    return this.position;
  }

  tick(engine: GameEngine): boolean {
    if (this.remaining <= 0) return false;
    const player = engine.player;
    if (player.skills.level(this.recipe.skill) < this.recipe.levelRequired) {
      engine.message(`You need a ${this.recipe.skill} level of ${this.recipe.levelRequired} to make that.`);
      return false;
    }
    for (const [id, count] of Object.entries(this.recipe.inputs)) {
      if (!player.inventory.contains(id, count)) {
        engine.message(`You have run out of ${itemName(id).toLowerCase()}.`);
        return false;
      }
    }
    if (this.delay > 0) {
      this.delay--;
      return true;
    }
    for (const [id, count] of Object.entries(this.recipe.inputs)) {
      player.inventory.remove(id, count);
    }
    const burnt = engine.random() < burnChance(this.recipe, player.skills.level(this.recipe.skill));
    if (burnt) {
      player.inventory.add("burnt_food", 1);
      engine.message(`You accidentally burn the ${itemName(this.recipe.output).toLowerCase()}.`);
    } else {
      player.inventory.add(this.recipe.output, 1);
      engine.awardXp(this.recipe.skill, this.recipe.experience);
      engine.message(`You make a ${itemName(this.recipe.output).toLowerCase()}.`);
    }
    this.remaining--;
    this.delay = this.recipe.ticksPerItem - 1;
    return this.remaining > 0;
  }
}
