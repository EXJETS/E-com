package com.exjets.aetheria.core;

import java.util.EnumMap;
import java.util.Map;

/** Experience, levels and the temporary hitpoints pool for a single character. */
public final class Skills {

    private final Map<SkillType, Integer> experience = new EnumMap<>(SkillType.class);
    private int currentHitpoints;

    public Skills() {
        for (SkillType skill : SkillType.values()) {
            experience.put(skill, XpTable.xpForLevel(skill.startLevel()));
        }
        currentHitpoints = maxHitpoints();
    }

    public int xp(SkillType skill) {
        return experience.get(skill);
    }

    public void setXp(SkillType skill, int xp) {
        experience.put(skill, Math.max(0, Math.min(XpTable.MAX_XP, xp)));
    }

    public int level(SkillType skill) {
        return XpTable.levelForXp(xp(skill));
    }

    /**
     * Awards experience.
     *
     * @return how many levels were gained, so the caller can announce them
     */
    public int addXp(SkillType skill, int amount) {
        if (amount <= 0) {
            return 0;
        }
        int before = level(skill);
        setXp(skill, xp(skill) + amount);
        int after = level(skill);
        if (skill == SkillType.HITPOINTS && after > before) {
            currentHitpoints += after - before;
        }
        return after - before;
    }

    public int maxHitpoints() {
        return level(SkillType.HITPOINTS);
    }

    public int currentHitpoints() {
        return currentHitpoints;
    }

    public void setCurrentHitpoints(int hp) {
        currentHitpoints = Math.max(0, Math.min(maxHitpoints(), hp));
    }

    public void damage(int amount) {
        setCurrentHitpoints(currentHitpoints - amount);
    }

    /** @return the hitpoints actually restored */
    public int heal(int amount) {
        int before = currentHitpoints;
        setCurrentHitpoints(currentHitpoints + amount);
        return currentHitpoints - before;
    }

    public boolean isDead() {
        return currentHitpoints <= 0;
    }

    public int totalLevel() {
        int total = 0;
        for (SkillType skill : SkillType.values()) {
            total += level(skill);
        }
        return total;
    }

    public long totalXp() {
        long total = 0;
        for (SkillType skill : SkillType.values()) {
            total += xp(skill);
        }
        return total;
    }

    /**
     * Combat level, using the melee-only form of the classic formula:
     * {@code base = (defence + hitpoints) / 4} plus {@code 13/40 * (attack + strength)}.
     */
    public int combatLevel() {
        double base = 0.25 * (level(SkillType.DEFENCE) + level(SkillType.HITPOINTS));
        double melee = 0.325 * (level(SkillType.ATTACK) + level(SkillType.STRENGTH));
        return (int) Math.floor(base + melee);
    }
}
