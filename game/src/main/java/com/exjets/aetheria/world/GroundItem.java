package com.exjets.aetheria.world;

/** An item lying on a tile, either dropped by the player or left behind by a kill. */
public class GroundItem {

    private static final int DESPAWN_TICKS = 300;

    private final String itemId;
    private final int count;
    private final Position position;
    private int timer = DESPAWN_TICKS;

    public GroundItem(String itemId, int count, Position position) {
        this.itemId = itemId;
        this.count = count;
        this.position = position;
    }

    public String itemId() {
        return itemId;
    }

    public int count() {
        return count;
    }

    public Position position() {
        return position;
    }

    /** @return true while the item is still on the ground */
    public boolean tick() {
        return --timer > 0;
    }
}
