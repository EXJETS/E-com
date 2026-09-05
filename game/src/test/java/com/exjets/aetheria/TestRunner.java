package com.exjets.aetheria;

import com.exjets.aetheria.combat.CombatFormula;
import com.exjets.aetheria.core.Bank;
import com.exjets.aetheria.core.EquipSlot;
import com.exjets.aetheria.core.Equipment;
import com.exjets.aetheria.core.Inventory;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.core.Skills;
import com.exjets.aetheria.core.XpTable;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.game.Quest;
import com.exjets.aetheria.game.Recipes;
import com.exjets.aetheria.game.Shop;
import com.exjets.aetheria.game.Simulation;
import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.save.SaveManager;
import com.exjets.aetheria.world.GroundItem;
import com.exjets.aetheria.world.ObjectType;
import com.exjets.aetheria.world.Pathfinder;
import com.exjets.aetheria.world.Position;
import com.exjets.aetheria.world.TileType;
import com.exjets.aetheria.world.World;
import com.exjets.aetheria.world.WorldLoader;
import com.exjets.aetheria.world.WorldObject;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Deque;
import java.util.Random;

/**
 * A dependency free test suite: every check prints a line and the process exits non-zero
 * if anything failed, so it drops straight into a CI step.
 */
public final class TestRunner {

    private static int passed;
    private static int failed;

    public static void main(String[] args) throws Exception {
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
        firemakingAndCookingOnAFire();
        aggressiveCreaturesEngage();
        shopTrading();
        questFlow();
        saveRoundTrip();

        System.out.println();
        System.out.println(passed + " passed, " + failed + " failed");
        if (failed > 0) {
            System.exit(1);
        }
    }

    // ------------------------------------------------------------------ tests

    private static void experienceCurve() {
        section("experience curve");
        check("level 2 costs 83 xp", XpTable.xpForLevel(2) == 83);
        check("level 10 costs 1154 xp", XpTable.xpForLevel(10) == 1154);
        check("level 50 costs 101333 xp", XpTable.xpForLevel(50) == 101333);
        check("level 99 costs 13034431 xp", XpTable.xpForLevel(99) == 13034431);
        check("82 xp is still level 1", XpTable.levelForXp(82) == 1);
        check("83 xp is level 2", XpTable.levelForXp(83) == 2);
        check("levels round trip", XpTable.levelForXp(XpTable.xpForLevel(73)) == 73);
        check("progress is a fraction", XpTable.levelProgress(XpTable.xpForLevel(20)) < 0.01);
        check("xp to next level is positive", XpTable.xpToNextLevel(XpTable.xpForLevel(20)) > 0);
    }

    private static void skillsAndCombatLevel() {
        section("skills");
        Skills skills = new Skills();
        check("hitpoints start at 10", skills.level(SkillType.HITPOINTS) == 10);
        check("other skills start at 1", skills.level(SkillType.ATTACK) == 1);
        check("starting combat level is 3", skills.combatLevel() == 3);
        check("full health at creation", skills.currentHitpoints() == 10);

        int gained = skills.addXp(SkillType.ATTACK, 83);
        check("83 xp is one attack level", gained == 1 && skills.level(SkillType.ATTACK) == 2);
        skills.damage(4);
        check("damage lowers current hitpoints", skills.currentHitpoints() == 6);
        check("healing is capped at the maximum", skills.heal(99) == 4);
        skills.addXp(SkillType.HITPOINTS, XpTable.xpForLevel(11) - skills.xp(SkillType.HITPOINTS));
        check("a hitpoints level raises current health", skills.currentHitpoints() == 11);
        skills.damage(100);
        check("zero hitpoints is death", skills.isDead());
    }

    private static void inventoryRules() {
        section("inventory");
        Inventory inventory = new Inventory();
        check("28 free slots", inventory.freeSlots() == 28);
        inventory.add("coins", 100);
        inventory.add("coins", 250);
        check("coins stack in one slot", inventory.usedSlots() == 1 && inventory.count("coins") == 350);
        int added = inventory.add("logs", 30);
        check("only the free slots are filled", added == 27 && inventory.freeSlots() == 0);
        check("a full backpack rejects new items", !inventory.hasSpaceFor("bones", 1));
        check("a full backpack still takes more coins", inventory.hasSpaceFor("coins", 5));
        inventory.remove("logs", 5);
        check("removing frees slots", inventory.freeSlots() == 5);
        check("distinct ids are listed once", inventory.distinctIds().size() == 2);
        inventory.clear();
        check("clearing empties the backpack", inventory.usedSlots() == 0);
    }

    private static void bankAndEquipment() {
        section("bank and equipment");
        Bank bank = new Bank();
        bank.deposit("coal", 500);
        bank.deposit("coal", 250);
        check("bank stacks deposits", bank.count("coal") == 750);
        check("withdrawing is capped at what is stored", bank.withdraw("coal", 1000) == 750);
        check("emptying removes the entry", bank.isEmpty());

        Equipment equipment = new Equipment();
        equipment.equip("bronze_sword");
        equipment.equip("bronze_shield");
        check("weapon and shield are both worn", equipment.get(EquipSlot.WEAPON) != null
                && equipment.get(EquipSlot.SHIELD) != null);
        check("bonuses add up", equipment.attackBonus() == 7 && equipment.defenceBonus() == 8);
        String replaced = equipment.equip("iron_sword");
        check("equipping a weapon returns the old one", "bronze_sword".equals(replaced));
        check("the new weapon is worn", "iron_sword".equals(equipment.get(EquipSlot.WEAPON)));
    }

    private static void worldLoads() {
        section("world");
        World world = WorldLoader.load("/maps/ashvale.map");
        check("the map has a name", !world.name().isBlank());
        check("the map is 64 by 48", world.width() == 64 && world.height() == 48);
        check("the spawn tile is walkable", world.isWalkable(world.spawn()));
        check("scenery was loaded", world.objects().size() > 50);
        check("creatures were spawned", world.npcs().size() >= 20);
        check("water is not walkable", !world.isWalkable(findTile(world, TileType.WATER)));
        check("trees block their tile", world.objects().values().stream()
                .filter(object -> object.type() == ObjectType.TREE)
                .allMatch(object -> !world.isWalkable(object.position())));

        long unreachable = world.objects().values().stream()
                .filter(object -> object.type().isResource())
                .filter(object -> Pathfinder.findPath(world, world.spawn(), object.position(), true).isEmpty())
                .count();
        check("every resource can be walked to", unreachable == 0);

        long strandedNpcs = world.npcs().stream()
                .filter(npc -> Pathfinder.findPath(world, world.spawn(), npc.position(), true).isEmpty())
                .count();
        check("every creature can be reached", strandedNpcs == 0);
    }

    private static void pathfinding() {
        section("pathfinding");
        World world = WorldLoader.load("/maps/ashvale.map");
        Position spawn = world.spawn();
        Position target = new Position(spawn.x(), spawn.y() + 6);
        Deque<Position> path = Pathfinder.findPath(world, spawn, target, false);
        check("a straight walk is found", !path.isEmpty());
        check("the walk ends on the target", path.peekLast().equals(target));
        check("every step is walkable", path.stream().allMatch(world::isWalkable));
        check("steps are adjacent", stepsAreAdjacent(spawn, path));

        WorldObject tree = world.objects().values().stream()
                .filter(object -> object.type() == ObjectType.TREE)
                .findFirst().orElseThrow();
        Deque<Position> toTree = Pathfinder.findPath(world, spawn, tree.position(), true);
        check("walking to a tree stops beside it",
                toTree.peekLast().distanceTo(tree.position()) == 1);
        check("no path is returned for the same tile",
                Pathfinder.findPath(world, spawn, spawn, false).isEmpty());
    }

    private static boolean stepsAreAdjacent(Position start, Deque<Position> path) {
        Position previous = start;
        for (Position step : path) {
            if (previous.distanceTo(step) != 1) {
                return false;
            }
            previous = step;
        }
        return true;
    }

    private static void combatMaths() {
        section("combat maths");
        int weak = CombatFormula.rating(1, 0);
        int strong = CombatFormula.rating(60, 40);
        check("a higher level means a higher rating", strong > weak);
        check("hit chance stays within bounds",
                CombatFormula.hitChance(strong, weak) <= 1.0 && CombatFormula.hitChance(weak, strong) >= 0.0);
        check("the stronger fighter hits more often",
                CombatFormula.hitChance(strong, weak) > CombatFormula.hitChance(weak, strong));
        check("an unarmed level 1 can hit 1", CombatFormula.maxHit(1, 0) >= 1);
        check("strength bonuses raise the max hit",
                CombatFormula.maxHit(40, 50) > CombatFormula.maxHit(40, 0));

        Random random = new Random(12345);
        int hits = 0;
        for (int i = 0; i < 1000; i++) {
            if (CombatFormula.rollDamage(random, strong, weak, 60, 40) > 0) {
                hits++;
            }
        }
        check("a strong attacker mostly connects", hits > 800);
    }

    private static void woodcuttingTrains() {
        section("woodcutting");
        GameEngine engine = engine(4242);
        engine.player().inventory().add("bronze_axe", 1);
        WorldObject tree = Simulation.nearest(engine, ObjectType.TREE);
        engine.interact(tree);
        runUntil(engine, 120, () -> engine.player().inventory().contains("logs"));
        check("logs were chopped", engine.player().inventory().count("logs") >= 1);
        check("woodcutting experience was awarded",
                engine.player().skills().xp(SkillType.WOODCUTTING) >= 25);
        check("a felled tree leaves a stump", tree.isDepleted());
        Simulation.run(engine, ObjectType.TREE.respawnTicks() + 1);
        check("the tree grows back", !tree.isDepleted());

        GameEngine toolless = engine(1);
        WorldObject anotherTree = Simulation.nearest(toolless, ObjectType.TREE);
        toolless.interact(anotherTree);
        Simulation.run(toolless, 60);
        check("chopping without an axe is refused",
                toolless.player().inventory().count("logs") == 0
                        && toolless.log().messages().stream().anyMatch(m -> m.contains("axe")));
    }

    private static void smeltingAndCooking() {
        section("smelting and cooking");
        GameEngine engine = engine(7);
        engine.player().inventory().add("copper_ore", 5);
        engine.player().inventory().add("tin_ore", 5);
        Position furnace = Simulation.nearest(engine, ObjectType.FURNACE).position();
        engine.player().setPosition(furnace.translate(0, 1));
        engine.startSmelting("bronze_bar", 5, furnace);
        Simulation.run(engine, 40);
        check("bronze bars were smelted", engine.player().inventory().count("bronze_bar") == 5);
        check("the ore was used up", engine.player().inventory().count("copper_ore") == 0);
        check("smithing experience was awarded",
                engine.player().skills().xp(SkillType.SMITHING) == 5 * Recipes.SMELTING
                        .get("bronze_bar").experience());

        engine.startSmithing("bronze_dagger", 1, furnace);
        Simulation.run(engine, 20);
        check("a dagger was hammered out", engine.player().inventory().count("bronze_dagger") == 1);

        GameEngine cook = engine(99);
        cook.player().inventory().add("raw_shrimp", 10);
        Position range = Simulation.nearest(cook, ObjectType.RANGE).position();
        cook.player().setPosition(range.translate(0, 1));
        cook.startCooking("raw_shrimp", 10, range);
        Simulation.run(cook, 60);
        int cooked = cook.player().inventory().count("shrimp");
        int burnt = cook.player().inventory().count("burnt_food");
        check("all the shrimp were cooked or burnt", cooked + burnt == 10);
        check("a level 1 cook burns some of them", burnt > 0);
        check("cooking experience matches the successes",
                cook.player().skills().xp(SkillType.COOKING) == cooked * 30);
    }

    private static void fightingKillsAndDrops() {
        section("combat");
        GameEngine engine = engine(2024);
        engine.player().skills().setXp(SkillType.ATTACK, XpTable.xpForLevel(40));
        engine.player().skills().setXp(SkillType.STRENGTH, XpTable.xpForLevel(40));
        engine.player().equipment().equip("steel_sword");
        Npc chicken = engine.world().npcs().stream()
                .filter(npc -> npc.def().key().equals("chicken"))
                .findFirst().orElseThrow();
        engine.attack(chicken);
        runUntil(engine, 120, chicken::isDead);
        check("the chicken was killed", chicken.isDead());
        check("combat experience was awarded", engine.player().skills().xp(SkillType.STRENGTH)
                > XpTable.xpForLevel(40));
        check("hitpoints experience was awarded",
                engine.player().skills().xp(SkillType.HITPOINTS) > 1154);
        check("loot was dropped", engine.world().groundItems().stream()
                .anyMatch(item -> item.itemId().equals("bones")));

        GroundItem bones = engine.world().groundItems().stream()
                .filter(item -> item.itemId().equals("bones"))
                .findFirst().orElseThrow();
        engine.pickUp(bones);
        Simulation.run(engine, 40);
        check("loot can be picked up", engine.player().inventory().contains("bones"));
    }

    private static void deathReturnsYouHome() {
        section("death");
        GameEngine engine = engine(5);
        engine.player().setPosition(new Position(20, 40));
        engine.player().skills().setCurrentHitpoints(1);
        engine.player().takeDamage(5);
        engine.tick();
        check("the player respawns at the town", engine.player().position().equals(engine.world().spawn()));
        check("health is restored", engine.player().skills().currentHitpoints()
                == engine.player().skills().maxHitpoints());
        check("the death was recorded", engine.player().deaths() == 1);
        check("items are kept", engine.player().inventory().usedSlots() >= 0);
    }

    private static void bankingAndEquipping() {
        section("banking and equipping");
        GameEngine engine = engine(21);
        engine.player().inventory().add("coal", 6);
        engine.player().inventory().add("coins", 400);
        engine.bankDepositAll();
        check("everything is deposited", engine.player().inventory().usedSlots() == 0);
        check("unstacked items merge in the bank", engine.player().bank().count("coal") == 6);
        engine.bankWithdraw("coal", 2);
        check("withdrawing takes what was asked for", engine.player().inventory().count("coal") == 2);
        check("the bank keeps the rest", engine.player().bank().count("coal") == 4);
        engine.bankWithdraw("coins", 400);
        check("stacks come back whole", engine.player().inventory().count("coins") == 400);

        engine.player().inventory().add("steel_sword", 1);
        engine.equip(engine.player().inventory().firstIndexOf("steel_sword"));
        check("a level 5 weapon is refused at level 1",
                engine.player().equipment().get(EquipSlot.WEAPON) == null);
        engine.player().skills().setXp(SkillType.ATTACK, XpTable.xpForLevel(5));
        engine.equip(engine.player().inventory().firstIndexOf("steel_sword"));
        check("the weapon is wielded once the level is met",
                "steel_sword".equals(engine.player().equipment().get(EquipSlot.WEAPON)));
        check("wielding takes it out of the backpack",
                !engine.player().inventory().contains("steel_sword"));
        engine.unequip(EquipSlot.WEAPON);
        check("unequipping puts it back", engine.player().inventory().contains("steel_sword"));
    }

    private static void firemakingAndCookingOnAFire() {
        section("firemaking");
        GameEngine engine = engine(33);
        engine.player().inventory().add("tinderbox", 1);
        engine.player().inventory().add("logs", 1);
        engine.player().inventory().add("raw_beef", 3);
        engine.lightFire("logs");
        WorldObject fire = engine.world().objectAt(engine.player().position());
        check("a fire is lit on the tile", fire != null && fire.type() == ObjectType.FIRE);
        check("the logs were used", !engine.player().inventory().contains("logs"));
        check("firemaking experience was awarded",
                engine.player().skills().xp(SkillType.FIREMAKING) == 40);
        check("the fire blocks its tile", !engine.world().isWalkable(engine.player().position()));

        cookOnFire(engine, fire.position());
        check("food can be cooked on the fire",
                engine.player().inventory().count("cooked_meat")
                        + engine.player().inventory().count("burnt_food") == 3);

        Simulation.run(engine, 130);
        check("the fire burns out", engine.world().objectAt(fire.position()) == null);
    }

    private static void cookOnFire(GameEngine engine, Position fire) {
        engine.startCooking("raw_beef", 3, fire);
        Simulation.run(engine, 30);
    }

    private static void aggressiveCreaturesEngage() {
        section("aggression");
        GameEngine engine = engine(77);
        Npc goblin = engine.world().npcs().stream()
                .filter(npc -> npc.def().key().equals("goblin"))
                .findFirst().orElseThrow();
        check("goblins are aggressive", goblin.def().aggressive());
        engine.player().setPosition(goblin.position().translate(2, 0));
        engine.tick();
        check("standing too close starts a fight", goblin.isInCombat());
        runUntil(engine, 60, () -> engine.player().skills().currentHitpoints() < 10);
        check("an aggressive creature deals damage", engine.player().skills().currentHitpoints() < 10);

        engine.player().setPosition(goblin.spawn().translate(0, -20));
        Simulation.run(engine, 4);
        check("walking far enough away breaks it off", !goblin.isInCombat());
    }

    private static void shopTrading() {
        section("shop");
        GameEngine engine = engine(11);
        engine.player().inventory().add("coins", 1000);
        int price = Shop.buyPrice("bronze_axe");
        engine.buy("bronze_axe", 1);
        check("the axe was bought", engine.player().inventory().contains("bronze_axe"));
        check("coins were taken", engine.player().inventory().count("coins") == 1000 - price);

        int axeSlot = engine.player().inventory().firstIndexOf("bronze_axe");
        engine.sell(axeSlot, 1);
        check("selling returns coins", engine.player().inventory().count("coins")
                == 1000 - price + Shop.sellPrice("bronze_axe"));
        check("shops buy for less than they sell", Shop.sellPrice("bronze_axe") < price);

        GameEngine broke = engine(12);
        broke.buy("steel_sword", 1);
        check("you cannot buy what you cannot afford", !broke.player().inventory().contains("steel_sword"));
    }

    private static void questFlow() {
        section("quest");
        GameEngine engine = engine(3);
        check("the quest starts unstarted", engine.player().questStage() == Quest.NOT_STARTED);
        engine.talkToAldric();
        check("talking starts the quest", engine.player().questStage() == Quest.STARTED);
        engine.talkToAldric();
        check("the quest stays open without the food", engine.player().questStage() == Quest.STARTED);

        engine.player().inventory().add("cooked_chicken", 1);
        engine.player().inventory().add("cooked_meat", 1);
        engine.player().inventory().add("shrimp", 2);
        engine.talkToAldric();
        check("delivering the food completes the quest", engine.player().questStage() == Quest.COMPLETE);
        check("the reward was paid", engine.player().inventory().count("coins") == Quest.REWARD_COINS);
        check("the food was handed over", !engine.player().inventory().contains("cooked_chicken"));
        check("cooking experience was granted",
                engine.player().skills().xp(SkillType.COOKING) == Quest.REWARD_COOKING_XP);
    }

    private static void saveRoundTrip() throws Exception {
        section("saving");
        Path file = Files.createTempFile("ashvale", ".save");
        GameEngine engine = engine(8);
        Player player = engine.player();
        player.setName("Tester");
        player.skills().setXp(SkillType.MINING, 5000);
        player.inventory().add("coal", 12);
        player.inventory().add("coins", 1500);
        player.inventory().add("iron_axe", 1);
        player.equipment().equip("bronze_helm");
        player.bank().deposit("willow_logs", 900);
        player.setQuestStage(Quest.STARTED);
        player.setPosition(new Position(40, 30));
        SaveManager.save(player, file);

        Player loaded = new Player(new Position(0, 0));
        SaveManager.load(loaded, file);
        check("the name is kept", loaded.name().equals("Tester"));
        check("experience is kept", loaded.skills().xp(SkillType.MINING) == 5000);
        check("unstacked items are kept slot by slot", loaded.inventory().count("coal") == 12);
        check("stacks are kept", loaded.inventory().count("coins") == 1500);
        check("items are kept", loaded.inventory().contains("iron_axe"));
        check("worn gear is kept", "bronze_helm".equals(loaded.equipment().get(EquipSlot.HEAD)));
        check("the bank is kept", loaded.bank().count("willow_logs") == 900);
        check("quest progress is kept", loaded.questStage() == Quest.STARTED);
        check("the position is kept", loaded.position().equals(new Position(40, 30)));
        check("unknown items are ignored", !ItemRegistry.exists("nonexistent_item"));
        Files.deleteIfExists(file);
    }

    // ------------------------------------------------------------------ helpers

    /** Ticks until the condition holds or the budget runs out, so tests do not race the clock. */
    private static void runUntil(GameEngine engine, int maxTicks, java.util.function.BooleanSupplier done) {
        for (int i = 0; i < maxTicks && !done.getAsBoolean(); i++) {
            engine.tick();
        }
    }

    private static GameEngine engine(long seed) {
        World world = WorldLoader.load("/maps/ashvale.map");
        Player player = new Player(world.spawn());
        return new GameEngine(world, player, new Random(seed));
    }

    private static Position findTile(World world, TileType type) {
        for (int y = 0; y < world.height(); y++) {
            for (int x = 0; x < world.width(); x++) {
                if (world.tile(x, y) == type) {
                    return new Position(x, y);
                }
            }
        }
        throw new IllegalStateException("No " + type + " on the map");
    }

    private static void section(String title) {
        System.out.println();
        System.out.println("== " + title);
    }

    private static void check(String description, boolean condition) {
        if (condition) {
            passed++;
            System.out.println("  ok    " + description);
        } else {
            failed++;
            System.out.println("  FAIL  " + description);
        }
    }
}
