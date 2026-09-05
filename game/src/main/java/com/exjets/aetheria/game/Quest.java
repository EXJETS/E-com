package com.exjets.aetheria.game;

import com.exjets.aetheria.core.Inventory;

import java.util.LinkedHashMap;
import java.util.Map;

/** "The Village Feast": Aldric wants a cooked meal delivered before nightfall. */
public final class Quest {

    public static final int NOT_STARTED = 0;
    public static final int STARTED = 1;
    public static final int COMPLETE = 2;

    public static final String NAME = "The Village Feast";
    public static final int REWARD_COINS = 500;
    public static final int REWARD_COOKING_XP = 350;

    private static final Map<String, Integer> REQUIREMENTS = new LinkedHashMap<>();

    static {
        REQUIREMENTS.put("cooked_chicken", 1);
        REQUIREMENTS.put("cooked_meat", 1);
        REQUIREMENTS.put("shrimp", 2);
    }

    private Quest() {
    }

    public static Map<String, Integer> requirements() {
        return REQUIREMENTS;
    }

    public static boolean hasIngredients(Inventory inventory) {
        return REQUIREMENTS.entrySet().stream()
                .allMatch(entry -> inventory.contains(entry.getKey(), entry.getValue()));
    }

    public static void takeIngredients(Inventory inventory) {
        REQUIREMENTS.forEach(inventory::remove);
    }

    public static String progressText(int stage) {
        return switch (stage) {
            case STARTED -> "Aldric needs 1 cooked chicken, 1 cooked meat and 2 shrimp.";
            case COMPLETE -> "You cooked for the village feast. Aldric is delighted.";
            default -> "Aldric the Cook is fretting by the crossroads.";
        };
    }
}
