package com.exjets.aetheria.npc;

import com.exjets.aetheria.world.Position;

/** A spawned creature: where it stands, how hurt it is and what it is currently doing. */
public class Npc {

    private final NpcDef def;
    private final Position spawn;
    private final int wanderRadius;

    private Position position;
    private int hitpoints;
    private int respawnTimer;
    private int attackCooldown;
    private boolean inCombat;
    private int lastDamage = -1;
    private int hitsplatTimer;

    public Npc(NpcDef def, Position spawn, int wanderRadius) {
        this.def = def;
        this.spawn = spawn;
        this.position = spawn;
        this.wanderRadius = wanderRadius;
        this.hitpoints = def.hitpoints();
    }

    public NpcDef def() {
        return def;
    }

    public String name() {
        return def.name();
    }

    public Position spawn() {
        return spawn;
    }

    public int wanderRadius() {
        return wanderRadius;
    }

    public Position position() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public int hitpoints() {
        return hitpoints;
    }

    public int maxHitpoints() {
        return def.hitpoints();
    }

    public void damage(int amount) {
        hitpoints = Math.max(0, hitpoints - amount);
        lastDamage = amount;
        hitsplatTimer = 3;
    }

    public boolean isDead() {
        return hitpoints <= 0;
    }

    /** Dead creatures stay out of the world until their respawn timer elapses. */
    public boolean isVisible() {
        return respawnTimer <= 0;
    }

    public void kill() {
        respawnTimer = def.respawnTicks();
        inCombat = false;
        attackCooldown = 0;
    }

    public void tickTimers() {
        if (respawnTimer > 0 && --respawnTimer == 0) {
            hitpoints = def.hitpoints();
            position = spawn;
        }
        if (attackCooldown > 0) {
            attackCooldown--;
        }
        if (hitsplatTimer > 0 && --hitsplatTimer == 0) {
            lastDamage = -1;
        }
    }

    public boolean canAttackNow() {
        return attackCooldown <= 0;
    }

    public void startAttackCooldown(int ticks) {
        attackCooldown = ticks;
    }

    public boolean isInCombat() {
        return inCombat;
    }

    public void setInCombat(boolean inCombat) {
        this.inCombat = inCombat;
    }

    /** The damage number floating over the creature, or -1 when there is none. */
    public int lastDamage() {
        return lastDamage;
    }

    public boolean isWithinWanderRange(Position candidate) {
        return candidate.distanceTo(spawn) <= Math.max(wanderRadius, 1);
    }
}
