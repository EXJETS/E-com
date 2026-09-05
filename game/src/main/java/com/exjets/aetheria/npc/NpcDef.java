package com.exjets.aetheria.npc;

import java.awt.Color;

/** Static description of a kind of creature or villager. */
public final class NpcDef {

    private final String key;
    private final String name;
    private final int hitpoints;
    private final int attackLevel;
    private final int strengthLevel;
    private final int defenceLevel;
    private final int attackBonus;
    private final int strengthBonus;
    private final int defenceBonus;
    private final boolean attackable;
    private final boolean aggressive;
    private final int respawnTicks;
    private final Color color;
    private final DropTable drops;
    private final String[] dialogue;
    private final boolean shopkeeper;

    private NpcDef(Builder b) {
        this.key = b.key;
        this.name = b.name;
        this.hitpoints = b.hitpoints;
        this.attackLevel = b.attackLevel;
        this.strengthLevel = b.strengthLevel;
        this.defenceLevel = b.defenceLevel;
        this.attackBonus = b.attackBonus;
        this.strengthBonus = b.strengthBonus;
        this.defenceBonus = b.defenceBonus;
        this.attackable = b.attackable;
        this.aggressive = b.aggressive;
        this.respawnTicks = b.respawnTicks;
        this.color = b.color;
        this.drops = b.drops;
        this.dialogue = b.dialogue;
        this.shopkeeper = b.shopkeeper;
    }

    public String key() {
        return key;
    }

    public String name() {
        return name;
    }

    public int hitpoints() {
        return hitpoints;
    }

    public int attackLevel() {
        return attackLevel;
    }

    public int strengthLevel() {
        return strengthLevel;
    }

    public int defenceLevel() {
        return defenceLevel;
    }

    public int attackBonus() {
        return attackBonus;
    }

    public int strengthBonus() {
        return strengthBonus;
    }

    public int defenceBonus() {
        return defenceBonus;
    }

    public boolean attackable() {
        return attackable;
    }

    public boolean aggressive() {
        return aggressive;
    }

    public int respawnTicks() {
        return respawnTicks;
    }

    public Color color() {
        return color;
    }

    public DropTable drops() {
        return drops;
    }

    public String[] dialogue() {
        return dialogue;
    }

    public boolean shopkeeper() {
        return shopkeeper;
    }

    /** The same melee-only combat level formula the player uses. */
    public int combatLevel() {
        double base = 0.25 * (defenceLevel + hitpoints);
        double melee = 0.325 * (attackLevel + strengthLevel);
        return Math.max(1, (int) Math.floor(base + melee));
    }

    public static Builder builder(String key, String name) {
        return new Builder(key, name);
    }

    public static final class Builder {
        private final String key;
        private final String name;
        private int hitpoints = 5;
        private int attackLevel = 1;
        private int strengthLevel = 1;
        private int defenceLevel = 1;
        private int attackBonus;
        private int strengthBonus;
        private int defenceBonus;
        private boolean attackable = true;
        private boolean aggressive;
        private int respawnTicks = 50;
        private Color color = new Color(0xEAB308);
        private DropTable drops = new DropTable();
        private String[] dialogue = new String[0];
        private boolean shopkeeper;

        private Builder(String key, String name) {
            this.key = key;
            this.name = name;
        }

        public Builder stats(int hitpoints, int attack, int strength, int defence) {
            this.hitpoints = hitpoints;
            this.attackLevel = attack;
            this.strengthLevel = strength;
            this.defenceLevel = defence;
            return this;
        }

        public Builder bonuses(int attack, int strength, int defence) {
            this.attackBonus = attack;
            this.strengthBonus = strength;
            this.defenceBonus = defence;
            return this;
        }

        public Builder aggressive() {
            this.aggressive = true;
            return this;
        }

        public Builder peaceful() {
            this.attackable = false;
            return this;
        }

        public Builder respawn(int ticks) {
            this.respawnTicks = ticks;
            return this;
        }

        public Builder color(int rgb) {
            this.color = new Color(rgb);
            return this;
        }

        public Builder drops(DropTable drops) {
            this.drops = drops;
            return this;
        }

        public Builder dialogue(String... lines) {
            this.dialogue = lines;
            return this;
        }

        public Builder shopkeeper() {
            this.shopkeeper = true;
            this.attackable = false;
            return this;
        }

        public NpcDef build() {
            return new NpcDef(this);
        }
    }
}
