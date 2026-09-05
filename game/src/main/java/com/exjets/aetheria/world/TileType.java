package com.exjets.aetheria.world;

import java.awt.Color;

public enum TileType {
    GRASS('.', "Grass", true, new Color(0x4C7A34)),
    DIRT(',', "Dirt", true, new Color(0x7A6242)),
    ROAD('_', "Road", true, new Color(0x9B8B6A)),
    SAND('s', "Sand", true, new Color(0xC8B681)),
    FLOOR('=', "Floor", true, new Color(0x6E5E4A)),
    WATER('~', "Water", false, new Color(0x2E6C8E)),
    WALL('#', "Wall", false, new Color(0x5B5651)),
    FENCE('x', "Fence", false, new Color(0x6B4F2A));

    private final char symbol;
    private final String displayName;
    private final boolean walkable;
    private final Color color;

    TileType(char symbol, String displayName, boolean walkable, Color color) {
        this.symbol = symbol;
        this.displayName = displayName;
        this.walkable = walkable;
        this.color = color;
    }

    public char symbol() {
        return symbol;
    }

    public String displayName() {
        return displayName;
    }

    public boolean walkable() {
        return walkable;
    }

    public Color color() {
        return color;
    }

    public static TileType fromSymbol(char symbol) {
        for (TileType type : values()) {
            if (type.symbol == symbol) {
                return type;
            }
        }
        return GRASS;
    }
}
