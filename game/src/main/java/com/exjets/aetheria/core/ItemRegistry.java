package com.exjets.aetheria.core;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/** Every item in the game, keyed by a stable string id used by saves too. */
public final class ItemRegistry {

    private static final Map<String, ItemDef> ITEMS = new LinkedHashMap<>();

    static {
        // --- currency and junk ---
        register(ItemDef.builder("coins", "Coins").stackable().value(1).color(0xFACC15));
        register(ItemDef.builder("bones", "Bones").value(2).color(0xE7E5E4));
        register(ItemDef.builder("cowhide", "Cowhide").value(12).color(0x8B5E3C));
        register(ItemDef.builder("goblin_mail", "Goblin mail").value(20).color(0x4D7C0F));

        // --- woodcutting ---
        register(ItemDef.builder("logs", "Logs").value(4).color(0x92400E));
        register(ItemDef.builder("oak_logs", "Oak logs").value(20).color(0x7C3F12));
        register(ItemDef.builder("willow_logs", "Willow logs").value(40).color(0x65A30D));

        // --- mining and smithing ---
        register(ItemDef.builder("copper_ore", "Copper ore").value(8).color(0xB45309));
        register(ItemDef.builder("tin_ore", "Tin ore").value(8).color(0xA8A29E));
        register(ItemDef.builder("iron_ore", "Iron ore").value(28).color(0x7F1D1D));
        register(ItemDef.builder("coal", "Coal").value(45).color(0x27272A));
        register(ItemDef.builder("bronze_bar", "Bronze bar").value(30).color(0xB45309));
        register(ItemDef.builder("iron_bar", "Iron bar").value(70).color(0x9CA3AF));
        register(ItemDef.builder("steel_bar", "Steel bar").value(160).color(0xCBD5E1));

        // --- food chain ---
        register(ItemDef.builder("raw_shrimp", "Raw shrimp").value(4).color(0xFDA4AF));
        register(ItemDef.builder("shrimp", "Shrimp").value(8).heals(3).color(0xFB7185));
        register(ItemDef.builder("raw_trout", "Raw trout").value(30).color(0x93C5FD));
        register(ItemDef.builder("trout", "Trout").value(50).heals(7).color(0x60A5FA));
        register(ItemDef.builder("raw_chicken", "Raw chicken").value(5).color(0xFECACA));
        register(ItemDef.builder("cooked_chicken", "Cooked chicken").value(12).heals(4).color(0xD97706));
        register(ItemDef.builder("raw_beef", "Raw beef").value(6).color(0xEF4444));
        register(ItemDef.builder("cooked_meat", "Cooked meat").value(14).heals(5).color(0x9A3412));
        register(ItemDef.builder("burnt_food", "Burnt food").value(1).color(0x1C1917));

        // --- tools ---
        register(ItemDef.builder("tinderbox", "Tinderbox").value(10).color(0xA16207).tool("tinderbox", 1));
        register(ItemDef.builder("small_net", "Small fishing net").value(15).color(0x84CC16).tool("net", 1));
        register(ItemDef.builder("fishing_rod", "Fishing rod").value(30).color(0xA16207).tool("rod", 1));
        register(ItemDef.builder("bronze_axe", "Bronze axe").value(30).color(0xB45309)
                .tool("axe", 1).weapon(EquipSlot.WEAPON, 3, 3, 0, 1));
        register(ItemDef.builder("iron_axe", "Iron axe").value(90).color(0x9CA3AF)
                .tool("axe", 5).weapon(EquipSlot.WEAPON, 5, 5, 0, 1));
        register(ItemDef.builder("steel_axe", "Steel axe").value(200).color(0xCBD5E1)
                .tool("axe", 10).weapon(EquipSlot.WEAPON, 8, 8, 0, 5));
        register(ItemDef.builder("bronze_pickaxe", "Bronze pickaxe").value(30).color(0xB45309)
                .tool("pickaxe", 1).weapon(EquipSlot.WEAPON, 3, 2, 0, 1));
        register(ItemDef.builder("iron_pickaxe", "Iron pickaxe").value(90).color(0x9CA3AF)
                .tool("pickaxe", 5).weapon(EquipSlot.WEAPON, 5, 4, 0, 1));
        register(ItemDef.builder("steel_pickaxe", "Steel pickaxe").value(200).color(0xCBD5E1)
                .tool("pickaxe", 10).weapon(EquipSlot.WEAPON, 8, 6, 0, 5));

        // --- weapons ---
        register(ItemDef.builder("bronze_dagger", "Bronze dagger").value(20).color(0xB45309)
                .weapon(EquipSlot.WEAPON, 4, 3, 0, 1));
        register(ItemDef.builder("bronze_sword", "Bronze sword").value(52).color(0xB45309)
                .weapon(EquipSlot.WEAPON, 7, 6, 0, 1));
        register(ItemDef.builder("iron_sword", "Iron sword").value(140).color(0x9CA3AF)
                .weapon(EquipSlot.WEAPON, 11, 10, 0, 1));
        register(ItemDef.builder("steel_sword", "Steel sword").value(325).color(0xCBD5E1)
                .weapon(EquipSlot.WEAPON, 17, 16, 0, 5));
        register(ItemDef.builder("mithril_sword", "Mithril sword").value(910).color(0x818CF8)
                .weapon(EquipSlot.WEAPON, 24, 23, 0, 20));

        // --- armour ---
        register(ItemDef.builder("wooden_shield", "Wooden shield").value(20).color(0x92400E)
                .armour(EquipSlot.SHIELD, 4, 1));
        register(ItemDef.builder("bronze_shield", "Bronze shield").value(68).color(0xB45309)
                .armour(EquipSlot.SHIELD, 8, 1));
        register(ItemDef.builder("iron_shield", "Iron shield").value(182).color(0x9CA3AF)
                .armour(EquipSlot.SHIELD, 14, 1));
        register(ItemDef.builder("steel_shield", "Steel shield").value(455).color(0xCBD5E1)
                .armour(EquipSlot.SHIELD, 21, 5));
        register(ItemDef.builder("bronze_helm", "Bronze helm").value(36).color(0xB45309)
                .armour(EquipSlot.HEAD, 5, 1));
        register(ItemDef.builder("iron_helm", "Iron helm").value(98).color(0x9CA3AF)
                .armour(EquipSlot.HEAD, 9, 1));
        register(ItemDef.builder("steel_helm", "Steel helm").value(245).color(0xCBD5E1)
                .armour(EquipSlot.HEAD, 13, 5));
        register(ItemDef.builder("bronze_platebody", "Bronze platebody").value(160).color(0xB45309)
                .armour(EquipSlot.BODY, 12, 1));
        register(ItemDef.builder("iron_platebody", "Iron platebody").value(400).color(0x9CA3AF)
                .armour(EquipSlot.BODY, 20, 1));
        register(ItemDef.builder("steel_platebody", "Steel platebody").value(1000).color(0xCBD5E1)
                .armour(EquipSlot.BODY, 30, 5));
        register(ItemDef.builder("bronze_platelegs", "Bronze platelegs").value(80).color(0xB45309)
                .armour(EquipSlot.LEGS, 9, 1));
        register(ItemDef.builder("iron_platelegs", "Iron platelegs").value(200).color(0x9CA3AF)
                .armour(EquipSlot.LEGS, 15, 1));
        register(ItemDef.builder("steel_platelegs", "Steel platelegs").value(500).color(0xCBD5E1)
                .armour(EquipSlot.LEGS, 23, 5));
    }

    private ItemRegistry() {
    }

    private static void register(ItemDef.Builder builder) {
        ItemDef def = builder.build();
        ITEMS.put(def.id(), def);
    }

    public static ItemDef get(String id) {
        ItemDef def = ITEMS.get(id);
        if (def == null) {
            throw new IllegalArgumentException("Unknown item: " + id);
        }
        return def;
    }

    public static boolean exists(String id) {
        return ITEMS.containsKey(id);
    }

    public static String nameOf(String id) {
        return get(id).name();
    }

    public static Collection<ItemDef> all() {
        return ITEMS.values();
    }
}
