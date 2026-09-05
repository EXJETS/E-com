package com.exjets.aetheria.game;

import com.exjets.aetheria.core.ItemRegistry;

import java.util.List;

/** The general store: fixed stock, buys anything at a fraction of its value. */
public final class Shop {

    public static final List<String> STOCK = List.of(
            "bronze_axe", "bronze_pickaxe", "small_net", "fishing_rod", "tinderbox",
            "bronze_dagger", "bronze_sword", "wooden_shield", "bronze_helm", "shrimp");

    private Shop() {
    }

    public static int buyPrice(String itemId) {
        return Math.max(1, (int) Math.round(ItemRegistry.get(itemId).value() * 1.3));
    }

    public static int sellPrice(String itemId) {
        return Math.max(1, (int) Math.round(ItemRegistry.get(itemId).value() * 0.55));
    }
}
