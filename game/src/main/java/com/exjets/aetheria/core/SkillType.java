package com.exjets.aetheria.core;

import java.awt.Color;

public enum SkillType {
    ATTACK("Attack", 1, new Color(0x9B1C1C)),
    STRENGTH("Strength", 1, new Color(0x166534)),
    DEFENCE("Defence", 1, new Color(0x1E40AF)),
    HITPOINTS("Hitpoints", 10, new Color(0xB91C1C)),
    WOODCUTTING("Woodcutting", 1, new Color(0x3F6212)),
    MINING("Mining", 1, new Color(0x57534E)),
    FISHING("Fishing", 1, new Color(0x0E7490)),
    COOKING("Cooking", 1, new Color(0x7C2D12)),
    FIREMAKING("Firemaking", 1, new Color(0xC2410C)),
    SMITHING("Smithing", 1, new Color(0x44403C));

    private final String displayName;
    private final int startLevel;
    private final Color color;

    SkillType(String displayName, int startLevel, Color color) {
        this.displayName = displayName;
        this.startLevel = startLevel;
        this.color = color;
    }

    public String displayName() {
        return displayName;
    }

    public int startLevel() {
        return startLevel;
    }

    public Color color() {
        return color;
    }

    /** Skills that contribute to the combat level. */
    public boolean isCombatSkill() {
        return this == ATTACK || this == STRENGTH || this == DEFENCE || this == HITPOINTS;
    }
}
