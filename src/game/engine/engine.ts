import { EquipSlot, itemDef, itemName } from "../core/items";
import { INVENTORY_CAPACITY } from "../core/inventory";
import { MAX_RUN_ENERGY, Player } from "../core/player";
import { SKILL_INFO, SkillType } from "../core/skills";
import { AttackStyle, nextStyle, rating, rollDamage, styleBoost, STYLE_INFO } from "../combat/formulas";
import { Npc } from "../npc/npc";
import { npcCombatLevel, rollDrops } from "../npc/defs";
import { GroundItem, WorldObject } from "../world/objects";
import { Position, distance, samePosition, translate } from "../world/position";
import { findPath } from "../world/pathfinder";
import { World } from "../world/world";
import { CombatAction, GameAction, HarvestAction, ProcessAction, SimpleAction } from "./actions";
import { COOKING, FIREMAKING, SMELTING, SMITHING } from "./recipes";
import {
  QUEST_COMPLETE,
  QUEST_NAME,
  QUEST_NOT_STARTED,
  QUEST_REQUIREMENTS,
  QUEST_REWARD_COINS,
  QUEST_REWARD_COOKING_XP,
  QUEST_STARTED,
  hasQuestIngredients,
  takeQuestIngredients,
} from "./quest";
import { buyPrice, sellPrice } from "./shop";

export const TICK_MS = 600;

/** Hooks for the interface; the engine itself never touches the DOM. */
export interface GameEvents {
  onMessage?(message: string): void;
  onOpenBank?(): void;
  onOpenShop?(npc: Npc): void;
  onOpenSmelting?(furnace: Position): void;
  onOpenSmithing?(anvil: Position): void;
  onOpenCooking?(range: Position): void;
  onDialogue?(npc: Npc, lines: string[]): void;
  onLevelUp?(skill: SkillType, level: number): void;
  onDeath?(): void;
}

const REGEN_INTERVAL_TICKS = 100;
const AGGRESSION_RANGE = 4;
const LEASH_RANGE = 12;
const MAX_MESSAGES = 200;

/**
 * The simulation. Everything happens on a 600ms tick: the player walks, works or fights,
 * creatures wander and retaliate, resources respawn and dropped loot rots away.
 */
export class GameEngine {
  readonly attackSpeedTicks = 4;
  readonly messages: string[] = [];
  events: GameEvents = {};
  tickCount = 0;

  private action: GameAction | null = null;

  constructor(
    readonly world: World,
    readonly player: Player,
    readonly random: () => number = Math.random,
  ) {}

  currentAction(): GameAction | null {
    return this.action;
  }

  message(text: string): void {
    this.messages.push(text);
    while (this.messages.length > MAX_MESSAGES) this.messages.shift();
    this.events.onMessage?.(text);
  }

  // ---------------------------------------------------------------- ticking

  tick(): void {
    this.tickCount++;
    this.player.tickTimers();
    this.processMovement();
    this.processAction();
    this.processNpcs();
    this.world.tick();
    this.regenerate();
    if (this.player.skills.isDead()) this.handlePlayerDeath();
  }

  private processMovement(): void {
    const running = this.player.isRunning();
    const steps = running ? 2 : 1;
    let moved = false;
    for (let i = 0; i < steps && this.player.path.length > 0; i++) {
      const next = this.player.path[0];
      if (!this.world.isWalkable(next)) {
        this.player.clearPath();
        break;
      }
      this.player.path.shift();
      this.player.position = next;
      moved = true;
    }
    if (moved && running) this.player.setRunEnergy(this.player.runEnergy - 1);
    else if (!moved && this.tickCount % 2 === 0) this.player.setRunEnergy(this.player.runEnergy + 1);
  }

  private processAction(): void {
    if (!this.action) return;
    const target = this.action.target();
    const inRange = this.action.requiresAdjacent
      ? distance(this.player.position, target) <= 1
      : samePosition(this.player.position, target);
    if (inRange) {
      this.player.clearPath();
      if (!this.action.tick(this)) this.stopAction();
      return;
    }
    if (this.action.chasesTarget || !this.player.isMoving()) {
      const path = findPath(this.world, this.player.position, target, this.action.requiresAdjacent);
      if (path.length === 0) {
        this.message("I can't reach that.");
        this.stopAction();
        return;
      }
      this.player.path = path;
    }
  }

  private processNpcs(): void {
    for (const npc of this.world.npcs) {
      npc.tickTimers();
      if (!npc.isVisible()) continue;
      if (npc.isInCombat()) {
        this.fightPlayer(npc);
      } else if (
        npc.def.aggressive &&
        distance(npc.position, this.player.position) <= AGGRESSION_RANGE &&
        npcCombatLevel(npc.def) * 2 >= this.player.skills.combatLevel()
      ) {
        npc.setInCombat(true);
        this.message(`${npc.name} lunges at you!`);
      } else {
        this.wander(npc);
      }
    }
  }

  private fightPlayer(npc: Npc): void {
    const gap = distance(npc.position, this.player.position);
    if (gap > LEASH_RANGE) {
      npc.setInCombat(false);
      npc.position = npc.spawn;
      return;
    }
    if (gap <= 1) {
      if (npc.canAttackNow()) {
        this.npcAttack(npc);
        npc.startAttackCooldown(this.attackSpeedTicks);
      }
      return;
    }
    this.stepTowards(npc, this.player.position);
  }

  private wander(npc: Npc): void {
    if (this.random() > 0.18) return;
    const dx = Math.floor(this.random() * 3) - 1;
    const dy = Math.floor(this.random() * 3) - 1;
    const candidate = translate(npc.position, dx, dy);
    if (this.world.isWalkable(candidate) && npc.isWithinWanderRange(candidate)) {
      npc.position = candidate;
    }
  }

  private stepTowards(npc: Npc, target: Position): void {
    const dx = Math.sign(target.x - npc.position.x);
    const dy = Math.sign(target.y - npc.position.y);
    const diagonal = translate(npc.position, dx, dy);
    if (this.world.isWalkable(diagonal)) {
      npc.position = diagonal;
      return;
    }
    const horizontal = translate(npc.position, dx, 0);
    if (dx !== 0 && this.world.isWalkable(horizontal)) {
      npc.position = horizontal;
      return;
    }
    const vertical = translate(npc.position, 0, dy);
    if (dy !== 0 && this.world.isWalkable(vertical)) npc.position = vertical;
  }

  private regenerate(): void {
    if (
      this.tickCount % REGEN_INTERVAL_TICKS === 0 &&
      this.player.skills.currentHitpoints() < this.player.skills.maxHitpoints()
    ) {
      this.player.skills.heal(1);
    }
  }

  // ---------------------------------------------------------------- combat

  playerAttack(npc: Npc): void {
    const style = this.player.attackStyle;
    const attackRating = rating(
      this.player.skills.level("attack") + styleBoost(style, "attack"),
      this.player.equipment.attackBonus(),
    );
    const defenceRating = rating(npc.def.defenceLevel, npc.def.defenceBonus);
    const damage = rollDamage(
      this.random,
      attackRating,
      defenceRating,
      this.player.skills.level("strength") + styleBoost(style, "strength"),
      this.player.equipment.strengthBonus(),
    );
    npc.damage(damage);
    npc.setInCombat(true);
    if (damage > 0) this.awardCombatXp(damage);
    if (npc.isDead()) this.handleNpcDeath(npc);
  }

  private npcAttack(npc: Npc): void {
    const attackRating = rating(npc.def.attackLevel, npc.def.attackBonus);
    const defenceRating = rating(
      this.player.skills.level("defence") + styleBoost(this.player.attackStyle, "defence"),
      this.player.equipment.defenceBonus(),
    );
    const damage = rollDamage(this.random, attackRating, defenceRating, npc.def.strengthLevel, npc.def.strengthBonus);
    this.player.takeDamage(damage);
  }

  private awardCombatXp(damage: number): void {
    const trained = STYLE_INFO[this.player.attackStyle].trains;
    if (trained) {
      this.awardXp(trained, damage * 4);
    } else {
      this.awardXp("attack", Math.round(damage * 1.33));
      this.awardXp("strength", Math.round(damage * 1.33));
      this.awardXp("defence", Math.round(damage * 1.33));
    }
    this.awardXp("hitpoints", Math.round(damage * 1.33));
  }

  private handleNpcDeath(npc: Npc): void {
    this.message(`You defeat the ${npc.name.toLowerCase()}.`);
    for (const drop of rollDrops(npc.def.drops, this.random)) {
      this.world.addGroundItem(new GroundItem(drop.itemId, Math.max(1, drop.count), npc.position));
    }
    npc.kill();
    if (this.action instanceof CombatAction && this.action.npc === npc) this.stopAction();
  }

  private handlePlayerDeath(): void {
    this.message("Oh dear, you are dead!");
    this.player.deaths++;
    this.stopAction();
    this.player.clearPath();
    this.player.position = this.world.spawn;
    this.player.skills.setCurrentHitpoints(this.player.skills.maxHitpoints());
    this.player.setRunEnergy(MAX_RUN_ENERGY);
    for (const npc of this.world.npcs) npc.setInCombat(false);
    this.message("You wake up back in Ashvale, shaken but whole.");
    this.events.onDeath?.();
  }

  // ---------------------------------------------------------------- progression

  awardXp(skill: SkillType, amount: number): void {
    const gained = this.player.skills.addXp(skill, amount);
    if (gained > 0) {
      const level = this.player.skills.level(skill);
      this.message(`Congratulations, your ${SKILL_INFO[skill].name} level is now ${level}!`);
      this.events.onLevelUp?.(skill, level);
    }
  }

  // ---------------------------------------------------------------- commands

  /** Toggles running; kept on the engine so the interface never mutates its state directly. */
  toggleRun(): boolean {
    this.player.runToggled = !this.player.runToggled;
    this.message(`Running is now ${this.player.runToggled ? "on" : "off"}.`);
    return this.player.runToggled;
  }

  /** Cycles to the next attack style and reports the new one. */
  cycleAttackStyle(): AttackStyle {
    this.player.attackStyle = nextStyle(this.player.attackStyle);
    this.message(`Attack style: ${STYLE_INFO[this.player.attackStyle].name}.`);
    return this.player.attackStyle;
  }

  walkTo(destination: Position): void {
    this.stopAction();
    const goal = this.world.isWalkable(destination) ? destination : this.world.nearestWalkable(destination, 3);
    if (!goal) {
      this.message("You can't walk there.");
      return;
    }
    const path = findPath(this.world, this.player.position, goal, false);
    if (path.length === 0 && !samePosition(this.player.position, goal)) {
      this.message("You can't reach there.");
      return;
    }
    this.player.path = path;
  }

  setAction(action: GameAction): void {
    this.stopAction();
    this.action = action;
    this.player.clearPath();
  }

  stopAction(): void {
    this.action?.onCancel?.(this);
    this.action = null;
  }

  /** Clicking a piece of scenery. */
  interact(object: WorldObject): void {
    const info = object.info;
    if (info.skill) {
      if (object.isDepleted()) {
        this.message("There is nothing left to gather here.");
        return;
      }
      this.setAction(new HarvestAction(object));
      return;
    }
    const position = object.position;
    switch (object.type) {
      case "bank_booth":
        this.setAction(new SimpleAction(position, "Banking", true, (engine) => {
          engine.message("You open your bank account.");
          engine.events.onOpenBank?.();
        }));
        break;
      case "furnace":
        this.setAction(new SimpleAction(position, "Smelting", true, (engine) =>
          engine.events.onOpenSmelting?.(position)));
        break;
      case "anvil":
        this.setAction(new SimpleAction(position, "Smithing", true, (engine) =>
          engine.events.onOpenSmithing?.(position)));
        break;
      case "range":
      case "fire":
        this.setAction(new SimpleAction(position, "Cooking", true, (engine) =>
          engine.events.onOpenCooking?.(position)));
        break;
      case "shop_counter":
        this.setAction(new SimpleAction(position, "Trading", true, (engine) => {
          const keeper = engine.world.npcs.find((npc) => npc.def.shopkeeper);
          if (keeper) engine.events.onOpenShop?.(keeper);
          else engine.message("Nobody is behind the counter.");
        }));
        break;
      case "door":
        this.walkTo(position);
        break;
      default:
        this.message("Nothing interesting happens.");
    }
  }

  attack(npc: Npc): void {
    if (!npc.def.attackable) {
      this.message(`You can't attack ${npc.name}.`);
      return;
    }
    this.setAction(new CombatAction(npc));
  }

  talkTo(npc: Npc): void {
    this.setAction(new SimpleAction(npc.position, `Talking to ${npc.name}`, true, (engine) => {
      if (npc.def.shopkeeper) {
        engine.events.onOpenShop?.(npc);
      } else {
        const lines = npc.def.key === "aldric" ? engine.talkToAldric() : npc.def.dialogue;
        engine.events.onDialogue?.(npc, lines.length > 0 ? lines : ["..."]);
      }
    }));
  }

  pickUp(item: GroundItem): void {
    this.setAction(new SimpleAction(item.position, "Picking up", false, (engine) => {
      if (!engine.world.groundItems.includes(item)) return;
      if (!engine.player.inventory.hasSpaceFor(item.itemId, item.count)) {
        engine.message("You don't have enough inventory space.");
        return;
      }
      engine.player.inventory.add(item.itemId, item.count);
      engine.world.removeGroundItem(item);
      engine.message(`You pick up ${itemName(item.itemId).toLowerCase()}.`);
    }));
  }

  // ---------------------------------------------------------------- inventory

  eat(slotIndex: number): void {
    const slot = this.player.inventory.slot(slotIndex);
    if (!slot) return;
    const def = itemDef(slot.id);
    if (def.heals <= 0) {
      this.message("You can't eat that.");
      return;
    }
    this.player.inventory.remove(slot.id, 1);
    const healed = this.player.skills.heal(def.heals);
    this.message(
      `You eat the ${def.name.toLowerCase()}.${healed > 0 ? ` It heals ${healed} hitpoints.` : ""}`,
    );
  }

  equip(slotIndex: number): void {
    const slot = this.player.inventory.slot(slotIndex);
    if (!slot) return;
    const def = itemDef(slot.id);
    if (!def.slot) {
      this.message("You can't wear that.");
      return;
    }
    if (this.player.skills.level("attack") < def.attackRequirement) {
      this.message(`You need an Attack level of ${def.attackRequirement} to wield that.`);
      return;
    }
    if (this.player.skills.level("defence") < def.defenceRequirement) {
      this.message(`You need a Defence level of ${def.defenceRequirement} to wear that.`);
      return;
    }
    this.player.inventory.remove(def.id, 1);
    const replaced = this.player.equipment.equip(def.id);
    if (replaced) this.player.inventory.add(replaced, 1);
    this.message(`You equip the ${def.name.toLowerCase()}.`);
  }

  unequip(slot: EquipSlot): void {
    const itemId = this.player.equipment.get(slot);
    if (!itemId) return;
    if (this.player.inventory.freeSlots() === 0) {
      this.message("You don't have enough inventory space.");
      return;
    }
    this.player.equipment.unequip(slot);
    this.player.inventory.add(itemId, 1);
    this.message(`You remove the ${itemName(itemId).toLowerCase()}.`);
  }

  drop(slotIndex: number): void {
    const slot = this.player.inventory.clearSlot(slotIndex);
    if (!slot) return;
    this.world.addGroundItem(new GroundItem(slot.id, slot.count, this.player.position));
    this.message(`You drop the ${itemName(slot.id).toLowerCase()}.`);
  }

  /** Using one backpack item on another; today that means a tinderbox and some logs. */
  useItemOnItem(firstIndex: number, secondIndex: number): void {
    const first = this.player.inventory.slot(firstIndex);
    const second = this.player.inventory.slot(secondIndex);
    if (!first || !second) return;
    const hasTinderbox = first.id === "tinderbox" || second.id === "tinderbox";
    const logs = [first.id, second.id].find((id) => id in FIREMAKING);
    if (hasTinderbox && logs) {
      this.lightFire(logs);
      return;
    }
    this.message("Nothing interesting happens.");
  }

  lightFire(logId: string): void {
    const recipe = FIREMAKING[logId];
    if (!recipe) return;
    if (!this.player.inventory.contains("tinderbox")) {
      this.message("You need a tinderbox to light a fire.");
      return;
    }
    if (this.player.skills.level("firemaking") < recipe.level) {
      this.message(`You need a Firemaking level of ${recipe.level} to light those.`);
      return;
    }
    if (this.world.objectAt(this.player.position)) {
      this.message("You can't light a fire here.");
      return;
    }
    this.player.inventory.remove(logId, 1);
    const fire = new WorldObject("fire", this.player.position);
    fire.setLifeTimer(120);
    this.world.addObject(fire);
    this.awardXp("firemaking", recipe.experience);
    this.message("The fire catches and the logs begin to burn.");
  }

  // ---------------------------------------------------------------- crafting

  startSmelting(barId: string, quantity: number, furnace: Position): void {
    const recipe = SMELTING[barId];
    if (recipe) this.setAction(new ProcessAction(furnace, recipe, quantity));
  }

  startSmithing(productId: string, quantity: number, anvil: Position): void {
    const recipe = SMITHING[productId];
    if (recipe) this.setAction(new ProcessAction(anvil, recipe, quantity));
  }

  startCooking(rawId: string, quantity: number, range: Position): void {
    const recipe = COOKING[rawId];
    if (recipe) this.setAction(new ProcessAction(range, recipe, quantity));
  }

  // ---------------------------------------------------------------- bank and shop

  bankDeposit(slotIndex: number, count: number): void {
    const slot = this.player.inventory.slot(slotIndex);
    if (!slot) return;
    const moved = this.player.inventory.remove(slot.id, Math.min(count, slot.count));
    this.player.bank.deposit(slot.id, moved);
  }

  bankDepositAll(): void {
    for (let i = 0; i < INVENTORY_CAPACITY; i++) this.bankDeposit(i, Number.MAX_SAFE_INTEGER);
    this.message("You deposit everything you were carrying.");
  }

  bankWithdraw(itemId: string, count: number): void {
    const available = this.player.bank.count(itemId);
    if (available <= 0) return;
    if (!this.player.inventory.hasSpaceFor(itemId, 1)) {
      this.message("You don't have enough inventory space.");
      return;
    }
    const taken = this.player.bank.withdraw(itemId, Math.min(count, available));
    const added = this.player.inventory.add(itemId, taken);
    if (added < taken) this.player.bank.deposit(itemId, taken - added);
  }

  buy(itemId: string, count: number): void {
    const price = buyPrice(itemId) * count;
    if (this.player.inventory.count("coins") < price) {
      this.message("You can't afford that.");
      return;
    }
    if (!this.player.inventory.hasSpaceFor(itemId, count)) {
      this.message("You don't have enough inventory space.");
      return;
    }
    this.player.inventory.remove("coins", price);
    this.player.inventory.add(itemId, count);
    this.message(`You buy ${count} x ${itemName(itemId)} for ${price} coins.`);
  }

  sell(slotIndex: number, count: number): void {
    const slot = this.player.inventory.slot(slotIndex);
    if (!slot) return;
    if (slot.id === "coins") {
      this.message("The shopkeeper has no use for your coins.");
      return;
    }
    const sold = this.player.inventory.remove(slot.id, Math.min(count, slot.count));
    const payment = sellPrice(slot.id) * sold;
    this.player.inventory.add("coins", payment);
    this.message(`You sell ${sold} x ${itemName(slot.id)} for ${payment} coins.`);
  }

  // ---------------------------------------------------------------- quest

  /** Runs the Aldric conversation and returns the lines he speaks. */
  talkToAldric(): string[] {
    const lines: string[] = [];
    if (this.player.questStage === QUEST_NOT_STARTED) {
      lines.push("The village feast is tonight and my larder is bare!");
      lines.push("Bring me a cooked chicken, some cooked meat and two shrimp");
      lines.push("and I will make it worth your while.");
      this.player.questStage = QUEST_STARTED;
      this.message(`You have started ${QUEST_NAME}.`);
    } else if (this.player.questStage === QUEST_STARTED) {
      if (hasQuestIngredients(this.player.inventory)) {
        takeQuestIngredients(this.player.inventory);
        this.player.inventory.add("coins", QUEST_REWARD_COINS);
        this.awardXp("cooking", QUEST_REWARD_COOKING_XP);
        this.player.questStage = QUEST_COMPLETE;
        lines.push("You've saved the feast! Take this for your trouble.");
        this.message(`Quest complete: ${QUEST_NAME}!`);
      } else {
        lines.push("Still hungry over here.");
        for (const [id, count] of Object.entries(QUEST_REQUIREMENTS)) {
          lines.push(`${count} x ${itemName(id)} (you have ${this.player.inventory.count(id)})`);
        }
      }
    } else {
      lines.push("That feast was the talk of the village. Thank you again!");
    }
    return lines;
  }
}
