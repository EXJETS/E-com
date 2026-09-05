package com.exjets.aetheria.game;

import com.exjets.aetheria.combat.AttackStyle;
import com.exjets.aetheria.combat.CombatFormula;
import com.exjets.aetheria.core.EquipSlot;
import com.exjets.aetheria.core.Inventory;
import com.exjets.aetheria.core.ItemDef;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.npc.DropTable;
import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.world.GroundItem;
import com.exjets.aetheria.world.ObjectType;
import com.exjets.aetheria.world.Pathfinder;
import com.exjets.aetheria.world.Position;
import com.exjets.aetheria.world.World;
import com.exjets.aetheria.world.WorldObject;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.Random;

/**
 * The simulation. Everything happens on a 600ms tick: the player walks, works or fights,
 * creatures wander and retaliate, resources respawn and dropped loot rots away.
 */
public class GameEngine {

    public static final int TICK_MS = 600;
    public static final int ATTACK_SPEED_TICKS = 4;
    private static final int REGEN_INTERVAL_TICKS = 100;
    private static final int AGGRESSION_RANGE = 4;
    private static final int LEASH_RANGE = 12;

    /** Hooks for the interface: the engine never touches Swing itself. */
    public interface Listener {
        default void onOpenBank() {
        }

        default void onOpenShop(Npc npc) {
        }

        default void onOpenSmelting(Position furnace) {
        }

        default void onOpenSmithing(Position anvil) {
        }

        default void onOpenCooking(Position range) {
        }

        default void onDialogue(Npc npc) {
        }

        default void onLevelUp(SkillType skill, int level) {
        }

        default void onDeath() {
        }
    }

    private final World world;
    private final Player player;
    private final MessageLog log = new MessageLog();
    private final Random random;

    private Action action;
    private long tickCount;
    private Listener listener = new Listener() {
    };

    public GameEngine(World world, Player player) {
        this(world, player, new Random());
    }

    public GameEngine(World world, Player player, Random random) {
        this.world = world;
        this.player = player;
        this.random = random;
    }

    public World world() {
        return world;
    }

    public Player player() {
        return player;
    }

    public MessageLog log() {
        return log;
    }

    public Random random() {
        return random;
    }

    public Action currentAction() {
        return action;
    }

    public long tickCount() {
        return tickCount;
    }

    public void setListener(Listener listener) {
        this.listener = listener;
    }

    public void message(String text) {
        log.add(text);
    }

    // ------------------------------------------------------------------ ticking

    public void tick() {
        tickCount++;
        player.tickTimers();
        processMovement();
        processAction();
        processNpcs();
        world.tick();
        regenerate();
        if (player.skills().isDead()) {
            handlePlayerDeath();
        }
    }

    private void processMovement() {
        boolean running = player.isRunning();
        int steps = running ? 2 : 1;
        boolean moved = false;
        for (int i = 0; i < steps && !player.path().isEmpty(); i++) {
            Position next = player.path().peek();
            if (!world.isWalkable(next)) {
                player.clearPath();
                break;
            }
            player.path().poll();
            player.setPosition(next);
            moved = true;
        }
        if (moved && running) {
            player.drainRunEnergy(1);
        } else if (!moved && tickCount % 2 == 0) {
            player.restoreRunEnergy(1);
        }
    }

    private void processAction() {
        if (action == null) {
            return;
        }
        Position target = action.target();
        if (isInRange(target, action.requiresAdjacent())) {
            player.clearPath();
            if (!action.tick(this)) {
                stopAction();
            }
            return;
        }
        if (action.chasesTarget() || !player.isMoving()) {
            Deque<Position> path = Pathfinder.findPath(world, player.position(), target,
                    action.requiresAdjacent());
            if (path.isEmpty()) {
                message("I can't reach that.");
                stopAction();
                return;
            }
            player.setPath(path);
        }
    }

    private boolean isInRange(Position target, boolean adjacent) {
        return adjacent ? player.position().distanceTo(target) <= 1 : player.position().equals(target);
    }

    private void processNpcs() {
        for (Npc npc : world.npcs()) {
            npc.tickTimers();
            if (!npc.isVisible()) {
                continue;
            }
            if (npc.isInCombat()) {
                fightPlayer(npc);
            } else if (npc.def().aggressive() && npc.position().distanceTo(player.position()) <= AGGRESSION_RANGE
                    && npc.def().combatLevel() * 2 >= player.skills().combatLevel()) {
                npc.setInCombat(true);
                message(npc.name() + " lunges at you!");
            } else {
                wander(npc);
            }
        }
    }

    private void fightPlayer(Npc npc) {
        int distance = npc.position().distanceTo(player.position());
        if (distance > LEASH_RANGE) {
            npc.setInCombat(false);
            npc.setPosition(npc.spawn());
            return;
        }
        if (distance <= 1) {
            if (npc.canAttackNow()) {
                npcAttack(npc);
                npc.startAttackCooldown(ATTACK_SPEED_TICKS);
            }
            return;
        }
        stepTowards(npc, player.position());
    }

    private void wander(Npc npc) {
        if (random.nextDouble() > 0.18) {
            return;
        }
        int dx = random.nextInt(3) - 1;
        int dy = random.nextInt(3) - 1;
        Position candidate = npc.position().translate(dx, dy);
        if (world.isWalkable(candidate) && npc.isWithinWanderRange(candidate)) {
            npc.setPosition(candidate);
        }
    }

    private void stepTowards(Npc npc, Position target) {
        int dx = Integer.compare(target.x(), npc.position().x());
        int dy = Integer.compare(target.y(), npc.position().y());
        Position diagonal = npc.position().translate(dx, dy);
        if (world.isWalkable(diagonal)) {
            npc.setPosition(diagonal);
            return;
        }
        Position horizontal = npc.position().translate(dx, 0);
        if (dx != 0 && world.isWalkable(horizontal)) {
            npc.setPosition(horizontal);
            return;
        }
        Position vertical = npc.position().translate(0, dy);
        if (dy != 0 && world.isWalkable(vertical)) {
            npc.setPosition(vertical);
        }
    }

    private void regenerate() {
        if (tickCount % REGEN_INTERVAL_TICKS == 0
                && player.skills().currentHitpoints() < player.skills().maxHitpoints()) {
            player.skills().heal(1);
        }
    }

    // ------------------------------------------------------------------ combat

    public void playerAttack(Npc npc) {
        AttackStyle style = player.attackStyle();
        int attackRating = CombatFormula.rating(
                player.skills().level(SkillType.ATTACK) + style.attackBoost(),
                player.equipment().attackBonus());
        int defenceRating = CombatFormula.rating(npc.def().defenceLevel(), npc.def().defenceBonus());
        int damage = CombatFormula.rollDamage(random, attackRating, defenceRating,
                player.skills().level(SkillType.STRENGTH) + style.strengthBoost(),
                player.equipment().strengthBonus());
        npc.damage(damage);
        npc.setInCombat(true);
        if (damage > 0) {
            awardCombatXp(damage);
        }
        if (npc.isDead()) {
            handleNpcDeath(npc);
        }
    }

    private void npcAttack(Npc npc) {
        int attackRating = CombatFormula.rating(npc.def().attackLevel(), npc.def().attackBonus());
        int defenceRating = CombatFormula.rating(
                player.skills().level(SkillType.DEFENCE) + player.attackStyle().defenceBoost(),
                player.equipment().defenceBonus());
        int damage = CombatFormula.rollDamage(random, attackRating, defenceRating,
                npc.def().strengthLevel(), npc.def().strengthBonus());
        player.takeDamage(damage);
    }

    private void awardCombatXp(int damage) {
        AttackStyle style = player.attackStyle();
        if (style.trainedSkill() != null) {
            awardXp(style.trainedSkill(), damage * 4);
        } else {
            awardXp(SkillType.ATTACK, (int) Math.round(damage * 1.33));
            awardXp(SkillType.STRENGTH, (int) Math.round(damage * 1.33));
            awardXp(SkillType.DEFENCE, (int) Math.round(damage * 1.33));
        }
        awardXp(SkillType.HITPOINTS, (int) Math.round(damage * 1.33));
    }

    private void handleNpcDeath(Npc npc) {
        message("You defeat the " + npc.name().toLowerCase() + ".");
        for (DropTable.Stack drop : npc.def().drops().roll(random)) {
            world.addGroundItem(new GroundItem(drop.itemId(), drop.count(), npc.position()));
        }
        npc.kill();
        if (action instanceof CombatAction combat && combat.npc() == npc) {
            stopAction();
        }
    }

    private void handlePlayerDeath() {
        message("Oh dear, you are dead!");
        player.recordDeath();
        stopAction();
        player.clearPath();
        player.setPosition(world.spawn());
        player.skills().setCurrentHitpoints(player.skills().maxHitpoints());
        player.setRunEnergy(Player.MAX_RUN_ENERGY);
        for (Npc npc : world.npcs()) {
            npc.setInCombat(false);
        }
        message("You wake up back in Ashvale, shaken but whole.");
        listener.onDeath();
    }

    // ------------------------------------------------------------------ progression

    public void awardXp(SkillType skill, int amount) {
        int levelsGained = player.skills().addXp(skill, amount);
        if (levelsGained > 0) {
            int level = player.skills().level(skill);
            message("Congratulations, your " + skill.displayName() + " level is now " + level + "!");
            listener.onLevelUp(skill, level);
        }
    }

    // ------------------------------------------------------------------ player commands

    public void walkTo(Position destination) {
        stopAction();
        Position goal = world.isWalkable(destination) ? destination : world.nearestWalkable(destination, 3);
        if (goal == null) {
            message("You can't walk there.");
            return;
        }
        Deque<Position> path = Pathfinder.findPath(world, player.position(), goal, false);
        if (path.isEmpty() && !player.position().equals(goal)) {
            message("You can't reach there.");
            return;
        }
        player.setPath(path);
    }

    public void setAction(Action newAction) {
        stopAction();
        action = newAction;
        player.setPath(new ArrayDeque<>());
    }

    public void stopAction() {
        if (action != null) {
            action.onCancel(this);
            action = null;
        }
    }

    /** Left or right clicking a piece of scenery. */
    public void interact(WorldObject object) {
        ObjectType type = object.type();
        if (type.isResource()) {
            if (object.isDepleted()) {
                message("There is nothing left to gather here.");
                return;
            }
            setAction(new HarvestAction(object));
            return;
        }
        Position position = object.position();
        switch (type) {
            case BANK_BOOTH -> setAction(new SimpleAction(position, "Banking", true, engine -> {
                engine.message("You open your bank account.");
                engine.listener.onOpenBank();
            }));
            case FURNACE -> setAction(new SimpleAction(position, "Smelting", true,
                    engine -> engine.listener.onOpenSmelting(position)));
            case ANVIL -> setAction(new SimpleAction(position, "Smithing", true,
                    engine -> engine.listener.onOpenSmithing(position)));
            case RANGE, FIRE -> setAction(new SimpleAction(position, "Cooking", true,
                    engine -> engine.listener.onOpenCooking(position)));
            case SHOP_COUNTER -> setAction(new SimpleAction(position, "Trading", true, engine -> {
                Npc keeper = engine.findShopkeeper();
                if (keeper != null) {
                    engine.listener.onOpenShop(keeper);
                } else {
                    engine.message("Nobody is behind the counter.");
                }
            }));
            case DOOR -> walkTo(position);
            default -> message("Nothing interesting happens.");
        }
    }

    private Npc findShopkeeper() {
        return world.npcs().stream()
                .filter(npc -> npc.def().shopkeeper())
                .findFirst()
                .orElse(null);
    }

    public void attack(Npc npc) {
        if (!npc.def().attackable()) {
            message("You can't attack " + npc.name() + ".");
            return;
        }
        setAction(new CombatAction(npc));
    }

    public void talkTo(Npc npc) {
        setAction(new SimpleAction(npc.position(), "Talking to " + npc.name(), true, engine -> {
            if (npc.def().shopkeeper()) {
                engine.listener.onOpenShop(npc);
            } else {
                engine.listener.onDialogue(npc);
            }
        }));
    }

    public void pickUp(GroundItem item) {
        setAction(new SimpleAction(item.position(), "Picking up", false, engine -> {
            if (!engine.world.groundItems().contains(item)) {
                return;
            }
            if (!player.inventory().hasSpaceFor(item.itemId(), item.count())) {
                engine.message("You don't have enough inventory space.");
                return;
            }
            player.inventory().add(item.itemId(), item.count());
            engine.world.removeGroundItem(item);
            engine.message("You pick up " + ItemRegistry.nameOf(item.itemId()).toLowerCase() + ".");
        }));
    }

    // ------------------------------------------------------------------ inventory commands

    public void eat(int slotIndex) {
        Inventory.Slot slot = player.inventory().slot(slotIndex);
        if (slot == null) {
            return;
        }
        ItemDef def = ItemRegistry.get(slot.id);
        if (!def.edible()) {
            message("You can't eat that.");
            return;
        }
        player.inventory().remove(slot.id, 1);
        int healed = player.skills().heal(def.heals());
        message("You eat the " + def.name().toLowerCase() + "."
                + (healed > 0 ? " It heals " + healed + " hitpoints." : ""));
    }

    public void equip(int slotIndex) {
        Inventory.Slot slot = player.inventory().slot(slotIndex);
        if (slot == null) {
            return;
        }
        ItemDef def = ItemRegistry.get(slot.id);
        if (!def.equipable()) {
            message("You can't wear that.");
            return;
        }
        if (player.skills().level(SkillType.ATTACK) < def.attackRequirement()) {
            message("You need an Attack level of " + def.attackRequirement() + " to wield that.");
            return;
        }
        if (player.skills().level(SkillType.DEFENCE) < def.defenceRequirement()) {
            message("You need a Defence level of " + def.defenceRequirement() + " to wear that.");
            return;
        }
        player.inventory().remove(def.id(), 1);
        String replaced = player.equipment().equip(def.id());
        if (replaced != null) {
            player.inventory().add(replaced, 1);
        }
        message("You equip the " + def.name().toLowerCase() + ".");
    }

    public void unequip(EquipSlot slot) {
        String itemId = player.equipment().get(slot);
        if (itemId == null) {
            return;
        }
        if (player.inventory().freeSlots() == 0) {
            message("You don't have enough inventory space.");
            return;
        }
        player.equipment().unequip(slot);
        player.inventory().add(itemId, 1);
        message("You remove the " + ItemRegistry.nameOf(itemId).toLowerCase() + ".");
    }

    public void drop(int slotIndex) {
        Inventory.Slot slot = player.inventory().clearSlot(slotIndex);
        if (slot == null) {
            return;
        }
        world.addGroundItem(new GroundItem(slot.id, slot.count, player.position()));
        message("You drop the " + ItemRegistry.nameOf(slot.id).toLowerCase() + ".");
    }

    /** Using one backpack item on another; today that means a tinderbox and some logs. */
    public void useItemOnItem(int firstIndex, int secondIndex) {
        Inventory.Slot first = player.inventory().slot(firstIndex);
        Inventory.Slot second = player.inventory().slot(secondIndex);
        if (first == null || second == null) {
            return;
        }
        String tinderbox = first.id.equals("tinderbox") ? first.id : (second.id.equals("tinderbox") ? second.id : null);
        String logs = first.id.endsWith("logs") ? first.id : (second.id.endsWith("logs") ? second.id : null);
        if (tinderbox != null && logs != null) {
            lightFire(logs);
            return;
        }
        message("Nothing interesting happens.");
    }

    public void lightFire(String logId) {
        int level = switch (logId) {
            case "oak_logs" -> 15;
            case "willow_logs" -> 30;
            default -> 1;
        };
        int experience = switch (logId) {
            case "oak_logs" -> 60;
            case "willow_logs" -> 90;
            default -> 40;
        };
        if (!player.inventory().contains("tinderbox")) {
            message("You need a tinderbox to light a fire.");
            return;
        }
        if (player.skills().level(SkillType.FIREMAKING) < level) {
            message("You need a Firemaking level of " + level + " to light those.");
            return;
        }
        if (world.objectAt(player.position()) != null) {
            message("You can't light a fire here.");
            return;
        }
        player.inventory().remove(logId, 1);
        WorldObject fire = new WorldObject(ObjectType.FIRE, player.position());
        fire.setLifeTimer(120);
        world.addObject(fire);
        awardXp(SkillType.FIREMAKING, experience);
        message("The fire catches and the logs begin to burn.");
    }

    // ------------------------------------------------------------------ crafting commands

    public void startSmelting(String barId, int quantity, Position furnace) {
        ProcessAction.Recipe recipe = Recipes.SMELTING.get(barId);
        if (recipe == null) {
            return;
        }
        setAction(new ProcessAction(furnace, recipe, quantity));
    }

    public void startSmithing(String productId, int quantity, Position anvil) {
        ProcessAction.Recipe recipe = Recipes.SMITHING.get(productId);
        if (recipe == null) {
            return;
        }
        setAction(new ProcessAction(anvil, recipe, quantity));
    }

    public void startCooking(String rawId, int quantity, Position range) {
        ProcessAction.Recipe recipe = Recipes.COOKING.get(rawId);
        if (recipe == null) {
            return;
        }
        setAction(new ProcessAction(range, recipe, quantity));
    }

    // ------------------------------------------------------------------ bank and shop

    public void bankDeposit(int slotIndex, int count) {
        Inventory.Slot slot = player.inventory().slot(slotIndex);
        if (slot == null) {
            return;
        }
        int moved = player.inventory().remove(slot.id, Math.min(count, slot.count));
        player.bank().deposit(slot.id, moved);
    }

    public void bankDepositAll() {
        for (int i = 0; i < Inventory.CAPACITY; i++) {
            bankDeposit(i, Integer.MAX_VALUE);
        }
        message("You deposit everything you were carrying.");
    }

    public void bankWithdraw(String itemId, int count) {
        int available = player.bank().count(itemId);
        if (available <= 0) {
            return;
        }
        int wanted = Math.min(count, available);
        if (!player.inventory().hasSpaceFor(itemId, 1)) {
            message("You don't have enough inventory space.");
            return;
        }
        int taken = player.bank().withdraw(itemId, wanted);
        int added = player.inventory().add(itemId, taken);
        if (added < taken) {
            player.bank().deposit(itemId, taken - added);
        }
    }

    public void buy(String itemId, int count) {
        int price = Shop.buyPrice(itemId) * count;
        if (player.inventory().count("coins") < price) {
            message("You can't afford that.");
            return;
        }
        if (!player.inventory().hasSpaceFor(itemId, count)) {
            message("You don't have enough inventory space.");
            return;
        }
        player.inventory().remove("coins", price);
        player.inventory().add(itemId, count);
        message("You buy " + count + " x " + ItemRegistry.nameOf(itemId) + " for " + price + " coins.");
    }

    public void sell(int slotIndex, int count) {
        Inventory.Slot slot = player.inventory().slot(slotIndex);
        if (slot == null) {
            return;
        }
        if (slot.id.equals("coins")) {
            message("The shopkeeper has no use for your coins.");
            return;
        }
        int sold = player.inventory().remove(slot.id, Math.min(count, slot.count));
        int payment = Shop.sellPrice(slot.id) * sold;
        player.inventory().add("coins", payment);
        message("You sell " + sold + " x " + ItemRegistry.nameOf(slot.id) + " for " + payment + " coins.");
    }

    // ------------------------------------------------------------------ quest

    /** Runs the Aldric conversation and returns the lines he speaks. */
    public java.util.List<String> talkToAldric() {
        java.util.List<String> lines = new java.util.ArrayList<>();
        switch (player.questStage()) {
            case Quest.NOT_STARTED -> {
                lines.add("The village feast is tonight and my larder is bare!");
                lines.add("Bring me a cooked chicken, some cooked meat and two shrimp");
                lines.add("and I will make it worth your while.");
                player.setQuestStage(Quest.STARTED);
                message("You have started " + Quest.NAME + ".");
            }
            case Quest.STARTED -> {
                if (Quest.hasIngredients(player.inventory())) {
                    Quest.takeIngredients(player.inventory());
                    player.inventory().add("coins", Quest.REWARD_COINS);
                    awardXp(SkillType.COOKING, Quest.REWARD_COOKING_XP);
                    player.setQuestStage(Quest.COMPLETE);
                    lines.add("You've saved the feast! Take this for your trouble.");
                    message("Quest complete: " + Quest.NAME + "!");
                } else {
                    lines.add("Still hungry over here.");
                    for (Map.Entry<String, Integer> need : Quest.requirements().entrySet()) {
                        lines.add(need.getValue() + " x " + ItemRegistry.nameOf(need.getKey())
                                + " (you have " + player.inventory().count(need.getKey()) + ")");
                    }
                }
            }
            default -> lines.add("That feast was the talk of the village. Thank you again!");
        }
        return lines;
    }
}
