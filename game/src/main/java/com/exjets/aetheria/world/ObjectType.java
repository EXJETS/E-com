package com.exjets.aetheria.world;

import com.exjets.aetheria.core.SkillType;

/**
 * Scenery the player can interact with. Resource nodes carry the skill, level, experience
 * and product needed to harvest them; the rest are stations such as the furnace or a bank booth.
 */
public enum ObjectType {

    TREE('T', "Tree", "Chop down", SkillType.WOODCUTTING, 1, 25, "logs", 12, "axe"),
    OAK('O', "Oak tree", "Chop down", SkillType.WOODCUTTING, 15, 37, "oak_logs", 20, "axe"),
    WILLOW('W', "Willow tree", "Chop down", SkillType.WOODCUTTING, 30, 67, "willow_logs", 25, "axe"),

    COPPER_ROCK('c', "Copper rocks", "Mine", SkillType.MINING, 1, 17, "copper_ore", 8, "pickaxe"),
    TIN_ROCK('t', "Tin rocks", "Mine", SkillType.MINING, 1, 17, "tin_ore", 8, "pickaxe"),
    IRON_ROCK('i', "Iron rocks", "Mine", SkillType.MINING, 15, 35, "iron_ore", 14, "pickaxe"),
    COAL_ROCK('k', "Coal rocks", "Mine", SkillType.MINING, 30, 50, "coal", 30, "pickaxe"),

    SHRIMP_SPOT('f', "Fishing spot", "Net", SkillType.FISHING, 1, 10, "raw_shrimp", 0, "net"),
    TROUT_SPOT('F', "Fishing spot", "Lure", SkillType.FISHING, 20, 50, "raw_trout", 0, "rod"),

    FURNACE('U', "Furnace", "Smelt", null, 0, 0, null, 0, null),
    ANVIL('A', "Anvil", "Smith", null, 0, 0, null, 0, null),
    BANK_BOOTH('B', "Bank booth", "Bank", null, 0, 0, null, 0, null),
    RANGE('R', "Range", "Cook", null, 0, 0, null, 0, null),
    FIRE('*', "Fire", "Cook", null, 0, 0, null, 0, null),
    SHOP_COUNTER('C', "Shop counter", "Trade", null, 0, 0, null, 0, null),
    DOOR('D', "Doorway", "Walk through", null, 0, 0, null, 0, null);

    private final char symbol;
    private final String displayName;
    private final String action;
    private final SkillType skill;
    private final int levelRequired;
    private final int experience;
    private final String product;
    private final int respawnTicks;
    private final String toolType;

    ObjectType(char symbol, String displayName, String action, SkillType skill, int levelRequired,
               int experience, String product, int respawnTicks, String toolType) {
        this.symbol = symbol;
        this.displayName = displayName;
        this.action = action;
        this.skill = skill;
        this.levelRequired = levelRequired;
        this.experience = experience;
        this.product = product;
        this.respawnTicks = respawnTicks;
        this.toolType = toolType;
    }

    public char symbol() {
        return symbol;
    }

    public String displayName() {
        return displayName;
    }

    /** The verb shown in the right click menu, e.g. "Chop down". */
    public String action() {
        return action;
    }

    public SkillType skill() {
        return skill;
    }

    public int levelRequired() {
        return levelRequired;
    }

    public int experience() {
        return experience;
    }

    public String product() {
        return product;
    }

    /** How long a depleted node takes to come back; 0 means it never depletes. */
    public int respawnTicks() {
        return respawnTicks;
    }

    public String toolType() {
        return toolType;
    }

    public boolean isResource() {
        return skill != null;
    }

    /** Fishing spots sit on water and are worked from the bank, everything else blocks its tile. */
    public boolean blocksMovement() {
        return this != DOOR && this != SHRIMP_SPOT && this != TROUT_SPOT && this != SHOP_COUNTER;
    }

    public static ObjectType fromSymbol(char symbol) {
        for (ObjectType type : values()) {
            if (type.symbol == symbol) {
                return type;
            }
        }
        return null;
    }
}
