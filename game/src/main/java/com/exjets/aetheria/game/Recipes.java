package com.exjets.aetheria.game;

import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.game.ProcessAction.Recipe;

import java.util.LinkedHashMap;
import java.util.Map;

/** Everything that turns one pile of items into another: smelting, smithing and cooking. */
public final class Recipes {

    public static final Map<String, Recipe> SMELTING = new LinkedHashMap<>();
    public static final Map<String, Recipe> SMITHING = new LinkedHashMap<>();
    public static final Map<String, Recipe> COOKING = new LinkedHashMap<>();

    static {
        SMELTING.put("bronze_bar", new Recipe("Smelting bronze bars",
                inputs("copper_ore", 1, "tin_ore", 1), "bronze_bar", SkillType.SMITHING, 1, 6, 3, false, 0));
        SMELTING.put("iron_bar", Recipe.of("Smelting iron bars",
                "iron_ore", "iron_bar", SkillType.SMITHING, 15, 12, 3));
        SMELTING.put("steel_bar", new Recipe("Smelting steel bars",
                inputs("iron_ore", 1, "coal", 2), "steel_bar", SkillType.SMITHING, 30, 17, 3, false, 0));

        smith("bronze_axe", "bronze_bar", 1, 1, 12);
        smith("bronze_pickaxe", "bronze_bar", 1, 2, 12);
        smith("bronze_dagger", "bronze_bar", 1, 1, 12);
        smith("bronze_sword", "bronze_bar", 1, 4, 12);
        smith("bronze_helm", "bronze_bar", 1, 7, 12);
        smith("bronze_shield", "bronze_bar", 2, 12, 25);
        smith("bronze_platelegs", "bronze_bar", 3, 16, 37);
        smith("bronze_platebody", "bronze_bar", 5, 18, 62);
        smith("iron_axe", "iron_bar", 1, 20, 25);
        smith("iron_pickaxe", "iron_bar", 1, 21, 25);
        smith("iron_sword", "iron_bar", 1, 19, 25);
        smith("iron_helm", "iron_bar", 1, 26, 25);
        smith("iron_shield", "iron_bar", 2, 27, 50);
        smith("iron_platelegs", "iron_bar", 3, 31, 75);
        smith("iron_platebody", "iron_bar", 5, 33, 125);
        smith("steel_axe", "steel_bar", 1, 35, 37);
        smith("steel_pickaxe", "steel_bar", 1, 36, 37);
        smith("steel_sword", "steel_bar", 1, 34, 37);
        smith("steel_helm", "steel_bar", 1, 37, 37);
        smith("steel_shield", "steel_bar", 2, 38, 75);
        smith("steel_platelegs", "steel_bar", 3, 41, 112);
        smith("steel_platebody", "steel_bar", 5, 43, 187);

        cook("raw_shrimp", "shrimp", 1, 30, 34);
        cook("raw_chicken", "cooked_chicken", 1, 30, 33);
        cook("raw_beef", "cooked_meat", 1, 30, 33);
        cook("raw_trout", "trout", 15, 70, 50);
    }

    private Recipes() {
    }

    private static Map<String, Integer> inputs(String first, int firstCount, String second, int secondCount) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put(first, firstCount);
        map.put(second, secondCount);
        return map;
    }

    private static void smith(String product, String bar, int bars, int level, int experience) {
        Map<String, Integer> inputs = new LinkedHashMap<>();
        inputs.put(bar, bars);
        SMITHING.put(product, new Recipe("Smithing", inputs, product, SkillType.SMITHING,
                level, experience, 4, false, 0));
    }

    private static void cook(String raw, String cooked, int level, int experience, int burnFreeLevel) {
        COOKING.put(raw, Recipe.of("Cooking", raw, cooked, SkillType.COOKING, level, experience, 3)
                .burnable(burnFreeLevel));
    }

    /** Bars the anvil menu should offer, in tier order. */
    public static String[] barTypes() {
        return new String[]{"bronze_bar", "iron_bar", "steel_bar"};
    }

    public static boolean isCookable(String itemId) {
        return COOKING.containsKey(itemId);
    }
}
