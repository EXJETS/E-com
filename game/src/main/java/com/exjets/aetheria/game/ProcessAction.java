package com.exjets.aetheria.game;

import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.world.Position;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * A repeating crafting loop: consume inputs, produce an output and award experience,
 * one item every few ticks, until the inputs run out or the player stops.
 */
public class ProcessAction extends Action {

    private final Recipe recipe;
    private int remaining;
    private int delay;

    /**
     * @param inputs   item id to quantity consumed per item made
     * @param burnable when set, low levels sometimes ruin the item and produce burnt food instead
     */
    public record Recipe(String name, Map<String, Integer> inputs, String output, SkillType skill,
                         int levelRequired, int experience, int ticksPerItem, boolean burnable,
                         int burnFreeLevel) {

        public static Recipe of(String name, String input, String output, SkillType skill,
                                int levelRequired, int experience, int ticksPerItem) {
            Map<String, Integer> inputs = new LinkedHashMap<>();
            inputs.put(input, 1);
            return new Recipe(name, inputs, output, skill, levelRequired, experience, ticksPerItem, false, 0);
        }

        public Recipe burnable(int burnFreeLevel) {
            return new Recipe(name, inputs, output, skill, levelRequired, experience, ticksPerItem,
                    true, burnFreeLevel);
        }
    }

    public ProcessAction(Position target, Recipe recipe, int quantity) {
        super(target);
        this.recipe = recipe;
        this.remaining = quantity;
    }

    @Override
    public String description() {
        return recipe.name();
    }

    @Override
    public boolean tick(GameEngine engine) {
        if (remaining <= 0) {
            return false;
        }
        Player player = engine.player();
        if (player.skills().level(recipe.skill()) < recipe.levelRequired()) {
            engine.message("You need a " + recipe.skill().displayName() + " level of "
                    + recipe.levelRequired() + " to make that.");
            return false;
        }
        for (Map.Entry<String, Integer> input : recipe.inputs().entrySet()) {
            if (!player.inventory().contains(input.getKey(), input.getValue())) {
                engine.message("You have run out of "
                        + com.exjets.aetheria.core.ItemRegistry.nameOf(input.getKey()).toLowerCase() + ".");
                return false;
            }
        }
        if (delay > 0) {
            delay--;
            return true;
        }
        for (Map.Entry<String, Integer> input : recipe.inputs().entrySet()) {
            player.inventory().remove(input.getKey(), input.getValue());
        }
        boolean burnt = recipe.burnable() && engine.random().nextDouble() < burnChance(
                player.skills().level(recipe.skill()));
        if (burnt) {
            player.inventory().add("burnt_food", 1);
            engine.message("You accidentally burn the "
                    + com.exjets.aetheria.core.ItemRegistry.nameOf(recipe.output()).toLowerCase() + ".");
        } else {
            player.inventory().add(recipe.output(), 1);
            engine.awardXp(recipe.skill(), recipe.experience());
            engine.message("You make a "
                    + com.exjets.aetheria.core.ItemRegistry.nameOf(recipe.output()).toLowerCase() + ".");
        }
        remaining--;
        delay = recipe.ticksPerItem() - 1;
        return remaining > 0;
    }

    /** Burning fades out linearly and stops entirely at the recipe's burn free level. */
    double burnChance(int level) {
        if (!recipe.burnable() || level >= recipe.burnFreeLevel()) {
            return 0;
        }
        double span = Math.max(1, recipe.burnFreeLevel() - recipe.levelRequired());
        double progress = (level - recipe.levelRequired()) / span;
        return Math.max(0.05, 0.55 * (1 - progress));
    }
}
