package com.exjets.aetheria.core;

import com.exjets.aetheria.combat.AttackStyle;
import com.exjets.aetheria.world.Position;

import java.util.ArrayDeque;
import java.util.Deque;

/** The character: where they are walking, what they are carrying and how well trained they are. */
public class Player {

    public static final int MAX_RUN_ENERGY = 100;

    private String name = "Adventurer";
    private Position position;
    private Deque<Position> path = new ArrayDeque<>();
    private final Skills skills = new Skills();
    private final Inventory inventory = new Inventory();
    private final Bank bank = new Bank();
    private final Equipment equipment = new Equipment();

    private AttackStyle attackStyle = AttackStyle.AGGRESSIVE;
    private boolean running = true;
    private int runEnergy = MAX_RUN_ENERGY;
    private int attackCooldown;
    private int lastDamage = -1;
    private int hitsplatTimer;
    private int questStage;
    private int deaths;

    public Player(Position position) {
        this.position = position;
    }

    public String name() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Position position() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public Deque<Position> path() {
        return path;
    }

    public void setPath(Deque<Position> path) {
        this.path = path;
    }

    public void clearPath() {
        path.clear();
    }

    public boolean isMoving() {
        return !path.isEmpty();
    }

    public Skills skills() {
        return skills;
    }

    public Inventory inventory() {
        return inventory;
    }

    public Bank bank() {
        return bank;
    }

    public Equipment equipment() {
        return equipment;
    }

    public AttackStyle attackStyle() {
        return attackStyle;
    }

    public void setAttackStyle(AttackStyle attackStyle) {
        this.attackStyle = attackStyle;
    }

    public boolean isRunning() {
        return running && runEnergy > 0;
    }

    public boolean runToggled() {
        return running;
    }

    public void setRunning(boolean running) {
        this.running = running;
    }

    public int runEnergy() {
        return runEnergy;
    }

    public void setRunEnergy(int energy) {
        runEnergy = Math.max(0, Math.min(MAX_RUN_ENERGY, energy));
    }

    public void drainRunEnergy(int amount) {
        setRunEnergy(runEnergy - amount);
    }

    public void restoreRunEnergy(int amount) {
        setRunEnergy(runEnergy + amount);
    }

    public boolean canAttackNow() {
        return attackCooldown <= 0;
    }

    public void startAttackCooldown(int ticks) {
        attackCooldown = ticks;
    }

    public void tickTimers() {
        if (attackCooldown > 0) {
            attackCooldown--;
        }
        if (hitsplatTimer > 0 && --hitsplatTimer == 0) {
            lastDamage = -1;
        }
    }

    public void takeDamage(int amount) {
        skills.damage(amount);
        lastDamage = amount;
        hitsplatTimer = 3;
    }

    public int lastDamage() {
        return lastDamage;
    }

    public int questStage() {
        return questStage;
    }

    public void setQuestStage(int stage) {
        questStage = stage;
    }

    public int deaths() {
        return deaths;
    }

    public void recordDeath() {
        deaths++;
    }

    /** The best tool of a kind the player can actually use, or null if they have none. */
    public ItemDef bestTool(String toolType, SkillType skill) {
        ItemDef best = null;
        for (String id : inventory.distinctIds()) {
            best = better(best, ItemRegistry.get(id), toolType, skill);
        }
        for (String id : equipment.all().values()) {
            best = better(best, ItemRegistry.get(id), toolType, skill);
        }
        return best;
    }

    private ItemDef better(ItemDef best, ItemDef candidate, String toolType, SkillType skill) {
        if (!candidate.isTool(toolType) || candidate.toolTier() > skills.level(skill)) {
            return best;
        }
        return best == null || candidate.toolTier() > best.toolTier() ? candidate : best;
    }
}
