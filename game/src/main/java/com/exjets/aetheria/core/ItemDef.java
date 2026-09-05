package com.exjets.aetheria.core;

import java.awt.Color;

/** Immutable definition of an item. Built through {@link Builder} and held by {@link ItemRegistry}. */
public final class ItemDef {

    private final String id;
    private final String name;
    private final boolean stackable;
    private final int value;
    private final Color color;
    private final EquipSlot slot;
    private final int attackBonus;
    private final int strengthBonus;
    private final int defenceBonus;
    private final int attackRequirement;
    private final int defenceRequirement;
    private final int heals;
    private final String toolType;
    private final int toolTier;

    private ItemDef(Builder b) {
        this.id = b.id;
        this.name = b.name;
        this.stackable = b.stackable;
        this.value = b.value;
        this.color = b.color;
        this.slot = b.slot;
        this.attackBonus = b.attackBonus;
        this.strengthBonus = b.strengthBonus;
        this.defenceBonus = b.defenceBonus;
        this.attackRequirement = b.attackRequirement;
        this.defenceRequirement = b.defenceRequirement;
        this.heals = b.heals;
        this.toolType = b.toolType;
        this.toolTier = b.toolTier;
    }

    public String id() {
        return id;
    }

    public String name() {
        return name;
    }

    public boolean stackable() {
        return stackable;
    }

    public int value() {
        return value;
    }

    public Color color() {
        return color;
    }

    public EquipSlot slot() {
        return slot;
    }

    public boolean equipable() {
        return slot != null;
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

    public int attackRequirement() {
        return attackRequirement;
    }

    public int defenceRequirement() {
        return defenceRequirement;
    }

    public int heals() {
        return heals;
    }

    public boolean edible() {
        return heals > 0;
    }

    /** "axe", "pickaxe", "net", "rod" or "tinderbox" for tools, otherwise null. */
    public String toolType() {
        return toolType;
    }

    /** Tier doubles as the level requirement to use the tool and as its speed bonus. */
    public int toolTier() {
        return toolTier;
    }

    public boolean isTool(String type) {
        return type.equals(toolType);
    }

    @Override
    public String toString() {
        return name;
    }

    public static Builder builder(String id, String name) {
        return new Builder(id, name);
    }

    public static final class Builder {
        private final String id;
        private final String name;
        private boolean stackable;
        private int value = 1;
        private Color color = new Color(0xA1A1AA);
        private EquipSlot slot;
        private int attackBonus;
        private int strengthBonus;
        private int defenceBonus;
        private int attackRequirement;
        private int defenceRequirement;
        private int heals;
        private String toolType;
        private int toolTier;

        private Builder(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public Builder stackable() {
            this.stackable = true;
            return this;
        }

        public Builder value(int value) {
            this.value = value;
            return this;
        }

        public Builder color(int rgb) {
            this.color = new Color(rgb);
            return this;
        }

        public Builder weapon(EquipSlot slot, int attack, int strength, int defence, int attackRequirement) {
            this.slot = slot;
            this.attackBonus = attack;
            this.strengthBonus = strength;
            this.defenceBonus = defence;
            this.attackRequirement = attackRequirement;
            return this;
        }

        public Builder armour(EquipSlot slot, int defence, int defenceRequirement) {
            this.slot = slot;
            this.defenceBonus = defence;
            this.defenceRequirement = defenceRequirement;
            return this;
        }

        public Builder heals(int heals) {
            this.heals = heals;
            return this;
        }

        public Builder tool(String type, int tier) {
            this.toolType = type;
            this.toolTier = tier;
            return this;
        }

        public ItemDef build() {
            return new ItemDef(this);
        }
    }
}
