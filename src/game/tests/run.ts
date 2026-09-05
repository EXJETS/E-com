/**
 * A dependency free test suite for the browser game's engine, mirroring the desktop build's
 * checks. Run it with `npm run test:game`; it exits non-zero if anything fails.
 */
import { hitChance, maxHit, rating, rollDamage } from "../combat/formulas";
import { Bank } from "../core/bank";
import { Equipment } from "../core/equipment";
import { Inventory } from "../core/inventory";
import { itemExists } from "../core/items";
import { Player } from "../core/player";
import { Skills } from "../core/skills";
import { levelForXp, levelProgress, xpForLevel, xpToNextLevel } from "../core/xp";
import { GameEngine } from "../engine/engine";
import {
  QUEST_COMPLETE,
  QUEST_NOT_STARTED,
  QUEST_REWARD_COINS,
  QUEST_REWARD_COOKING_XP,
  QUEST_STARTED,
} from "../engine/quest";
import { SMELTING } from "../engine/recipes";
import { buyPrice, sellPrice } from "../engine/shop";
import { ASHVALE_MAP } from "../data/map";
import { Npc } from "../npc/npc";
import { deserialize, serialize } from "../save";
import { createGame } from "../setup";
import { GroundItem, ObjectType, WorldObject } from "../world/objects";
import { findPath } from "../world/pathfinder";
import { Position, distance, pos, samePosition } from "../world/position";
import { TileType } from "../world/tiles";
import { loadWorld } from "../world/loader";
import { World } from "../world/world";

let passed = 0;
let failed = 0;

function section(title: string): void {
  console.log(`\n== ${title}`);
}

function check(description: string, condition: boolean): void {
  if (condition) {
    passed++;
    console.log(`  ok    ${description}`);
  } else {
    failed++;
    console.log(`  FAIL  ${description}`);
  }
}

/** A small deterministic generator, so a failing test can always be reproduced. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function engineWithSeed(seed: number): GameEngine {
  return createGame(seeded(seed));
}

function runTicks(engine: GameEngine, ticks: number): void {
  for (let i = 0; i < ticks; i++) engine.tick();
}

function runUntil(engine: GameEngine, maxTicks: number, done: () => boolean): void {
  for (let i = 0; i < maxTicks && !done(); i++) engine.tick();
}

function nearestObject(engine: GameEngine, type: ObjectType): WorldObject {
  const found = [...engine.world.objects.values()]
    .filter((object) => object.type === type && !object.isDepleted())
    .sort((a, b) => distance(a.position, engine.player.position) - distance(b.position, engine.player.position))[0];
  if (!found) throw new Error(`No ${type} on the map`);
  return found;
}

function findTile(world: World, type: TileType): Position {
  for (let y = 0; y < world.height; y++) {
    for (let x = 0; x < world.width; x++) {
      if (world.tile(x, y) === type) return pos(x, y);
    }
  }
  throw new Error(`No ${type} on the map`);
}

// ------------------------------------------------------------------ tests

function experienceCurve(): void {
  section("experience curve");
  check("level 2 costs 83 xp", xpForLevel(2) === 83);
  check("level 10 costs 1154 xp", xpForLevel(10) === 1154);
  check("level 50 costs 101333 xp", xpForLevel(50) === 101333);
  check("level 99 costs 13034431 xp", xpForLevel(99) === 13034431);
  check("82 xp is still level 1", levelForXp(82) === 1);
  check("83 xp is level 2", levelForXp(83) === 2);
  check("levels round trip", levelForXp(xpForLevel(73)) === 73);
  check("progress is a fraction", levelProgress(xpForLevel(20)) < 0.01);
  check("xp to next level is positive", xpToNextLevel(xpForLevel(20)) > 0);
}

function skillsAndCombatLevel(): void {
  section("skills");
  const skills = new Skills();
  check("hitpoints start at 10", skills.level("hitpoints") === 10);
  check("other skills start at 1", skills.level("attack") === 1);
  check("starting combat level is 3", skills.combatLevel() === 3);
  check("full health at creation", skills.currentHitpoints() === 10);

  check("83 xp is one attack level", skills.addXp("attack", 83) === 1 && skills.level("attack") === 2);
  skills.damage(4);
  check("damage lowers current hitpoints", skills.currentHitpoints() === 6);
  check("healing is capped at the maximum", skills.heal(99) === 4);
  skills.addXp("hitpoints", xpForLevel(11) - skills.xp("hitpoints"));
  check("a hitpoints level raises current health", skills.currentHitpoints() === 11);
  skills.damage(100);
  check("zero hitpoints is death", skills.isDead());
}

function inventoryRules(): void {
  section("inventory");
  const inventory = new Inventory();
  check("28 free slots", inventory.freeSlots() === 28);
  inventory.add("coins", 100);
  inventory.add("coins", 250);
  check("coins stack in one slot", inventory.usedSlots() === 1 && inventory.count("coins") === 350);
  check("only the free slots are filled", inventory.add("logs", 30) === 27 && inventory.freeSlots() === 0);
  check("a full backpack rejects new items", !inventory.hasSpaceFor("bones", 1));
  check("a full backpack still takes more coins", inventory.hasSpaceFor("coins", 5));
  inventory.remove("logs", 5);
  check("removing frees slots", inventory.freeSlots() === 5);
  check("distinct ids are listed once", inventory.distinctIds().length === 2);
  inventory.clear();
  check("clearing empties the backpack", inventory.usedSlots() === 0);
}

function bankAndEquipment(): void {
  section("bank and equipment");
  const bank = new Bank();
  bank.deposit("coal", 500);
  bank.deposit("coal", 250);
  check("bank stacks deposits", bank.count("coal") === 750);
  check("withdrawing is capped at what is stored", bank.withdraw("coal", 1000) === 750);
  check("emptying removes the entry", bank.isEmpty());

  const equipment = new Equipment();
  equipment.equip("bronze_sword");
  equipment.equip("bronze_shield");
  check("weapon and shield are both worn", equipment.get("weapon") !== null && equipment.get("shield") !== null);
  check("bonuses add up", equipment.attackBonus() === 7 && equipment.defenceBonus() === 8);
  check("equipping a weapon returns the old one", equipment.equip("iron_sword") === "bronze_sword");
  check("the new weapon is worn", equipment.get("weapon") === "iron_sword");
}

function worldLoads(): void {
  section("world");
  const world = loadWorld(ASHVALE_MAP);
  check("the map has a name", world.name.length > 0);
  check("the map is 64 by 48", world.width === 64 && world.height === 48);
  check("the spawn tile is walkable", world.isWalkable(world.spawn));
  check("scenery was loaded", world.objects.size > 50);
  check("creatures were spawned", world.npcs.length >= 20);
  check("water is not walkable", !world.isWalkable(findTile(world, "water")));
  check(
    "trees block their tile",
    [...world.objects.values()].filter((o) => o.type === "tree").every((o) => !world.isWalkable(o.position)),
  );

  const unreachable = [...world.objects.values()]
    .filter((object) => object.info.skill !== undefined)
    .filter((object) => findPath(world, world.spawn, object.position, true).length === 0).length;
  check("every resource can be walked to", unreachable === 0);

  const stranded = world.npcs.filter((npc) => findPath(world, world.spawn, npc.position, true).length === 0).length;
  check("every creature can be reached", stranded === 0);
}

function pathfinding(): void {
  section("pathfinding");
  const world = loadWorld(ASHVALE_MAP);
  const start = world.spawn;
  const target = pos(start.x, start.y + 6);
  const path = findPath(world, start, target, false);
  check("a straight walk is found", path.length > 0);
  check("the walk ends on the target", samePosition(path[path.length - 1], target));
  check("every step is walkable", path.every((step) => world.isWalkable(step)));

  let previous = start;
  const adjacent = path.every((step) => {
    const ok = distance(previous, step) === 1;
    previous = step;
    return ok;
  });
  check("steps are adjacent", adjacent);

  const tree = [...world.objects.values()].find((object) => object.type === "tree")!;
  const toTree = findPath(world, start, tree.position, true);
  check("walking to a tree stops beside it", distance(toTree[toTree.length - 1], tree.position) === 1);
  check("no path is returned for the same tile", findPath(world, start, start, false).length === 0);
}

function combatMaths(): void {
  section("combat maths");
  const weak = rating(1, 0);
  const strong = rating(60, 40);
  check("a higher level means a higher rating", strong > weak);
  check("hit chance stays within bounds", hitChance(strong, weak) <= 1 && hitChance(weak, strong) >= 0);
  check("the stronger fighter hits more often", hitChance(strong, weak) > hitChance(weak, strong));
  check("an unarmed level 1 can hit 1", maxHit(1, 0) >= 1);
  check("strength bonuses raise the max hit", maxHit(40, 50) > maxHit(40, 0));

  const random = seeded(12345);
  let hits = 0;
  for (let i = 0; i < 1000; i++) {
    if (rollDamage(random, strong, weak, 60, 40) > 0) hits++;
  }
  check("a strong attacker mostly connects", hits > 800);
}

function woodcuttingTrains(): void {
  section("woodcutting");
  const engine = engineWithSeed(4242);
  engine.player.inventory.add("bronze_axe", 1);
  const tree = nearestObject(engine, "tree");
  engine.interact(tree);
  runUntil(engine, 120, () => engine.player.inventory.contains("logs"));
  check("logs were chopped", engine.player.inventory.count("logs") >= 1);
  check("woodcutting experience was awarded", engine.player.skills.xp("woodcutting") >= 25);
  check("a felled tree leaves a stump", tree.isDepleted());
  runTicks(engine, tree.info.respawnTicks + 1);
  check("the tree grows back", !tree.isDepleted());

  const toolless = engineWithSeed(1);
  toolless.interact(nearestObject(toolless, "tree"));
  runTicks(toolless, 60);
  check(
    "chopping without an axe is refused",
    toolless.player.inventory.count("logs") === 0 && toolless.messages.some((m) => m.includes("axe")),
  );
}

function smeltingAndCooking(): void {
  section("smelting and cooking");
  const engine = engineWithSeed(7);
  engine.player.inventory.add("copper_ore", 5);
  engine.player.inventory.add("tin_ore", 5);
  const furnace = nearestObject(engine, "furnace").position;
  engine.player.position = { x: furnace.x, y: furnace.y + 1 };
  engine.startSmelting("bronze_bar", 5, furnace);
  runTicks(engine, 40);
  check("bronze bars were smelted", engine.player.inventory.count("bronze_bar") === 5);
  check("the ore was used up", engine.player.inventory.count("copper_ore") === 0);
  check("smithing experience was awarded", engine.player.skills.xp("smithing") === 5 * SMELTING.bronze_bar.experience);

  engine.startSmithing("bronze_dagger", 1, furnace);
  runTicks(engine, 20);
  check("a dagger was hammered out", engine.player.inventory.count("bronze_dagger") === 1);

  const cook = engineWithSeed(99);
  cook.player.inventory.add("raw_shrimp", 10);
  const range = nearestObject(cook, "range").position;
  cook.player.position = { x: range.x, y: range.y + 1 };
  cook.startCooking("raw_shrimp", 10, range);
  runTicks(cook, 60);
  const cooked = cook.player.inventory.count("shrimp");
  const burnt = cook.player.inventory.count("burnt_food");
  check("all the shrimp were cooked or burnt", cooked + burnt === 10);
  check("a level 1 cook burns some of them", burnt > 0);
  check("cooking experience matches the successes", cook.player.skills.xp("cooking") === cooked * 30);
}

function fightingKillsAndDrops(): void {
  section("combat");
  const engine = engineWithSeed(2024);
  engine.player.skills.setXp("attack", xpForLevel(40));
  engine.player.skills.setXp("strength", xpForLevel(40));
  engine.player.equipment.equip("steel_sword");
  const chicken = engine.world.npcs.find((npc) => npc.def.key === "chicken")!;
  engine.attack(chicken);
  runUntil(engine, 120, () => chicken.isDead());
  check("the chicken was killed", chicken.isDead());
  check("combat experience was awarded", engine.player.skills.xp("strength") > xpForLevel(40));
  check("hitpoints experience was awarded", engine.player.skills.xp("hitpoints") > 1154);
  check("loot was dropped", engine.world.groundItems.some((item) => item.itemId === "bones"));

  const bones = engine.world.groundItems.find((item) => item.itemId === "bones") as GroundItem;
  engine.pickUp(bones);
  runTicks(engine, 40);
  check("loot can be picked up", engine.player.inventory.contains("bones"));
}

function deathReturnsYouHome(): void {
  section("death");
  const engine = engineWithSeed(5);
  engine.player.position = pos(20, 40);
  engine.player.skills.setCurrentHitpoints(1);
  engine.player.takeDamage(5);
  engine.tick();
  check("the player respawns at the town", samePosition(engine.player.position, engine.world.spawn));
  check(
    "health is restored",
    engine.player.skills.currentHitpoints() === engine.player.skills.maxHitpoints(),
  );
  check("the death was recorded", engine.player.deaths === 1);
}

function bankingAndEquipping(): void {
  section("banking and equipping");
  const engine = engineWithSeed(21);
  engine.player.inventory.add("coal", 6);
  engine.player.inventory.add("coins", 400);
  engine.bankDepositAll();
  check("everything is deposited", engine.player.inventory.usedSlots() === 0);
  check("unstacked items merge in the bank", engine.player.bank.count("coal") === 6);
  engine.bankWithdraw("coal", 2);
  check("withdrawing takes what was asked for", engine.player.inventory.count("coal") === 2);
  check("the bank keeps the rest", engine.player.bank.count("coal") === 4);
  engine.bankWithdraw("coins", 400);
  check("stacks come back whole", engine.player.inventory.count("coins") === 400);

  engine.player.inventory.add("steel_sword", 1);
  engine.equip(engine.player.inventory.firstIndexOf("steel_sword"));
  check("a level 5 weapon is refused at level 1", engine.player.equipment.get("weapon") === null);
  engine.player.skills.setXp("attack", xpForLevel(5));
  engine.equip(engine.player.inventory.firstIndexOf("steel_sword"));
  check("the weapon is wielded once the level is met", engine.player.equipment.get("weapon") === "steel_sword");
  check("wielding takes it out of the backpack", !engine.player.inventory.contains("steel_sword"));
  engine.unequip("weapon");
  check("unequipping puts it back", engine.player.inventory.contains("steel_sword"));
}

function firemakingAndCooking(): void {
  section("firemaking");
  const engine = engineWithSeed(33);
  engine.player.inventory.add("tinderbox", 1);
  engine.player.inventory.add("logs", 1);
  engine.player.inventory.add("raw_beef", 3);
  engine.lightFire("logs");
  const fire = engine.world.objectAt(engine.player.position);
  check("a fire is lit on the tile", fire !== null && fire.type === "fire");
  check("the logs were used", !engine.player.inventory.contains("logs"));
  check("firemaking experience was awarded", engine.player.skills.xp("firemaking") === 40);
  check("the fire blocks its tile", !engine.world.isWalkable(engine.player.position));

  engine.startCooking("raw_beef", 3, fire!.position);
  runTicks(engine, 30);
  check(
    "food can be cooked on the fire",
    engine.player.inventory.count("cooked_meat") + engine.player.inventory.count("burnt_food") === 3,
  );

  runTicks(engine, 130);
  check("the fire burns out", engine.world.objectAt(fire!.position) === null);
}

function aggressiveCreaturesEngage(): void {
  section("aggression");
  const engine = engineWithSeed(77);
  const goblin = engine.world.npcs.find((npc) => npc.def.key === "goblin") as Npc;
  check("goblins are aggressive", goblin.def.aggressive);
  engine.player.position = { x: goblin.position.x + 2, y: goblin.position.y };
  engine.tick();
  check("standing too close starts a fight", goblin.isInCombat());
  runUntil(engine, 60, () => engine.player.skills.currentHitpoints() < 10);
  check("an aggressive creature deals damage", engine.player.skills.currentHitpoints() < 10);

  engine.player.position = { x: goblin.spawn.x, y: goblin.spawn.y - 20 };
  runTicks(engine, 4);
  check("walking far enough away breaks it off", !goblin.isInCombat());
}

function shopTrading(): void {
  section("shop");
  const engine = engineWithSeed(11);
  engine.player.inventory.add("coins", 1000);
  const price = buyPrice("bronze_axe");
  engine.buy("bronze_axe", 1);
  check("the axe was bought", engine.player.inventory.contains("bronze_axe"));
  check("coins were taken", engine.player.inventory.count("coins") === 1000 - price);

  engine.sell(engine.player.inventory.firstIndexOf("bronze_axe"), 1);
  check(
    "selling returns coins",
    engine.player.inventory.count("coins") === 1000 - price + sellPrice("bronze_axe"),
  );
  check("shops buy for less than they sell", sellPrice("bronze_axe") < price);

  const broke = engineWithSeed(12);
  broke.buy("steel_sword", 1);
  check("you cannot buy what you cannot afford", !broke.player.inventory.contains("steel_sword"));
}

function questFlow(): void {
  section("quest");
  const engine = engineWithSeed(3);
  check("the quest starts unstarted", engine.player.questStage === QUEST_NOT_STARTED);
  engine.talkToAldric();
  check("talking starts the quest", engine.player.questStage === QUEST_STARTED);
  engine.talkToAldric();
  check("the quest stays open without the food", engine.player.questStage === QUEST_STARTED);

  engine.player.inventory.add("cooked_chicken", 1);
  engine.player.inventory.add("cooked_meat", 1);
  engine.player.inventory.add("shrimp", 2);
  engine.talkToAldric();
  check("delivering the food completes the quest", engine.player.questStage === QUEST_COMPLETE);
  check("the reward was paid", engine.player.inventory.count("coins") === QUEST_REWARD_COINS);
  check("the food was handed over", !engine.player.inventory.contains("cooked_chicken"));
  check("cooking experience was granted", engine.player.skills.xp("cooking") === QUEST_REWARD_COOKING_XP);
}

function saveRoundTrip(): void {
  section("saving");
  const engine = engineWithSeed(8);
  const player = engine.player;
  player.name = "Tester";
  player.skills.setXp("mining", 5000);
  player.inventory.add("coal", 12);
  player.inventory.add("coins", 1500);
  player.inventory.add("iron_axe", 1);
  player.equipment.equip("bronze_helm");
  player.bank.deposit("willow_logs", 900);
  player.questStage = QUEST_STARTED;
  player.position = pos(40, 30);

  const loaded = new Player(pos(0, 0));
  deserialize(loaded, serialize(player));
  check("the name is kept", loaded.name === "Tester");
  check("experience is kept", loaded.skills.xp("mining") === 5000);
  check("unstacked items are kept slot by slot", loaded.inventory.count("coal") === 12);
  check("stacks are kept", loaded.inventory.count("coins") === 1500);
  check("items are kept", loaded.inventory.contains("iron_axe"));
  check("worn gear is kept", loaded.equipment.get("head") === "bronze_helm");
  check("the bank is kept", loaded.bank.count("willow_logs") === 900);
  check("quest progress is kept", loaded.questStage === QUEST_STARTED);
  check("the position is kept", samePosition(loaded.position, pos(40, 30)));
  check("unknown items are ignored", !itemExists("nonexistent_item"));
}

experienceCurve();
skillsAndCombatLevel();
inventoryRules();
bankAndEquipment();
worldLoads();
pathfinding();
combatMaths();
woodcuttingTrains();
smeltingAndCooking();
fightingKillsAndDrops();
deathReturnsYouHome();
bankingAndEquipping();
firemakingAndCooking();
aggressiveCreaturesEngage();
shopTrading();
questFlow();
saveRoundTrip();

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
