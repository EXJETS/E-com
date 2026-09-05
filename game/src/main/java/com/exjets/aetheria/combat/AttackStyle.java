package com.exjets.aetheria.combat;

import com.exjets.aetheria.core.SkillType;

/** Which skill the swing trains, and the small level boost that comes with it. */
public enum AttackStyle {
    ACCURATE("Accurate", SkillType.ATTACK),
    AGGRESSIVE("Aggressive", SkillType.STRENGTH),
    DEFENSIVE("Defensive", SkillType.DEFENCE),
    CONTROLLED("Controlled", null);

    private final String displayName;
    private final SkillType trained;

    AttackStyle(String displayName, SkillType trained) {
        this.displayName = displayName;
        this.trained = trained;
    }

    public String displayName() {
        return displayName;
    }

    /** The skill that gets the experience, or null for the controlled split. */
    public SkillType trainedSkill() {
        return trained;
    }

    public int attackBoost() {
        return this == ACCURATE ? 3 : (this == CONTROLLED ? 1 : 0);
    }

    public int strengthBoost() {
        return this == AGGRESSIVE ? 3 : (this == CONTROLLED ? 1 : 0);
    }

    public int defenceBoost() {
        return this == DEFENSIVE ? 3 : (this == CONTROLLED ? 1 : 0);
    }

    public AttackStyle next() {
        return values()[(ordinal() + 1) % values().length];
    }
}
