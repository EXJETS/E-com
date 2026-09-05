package com.exjets.aetheria.game;

import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.world.ObjectType;
import com.exjets.aetheria.world.Position;
import com.exjets.aetheria.world.WorldObject;

import java.util.Comparator;
import java.util.Map;

/**
 * Drives the engine without any window. Handy for a smoke test on a headless machine and
 * for watching how fast a character actually trains.
 */
public final class Simulation {

    private Simulation() {
    }

    /**
     * Works the nearest node of a kind for {@code ticks}, moving on to the next one whenever
     * the current tree falls or rock is exhausted.
     */
    public static void harvest(GameEngine engine, ObjectType type, int ticks) {
        for (int i = 0; i < ticks; i++) {
            if (engine.currentAction() == null) {
                WorldObject node = nearest(engine, type);
                if (node == null) {
                    engine.message("No " + type.displayName().toLowerCase() + " is available.");
                    run(engine, ticks - i);
                    return;
                }
                engine.interact(node);
            }
            engine.tick();
        }
    }

    /** Hunts creatures of a kind for {@code ticks}, picking a new one after each kill. */
    public static void fight(GameEngine engine, String npcKey, int ticks) {
        for (int i = 0; i < ticks; i++) {
            if (engine.currentAction() == null) {
                Npc npc = nearestNpc(engine, npcKey);
                if (npc == null) {
                    run(engine, ticks - i);
                    return;
                }
                engine.attack(npc);
            }
            engine.tick();
        }
    }

    public static Npc nearestNpc(GameEngine engine, String npcKey) {
        return engine.world().npcs().stream()
                .filter(candidate -> candidate.def().key().equals(npcKey) && candidate.isVisible())
                .min(Comparator.comparingInt(candidate ->
                        candidate.position().distanceTo(engine.player().position())))
                .orElse(null);
    }

    public static void walkTo(GameEngine engine, Position destination, int ticks) {
        engine.walkTo(destination);
        for (int i = 0; i < ticks && !engine.player().position().equals(destination); i++) {
            engine.tick();
        }
    }

    public static void run(GameEngine engine, int ticks) {
        for (int i = 0; i < ticks; i++) {
            engine.tick();
        }
    }

    /** Banks the haul so the next phase of the demo has room to work. */
    private static void stash(GameEngine engine) {
        engine.stopAction();
        String[] keep = {"bronze_axe", "bronze_pickaxe", "small_net", "tinderbox", "coins"};
        for (int slot = 0; slot < com.exjets.aetheria.core.Inventory.CAPACITY; slot++) {
            var held = engine.player().inventory().slot(slot);
            if (held == null || java.util.Arrays.asList(keep).contains(held.id)) {
                continue;
            }
            engine.bankDeposit(slot, held.count);
        }
    }

    public static WorldObject nearest(GameEngine engine, ObjectType type) {
        return engine.world().objects().values().stream()
                .filter(object -> object.type() == type && !object.isDepleted())
                .min(Comparator.comparingInt(object ->
                        object.position().distanceTo(engine.player().position())))
                .orElse(null);
    }

    /** A short scripted session, printed to stdout, used by {@code --headless}. */
    public static void demo(GameEngine engine, int ticks) {
        engine.log().onMessage(message -> System.out.println("  " + message));
        System.out.println("Ashvale headless demo - " + ticks + " ticks");
        System.out.println("- chopping trees");
        harvest(engine, ObjectType.TREE, ticks / 4);
        stash(engine);
        System.out.println("- mining copper");
        harvest(engine, ObjectType.COPPER_ROCK, ticks / 4);
        stash(engine);
        System.out.println("- fishing");
        harvest(engine, ObjectType.SHRIMP_SPOT, ticks / 4);
        stash(engine);
        System.out.println("- hunting chickens");
        fight(engine, "chicken", ticks / 4);
        System.out.println();
        System.out.println("Result after " + engine.tickCount() + " ticks:");
        for (SkillType skill : SkillType.values()) {
            int xp = engine.player().skills().xp(skill);
            if (xp > 0) {
                System.out.printf("  %-12s level %-3d %d xp%n", skill.displayName(),
                        engine.player().skills().level(skill), xp);
            }
        }
        System.out.println("  Backpack:");
        for (String id : engine.player().inventory().distinctIds()) {
            System.out.println("    " + com.exjets.aetheria.core.ItemRegistry.nameOf(id)
                    + " x " + engine.player().inventory().count(id));
        }
        System.out.println("  Bank:");
        engine.player().bank().contents().forEach((id, count) ->
                System.out.println("    " + com.exjets.aetheria.core.ItemRegistry.nameOf(id)
                        + " x " + count));
        System.out.println("  Position: " + engine.player().position()
                + ", hitpoints " + engine.player().skills().currentHitpoints()
                + "/" + engine.player().skills().maxHitpoints());
    }

    /** Convenience for tests and the demo: what the character is carrying, as a map. */
    public static Map<String, Integer> backpackSummary(GameEngine engine) {
        Map<String, Integer> summary = new java.util.LinkedHashMap<>();
        for (String id : engine.player().inventory().distinctIds()) {
            summary.put(id, engine.player().inventory().count(id));
        }
        return summary;
    }
}
