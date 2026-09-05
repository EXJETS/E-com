package com.exjets.aetheria.game;

import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.world.Position;

/** Fighting a creature until one side dies or the player walks away. */
public class CombatAction extends Action {

    private final Npc npc;

    public CombatAction(Npc npc) {
        super(npc.position());
        this.npc = npc;
    }

    public Npc npc() {
        return npc;
    }

    @Override
    public Position target() {
        return npc.position();
    }

    @Override
    public boolean chasesTarget() {
        return true;
    }

    @Override
    public String description() {
        return "Attacking " + npc.name();
    }

    @Override
    public boolean tick(GameEngine engine) {
        if (!npc.isVisible() || npc.isDead()) {
            return false;
        }
        npc.setInCombat(true);
        if (engine.player().canAttackNow()) {
            engine.playerAttack(npc);
            engine.player().startAttackCooldown(GameEngine.ATTACK_SPEED_TICKS);
        }
        return !npc.isDead();
    }

    @Override
    public void onCancel(GameEngine engine) {
        npc.setInCombat(false);
    }
}
