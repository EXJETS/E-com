package com.exjets.aetheria.game;

import com.exjets.aetheria.world.Position;

/**
 * Something the player is busy with. The engine walks them to {@link #target()} first and
 * then calls {@link #tick(GameEngine)} once per game tick until it returns false.
 */
public abstract class Action {

    private final Position target;

    protected Action(Position target) {
        this.target = target;
    }

    /** Where the action happens; the player works from this tile or one next to it. */
    public Position target() {
        return target;
    }

    /** Most actions are performed from an adjacent tile; walking ends on the tile itself. */
    public boolean requiresAdjacent() {
        return true;
    }

    /** True when the target moves, so the engine has to re-path towards it every tick. */
    public boolean chasesTarget() {
        return false;
    }

    /** Shown in the status line while the action runs. */
    public abstract String description();

    /** @return true to keep going next tick, false when the action is finished */
    public abstract boolean tick(GameEngine engine);

    /** Called when the player interrupts the action, for example by clicking elsewhere. */
    public void onCancel(GameEngine engine) {
    }
}
