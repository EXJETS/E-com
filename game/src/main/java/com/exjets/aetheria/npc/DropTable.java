package com.exjets.aetheria.npc;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/** Guaranteed drops plus one weighted roll on the random table. */
public class DropTable {

    /** A table entry: what may drop, how much of it, and how likely it is. */
    public record Drop(String itemId, int minCount, int maxCount, int weight) {
        int rollCount(Random random) {
            return minCount + random.nextInt(maxCount - minCount + 1);
        }
    }

    /** A resolved drop, ready to be placed on the ground. */
    public record Stack(String itemId, int count) {
    }

    private final List<Drop> always = new ArrayList<>();
    private final List<Drop> random = new ArrayList<>();
    private int totalWeight;

    public DropTable always(String itemId, int min, int max) {
        always.add(new Drop(itemId, min, max, 0));
        return this;
    }

    public DropTable chance(String itemId, int min, int max, int weight) {
        random.add(new Drop(itemId, min, max, weight));
        totalWeight += weight;
        return this;
    }

    /** Nothing at all is a legitimate outcome, so pad the table with empty weight. */
    public DropTable nothing(int weight) {
        random.add(new Drop(null, 0, 0, weight));
        totalWeight += weight;
        return this;
    }

    /** @return everything this kill leaves behind */
    public List<Stack> roll(Random rng) {
        List<Stack> result = new ArrayList<>();
        for (Drop drop : always) {
            result.add(new Stack(drop.itemId(), drop.rollCount(rng)));
        }
        if (totalWeight > 0) {
            int pick = rng.nextInt(totalWeight);
            for (Drop drop : random) {
                pick -= drop.weight();
                if (pick < 0) {
                    if (drop.itemId() != null) {
                        result.add(new Stack(drop.itemId(), drop.rollCount(rng)));
                    }
                    break;
                }
            }
        }
        return result;
    }
}
