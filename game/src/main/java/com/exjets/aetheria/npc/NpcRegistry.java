package com.exjets.aetheria.npc;

import java.util.LinkedHashMap;
import java.util.Map;

public final class NpcRegistry {

    private static final Map<String, NpcDef> DEFS = new LinkedHashMap<>();

    static {
        register(NpcDef.builder("chicken", "Chicken")
                .stats(3, 1, 1, 1)
                .color(0xF5F5F4)
                .respawn(40)
                .drops(new DropTable()
                        .always("bones", 1, 1)
                        .chance("raw_chicken", 1, 1, 60)
                        .nothing(40)));

        register(NpcDef.builder("cow", "Cow")
                .stats(8, 1, 1, 1)
                .color(0xD6D3D1)
                .respawn(50)
                .drops(new DropTable()
                        .always("bones", 1, 1)
                        .always("raw_beef", 1, 1)
                        .chance("cowhide", 1, 1, 70)
                        .nothing(30)));

        register(NpcDef.builder("giant_rat", "Giant rat")
                .stats(10, 3, 3, 2)
                .color(0x78716C)
                .respawn(50)
                .drops(new DropTable()
                        .always("bones", 1, 1)
                        .chance("coins", 2, 12, 50)
                        .nothing(50)));

        register(NpcDef.builder("goblin", "Goblin")
                .stats(14, 5, 5, 4)
                .bonuses(4, 4, 4)
                .aggressive()
                .color(0x4D7C0F)
                .respawn(60)
                .drops(new DropTable()
                        .always("bones", 1, 1)
                        .chance("coins", 5, 40, 45)
                        .chance("goblin_mail", 1, 1, 15)
                        .chance("bronze_dagger", 1, 1, 8)
                        .chance("bronze_helm", 1, 1, 6)
                        .chance("copper_ore", 1, 2, 6)
                        .nothing(20)));

        register(NpcDef.builder("guard", "Guard")
                .stats(24, 19, 18, 17)
                .bonuses(14, 12, 20)
                .color(0x3B82F6)
                .respawn(90)
                .drops(new DropTable()
                        .always("bones", 1, 1)
                        .chance("coins", 20, 90, 55)
                        .chance("iron_sword", 1, 1, 6)
                        .chance("steel_bar", 1, 1, 5)
                        .nothing(34)));

        register(NpcDef.builder("shopkeeper", "Shopkeeper Bram")
                .stats(20, 1, 1, 1)
                .shopkeeper()
                .color(0xA855F7)
                .dialogue("Welcome to the Ashvale general store!",
                        "I buy anything you drag out of the mine, and I sell the basics."));

        register(NpcDef.builder("aldric", "Aldric the Cook")
                .stats(20, 1, 1, 1)
                .peaceful()
                .color(0xF59E0B)
                .dialogue("The village feast is tonight and my larder is bare!"));
    }

    private NpcRegistry() {
    }

    private static void register(NpcDef.Builder builder) {
        NpcDef def = builder.build();
        DEFS.put(def.key(), def);
    }

    public static NpcDef get(String key) {
        NpcDef def = DEFS.get(key);
        if (def == null) {
            throw new IllegalArgumentException("Unknown npc: " + key);
        }
        return def;
    }

    public static Map<String, NpcDef> all() {
        return DEFS;
    }
}
