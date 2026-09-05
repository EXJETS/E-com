package com.exjets.aetheria.game;

import com.exjets.aetheria.world.Position;

import java.util.function.Consumer;

/** A one-shot action: walk there, do the thing once, stop. */
public class SimpleAction extends Action {

    private final String description;
    private final Consumer<GameEngine> effect;
    private final boolean adjacent;

    public SimpleAction(Position target, String description, boolean adjacent, Consumer<GameEngine> effect) {
        super(target);
        this.description = description;
        this.adjacent = adjacent;
        this.effect = effect;
    }

    @Override
    public boolean requiresAdjacent() {
        return adjacent;
    }

    @Override
    public String description() {
        return description;
    }

    @Override
    public boolean tick(GameEngine engine) {
        effect.accept(engine);
        return false;
    }
}
