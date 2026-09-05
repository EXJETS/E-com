package com.exjets.aetheria.world;

/** A live instance of scenery: a specific tree, rock, anvil or fire. */
public class WorldObject {

    private final ObjectType type;
    private final Position position;
    private int respawnTimer;
    private int lifeTimer = -1;

    public WorldObject(ObjectType type, Position position) {
        this.type = type;
        this.position = position;
    }

    public ObjectType type() {
        return type;
    }

    public Position position() {
        return position;
    }

    /** A depleted node is a stump or an empty rock until its timer runs out. */
    public boolean isDepleted() {
        return respawnTimer > 0;
    }

    public void deplete() {
        if (type.respawnTicks() > 0) {
            respawnTimer = type.respawnTicks();
        }
    }

    /** Fires burn out; set a positive number of ticks to make this object temporary. */
    public void setLifeTimer(int ticks) {
        lifeTimer = ticks;
    }

    public boolean isExpired() {
        return lifeTimer == 0;
    }

    /** @return true while the object should stay in the world */
    public boolean tick() {
        if (respawnTimer > 0) {
            respawnTimer--;
        }
        if (lifeTimer > 0) {
            lifeTimer--;
        }
        return lifeTimer != 0;
    }

    public boolean blocksMovement() {
        return type.blocksMovement();
    }
}
