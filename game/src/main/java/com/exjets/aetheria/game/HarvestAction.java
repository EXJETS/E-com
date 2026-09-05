package com.exjets.aetheria.game;

import com.exjets.aetheria.core.ItemDef;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.world.ObjectType;
import com.exjets.aetheria.world.WorldObject;

/** Chopping a tree, mining a rock or fishing a spot: the same loop with different numbers. */
public class HarvestAction extends Action {

    private final WorldObject node;
    private final ObjectType type;

    public HarvestAction(WorldObject node) {
        super(node.position());
        this.node = node;
        this.type = node.type();
    }

    @Override
    public String description() {
        return type.action() + " " + type.displayName().toLowerCase();
    }

    @Override
    public boolean tick(GameEngine engine) {
        Player player = engine.player();
        if (node.isDepleted() || engine.world().objectAt(node.position()) != node) {
            return false;
        }
        int level = player.skills().level(type.skill());
        if (level < type.levelRequired()) {
            engine.message("You need a " + type.skill().displayName() + " level of "
                    + type.levelRequired() + " to do that.");
            return false;
        }
        ItemDef tool = player.bestTool(type.toolType(), type.skill());
        if (tool == null) {
            engine.message("You need " + toolPhrase() + " to do that.");
            return false;
        }
        if (!player.inventory().hasSpaceFor(type.product(), 1)) {
            engine.message("Your inventory is too full to hold any more.");
            return false;
        }
        if (engine.random().nextDouble() < successChance(level, tool.toolTier())) {
            player.inventory().add(type.product(), 1);
            engine.awardXp(type.skill(), type.experience());
            engine.message("You get some " + ItemRegistry.nameOf(type.product()).toLowerCase() + ".");
            node.deplete();
            if (node.isDepleted()) {
                return false;
            }
        }
        return true;
    }

    private String toolPhrase() {
        return switch (type.toolType()) {
            case "axe" -> "an axe";
            case "pickaxe" -> "a pickaxe";
            case "net" -> "a small fishing net";
            case "rod" -> "a fishing rod";
            default -> "the right tool";
        };
    }

    /** Higher skill and better tools mean more successful swings per tick. */
    double successChance(int level, int toolTier) {
        double chance = (5.0 + (level - type.levelRequired()) + toolTier * 3.0) / 40.0;
        return Math.max(0.08, Math.min(0.85, chance));
    }
}
