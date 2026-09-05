package com.exjets.aetheria.core;

import java.util.EnumMap;
import java.util.Map;

/** Worn gear, one item per slot, contributing bonuses to the combat formulas. */
public class Equipment {

    private final Map<EquipSlot, String> worn = new EnumMap<>(EquipSlot.class);

    public String get(EquipSlot slot) {
        return worn.get(slot);
    }

    public boolean isWearing(String itemId) {
        return worn.containsValue(itemId);
    }

    /** @return the item that was previously in the slot, or null */
    public String equip(String itemId) {
        ItemDef def = ItemRegistry.get(itemId);
        if (!def.equipable()) {
            throw new IllegalArgumentException(def.name() + " cannot be equipped");
        }
        return worn.put(def.slot(), itemId);
    }

    public String unequip(EquipSlot slot) {
        return worn.remove(slot);
    }

    public Map<EquipSlot, String> all() {
        return worn;
    }

    public int attackBonus() {
        return sum(ItemDef::attackBonus);
    }

    public int strengthBonus() {
        return sum(ItemDef::strengthBonus);
    }

    public int defenceBonus() {
        return sum(ItemDef::defenceBonus);
    }

    public void clear() {
        worn.clear();
    }

    private int sum(java.util.function.ToIntFunction<ItemDef> field) {
        int total = 0;
        for (String id : worn.values()) {
            total += field.applyAsInt(ItemRegistry.get(id));
        }
        return total;
    }
}
