package com.exjets.aetheria.combat;

import java.util.Random;

/**
 * The classic melee maths: both sides roll against each other's rating, and a successful
 * attack rolls a damage number uniformly between 0 and the attacker's max hit.
 */
public final class CombatFormula {

    private CombatFormula() {
    }

    /** Attack or defence rating: effective level times the matching equipment bonus. */
    public static int rating(int effectiveLevel, int equipmentBonus) {
        return (effectiveLevel + 8) * (equipmentBonus + 64);
    }

    /** Chance for an attack roll to beat a defence roll, in the range {@code [0, 1]}. */
    public static double hitChance(int attackRating, int defenceRating) {
        if (attackRating > defenceRating) {
            return 1.0 - (defenceRating + 2.0) / (2.0 * (attackRating + 1.0));
        }
        return attackRating / (2.0 * (defenceRating + 1.0));
    }

    /** Highest damage a swing can deal. */
    public static int maxHit(int effectiveStrength, int strengthBonus) {
        double raw = 0.5 + (effectiveStrength + 8) * (strengthBonus + 64) / 640.0;
        return Math.max(1, (int) Math.floor(raw));
    }

    /**
     * Rolls one swing.
     *
     * @return the damage dealt, which is 0 for a miss
     */
    public static int rollDamage(Random random, int attackRating, int defenceRating,
                                 int effectiveStrength, int strengthBonus) {
        if (random.nextDouble() >= hitChance(attackRating, defenceRating)) {
            return 0;
        }
        return random.nextInt(maxHit(effectiveStrength, strengthBonus) + 1);
    }
}
