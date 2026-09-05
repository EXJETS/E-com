package com.exjets.aetheria.core;

public enum EquipSlot {
    HEAD("Head"),
    BODY("Body"),
    LEGS("Legs"),
    WEAPON("Weapon"),
    SHIELD("Shield");

    private final String displayName;

    EquipSlot(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }
}
