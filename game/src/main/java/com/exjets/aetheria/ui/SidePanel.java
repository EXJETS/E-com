package com.exjets.aetheria.ui;

import com.exjets.aetheria.core.EquipSlot;
import com.exjets.aetheria.core.Inventory;
import com.exjets.aetheria.core.ItemDef;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.core.XpTable;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.game.Quest;
import com.exjets.aetheria.game.Recipes;

import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/** The right hand column: vitals, backpack, skills, worn gear and the quest journal. */
public class SidePanel extends JPanel {

    private enum Tab {
        INVENTORY("Items"), SKILLS("Skills"), EQUIPMENT("Worn"), QUEST("Quest");

        private final String label;

        Tab(String label) {
            this.label = label;
        }
    }

    private static final int WIDTH = 248;
    private static final int SLOT_SIZE = 44;
    private static final int COLUMNS = 4;
    private static final int HUD_HEIGHT = 108;
    private static final int TAB_HEIGHT = 26;

    private final GameEngine engine;
    private Tab tab = Tab.INVENTORY;
    private int useSlot = -1;
    private int hoverSlot = -1;

    public SidePanel(GameEngine engine) {
        this.engine = engine;
        setPreferredSize(new Dimension(WIDTH, 560));
        setBackground(Theme.CHROME);
        MouseAdapter mouse = new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent event) {
                handleClick(event);
            }

            @Override
            public void mouseMoved(MouseEvent event) {
                int slot = slotAt(event.getX(), event.getY());
                if (slot != hoverSlot) {
                    hoverSlot = slot;
                    setToolTipText(tooltipFor(slot));
                    repaint();
                }
            }

            @Override
            public void mouseExited(MouseEvent event) {
                hoverSlot = -1;
                repaint();
            }
        };
        addMouseListener(mouse);
        addMouseMotionListener(mouse);
        setToolTipText("");
    }

    private void handleClick(MouseEvent event) {
        int y = event.getY();
        if (y < HUD_HEIGHT) {
            handleHudClick(event);
            return;
        }
        if (y < HUD_HEIGHT + TAB_HEIGHT) {
            int index = event.getX() * Tab.values().length / WIDTH;
            tab = Tab.values()[Math.min(index, Tab.values().length - 1)];
            useSlot = -1;
            repaint();
            return;
        }
        switch (tab) {
            case INVENTORY -> handleInventoryClick(event);
            case EQUIPMENT -> handleEquipmentClick(event);
            default -> {
            }
        }
        repaint();
    }

    private void handleHudClick(MouseEvent event) {
        Rectangle styleButton = new Rectangle(8, 76, WIDTH - 16, 24);
        if (styleButton.contains(event.getPoint())) {
            Player player = engine.player();
            player.setAttackStyle(player.attackStyle().next());
            engine.message("Attack style: " + player.attackStyle().displayName() + ".");
            repaint();
        }
    }

    private void handleInventoryClick(MouseEvent event) {
        int index = slotAt(event.getX(), event.getY());
        if (index < 0) {
            return;
        }
        Inventory.Slot slot = engine.player().inventory().slot(index);
        if (slot == null) {
            useSlot = -1;
            return;
        }
        if (event.getButton() == MouseEvent.BUTTON3 || event.isPopupTrigger()) {
            showItemMenu(event, index, slot);
            return;
        }
        if (useSlot >= 0 && useSlot != index) {
            engine.useItemOnItem(useSlot, index);
            useSlot = -1;
            return;
        }
        ItemDef def = ItemRegistry.get(slot.id);
        if (def.edible()) {
            engine.eat(index);
        } else if (def.equipable()) {
            engine.equip(index);
        } else {
            useSlot = index;
            engine.message("Use " + def.name().toLowerCase() + " with...");
        }
    }

    private void showItemMenu(MouseEvent event, int index, Inventory.Slot slot) {
        ItemDef def = ItemRegistry.get(slot.id);
        JPopupMenu menu = new JPopupMenu();
        if (def.edible()) {
            menu.add(item("Eat", () -> engine.eat(index)));
        }
        if (def.equipable()) {
            menu.add(item("Wear / wield", () -> engine.equip(index)));
        }
        if (slot.id.endsWith("logs")) {
            menu.add(item("Light fire", () -> engine.lightFire(slot.id)));
        }
        if (Recipes.isCookable(slot.id)) {
            menu.add(item("Cook (needs a range or fire)",
                    () -> engine.message("Use a range or a fire to cook that.")));
        }
        menu.add(item("Use", () -> {
            useSlot = index;
            engine.message("Use " + def.name().toLowerCase() + " with...");
        }));
        menu.add(item("Drop", () -> engine.drop(index)));
        menu.add(item("Examine", () -> engine.message(describe(def, slot.count))));
        menu.show(this, event.getX(), event.getY());
    }

    private void handleEquipmentClick(MouseEvent event) {
        EquipSlot[] slots = EquipSlot.values();
        int index = (event.getY() - contentTop()) / 34;
        if (index >= 0 && index < slots.length) {
            engine.unequip(slots[index]);
        }
    }

    private JMenuItem item(String label, Runnable onClick) {
        JMenuItem menuItem = new JMenuItem(label);
        menuItem.addActionListener(event -> {
            onClick.run();
            repaint();
        });
        return menuItem;
    }

    private String describe(ItemDef def, int count) {
        StringBuilder text = new StringBuilder(def.name());
        if (count > 1) {
            text.append(" x ").append(count);
        }
        text.append(" - worth ").append(def.value()).append(" coins");
        if (def.equipable()) {
            text.append(" (attack ").append(def.attackBonus())
                    .append(", strength ").append(def.strengthBonus())
                    .append(", defence ").append(def.defenceBonus()).append(")");
        }
        if (def.edible()) {
            text.append(", heals ").append(def.heals());
        }
        return text + ".";
    }

    private int contentTop() {
        return HUD_HEIGHT + TAB_HEIGHT + 8;
    }

    private int slotAt(int x, int y) {
        if (tab != Tab.INVENTORY || y < contentTop()) {
            return -1;
        }
        int column = (x - 12) / SLOT_SIZE;
        int row = (y - contentTop()) / SLOT_SIZE;
        if (column < 0 || column >= COLUMNS || row < 0) {
            return -1;
        }
        int index = row * COLUMNS + column;
        return index < Inventory.CAPACITY ? index : -1;
    }

    private String tooltipFor(int index) {
        if (index < 0) {
            return null;
        }
        Inventory.Slot slot = engine.player().inventory().slot(index);
        return slot == null ? null : describe(ItemRegistry.get(slot.id), slot.count);
    }

    @Override
    protected void paintComponent(Graphics graphics) {
        super.paintComponent(graphics);
        Graphics2D g = (Graphics2D) graphics.create();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        drawHud(g);
        drawTabs(g);
        switch (tab) {
            case INVENTORY -> drawInventory(g);
            case SKILLS -> drawSkills(g);
            case EQUIPMENT -> drawEquipment(g);
            case QUEST -> drawQuest(g);
        }
        g.dispose();
    }

    private void drawHud(Graphics2D g) {
        Player player = engine.player();
        g.setColor(Theme.CHROME_LIGHT);
        g.fillRect(0, 0, WIDTH, HUD_HEIGHT);
        g.setColor(Theme.TEXT);
        g.setFont(Theme.TITLE);
        g.drawString(player.name(), 10, 20);
        g.setFont(Theme.SMALL);
        g.setColor(Theme.TEXT_DIM);
        g.drawString("Combat level " + player.skills().combatLevel()
                + "   Total " + player.skills().totalLevel(), 10, 34);

        int hp = player.skills().currentHitpoints();
        int maxHp = player.skills().maxHitpoints();
        drawBar(g, 10, 42, WIDTH - 20, 12, hp / (double) maxHp, Theme.HEALTH);
        g.setColor(new Color(0x14301E));
        g.setFont(Theme.SMALL);
        g.drawString("Hitpoints  " + hp + " / " + maxHp, 16, 52);
        drawBar(g, 10, 58, WIDTH - 20, 8, player.runEnergy() / (double) Player.MAX_RUN_ENERGY,
                Theme.ENERGY);
        g.setColor(new Color(0x3B2A05));
        g.drawString("Energy  " + player.runEnergy() + "%", 16, 65);

        g.setColor(Theme.SLOT);
        g.fillRoundRect(8, 76, WIDTH - 16, 24, 6, 6);
        g.setColor(Theme.BORDER);
        g.drawRoundRect(8, 76, WIDTH - 16, 24, 6, 6);
        g.setColor(Theme.ACCENT);
        g.setFont(Theme.UI_BOLD);
        String style = "Style: " + player.attackStyle().displayName()
                + (player.runToggled() ? "   Run on" : "   Run off");
        g.drawString(style, 16, 92);
    }

    private void drawBar(Graphics2D g, int x, int y, int width, int height, double fraction, Color color) {
        g.setColor(Theme.SLOT);
        g.fillRoundRect(x, y, width, height, 4, 4);
        g.setColor(color);
        g.fillRoundRect(x, y, (int) (width * Math.max(0, Math.min(1, fraction))), height, 4, 4);
    }

    private void drawTabs(Graphics2D g) {
        Tab[] tabs = Tab.values();
        int tabWidth = WIDTH / tabs.length;
        g.setFont(Theme.SMALL.deriveFont(java.awt.Font.BOLD, 11f));
        for (int i = 0; i < tabs.length; i++) {
            boolean active = tabs[i] == tab;
            g.setColor(active ? Theme.CHROME : Theme.SLOT);
            g.fillRect(i * tabWidth, HUD_HEIGHT, tabWidth, TAB_HEIGHT);
            g.setColor(active ? Theme.ACCENT : Theme.TEXT_DIM);
            String label = tabs[i].label;
            g.drawString(label, i * tabWidth + (tabWidth - g.getFontMetrics().stringWidth(label)) / 2,
                    HUD_HEIGHT + 18);
        }
        g.setColor(Theme.BORDER);
        g.drawLine(0, HUD_HEIGHT + TAB_HEIGHT, WIDTH, HUD_HEIGHT + TAB_HEIGHT);
    }

    private void drawInventory(Graphics2D g) {
        Inventory inventory = engine.player().inventory();
        int top = contentTop();
        for (int index = 0; index < Inventory.CAPACITY; index++) {
            int x = 12 + (index % COLUMNS) * SLOT_SIZE;
            int y = top + (index / COLUMNS) * SLOT_SIZE;
            g.setColor(Theme.SLOT);
            g.fillRoundRect(x, y, SLOT_SIZE - 4, SLOT_SIZE - 4, 6, 6);
            g.setColor(index == useSlot ? Theme.ACCENT : (index == hoverSlot ? Theme.BORDER : Theme.CHROME_LIGHT));
            g.drawRoundRect(x, y, SLOT_SIZE - 4, SLOT_SIZE - 4, 6, 6);
            Inventory.Slot slot = inventory.slot(index);
            if (slot == null) {
                continue;
            }
            ItemDef def = ItemRegistry.get(slot.id);
            Sprites.drawItem(g, def, x + 4, y + 4, SLOT_SIZE - 12);
            if (slot.count > 1) {
                g.setFont(Theme.SMALL);
                g.setColor(slot.count >= 1000 ? Color.WHITE : Theme.ACCENT);
                g.drawString(formatCount(slot.count), x + 3, y + 12);
            }
        }
        int bottom = top + (Inventory.CAPACITY / COLUMNS) * SLOT_SIZE + 12;
        g.setFont(Theme.SMALL);
        g.setColor(Theme.TEXT_DIM);
        g.drawString(inventory.usedSlots() + " / " + Inventory.CAPACITY + " slots used", 12, bottom);
        g.drawString("Left click to use, right click for more.", 12, bottom + 14);
    }

    private String formatCount(int count) {
        if (count >= 1_000_000) {
            return count / 1_000_000 + "M";
        }
        if (count >= 100_000) {
            return count / 1000 + "K";
        }
        return String.valueOf(count);
    }

    private void drawSkills(Graphics2D g) {
        int top = contentTop();
        SkillType[] skills = SkillType.values();
        int boxWidth = (WIDTH - 24) / 2;
        int boxHeight = 40;
        g.setFont(Theme.UI_BOLD);
        for (int i = 0; i < skills.length; i++) {
            SkillType skill = skills[i];
            int x = 12 + (i % 2) * (boxWidth + 2);
            int y = top + (i / 2) * (boxHeight + 4);
            g.setColor(Theme.SLOT);
            g.fillRoundRect(x, y, boxWidth, boxHeight, 6, 6);
            g.setColor(skill.color());
            g.fillRoundRect(x, y, 4, boxHeight, 4, 4);
            g.setColor(Theme.TEXT);
            g.setFont(Theme.UI_BOLD);
            g.drawString(skill.displayName(), x + 10, y + 15);
            g.setFont(Theme.SMALL);
            g.setColor(Theme.ACCENT);
            int level = engine.player().skills().level(skill);
            g.drawString(level + " / 99", x + boxWidth - 44, y + 15);
            int xp = engine.player().skills().xp(skill);
            g.setColor(Theme.CHROME_LIGHT);
            g.fillRect(x + 10, y + 22, boxWidth - 20, 5);
            g.setColor(skill.color().brighter());
            g.fillRect(x + 10, y + 22, (int) ((boxWidth - 20) * XpTable.levelProgress(xp)), 5);
            g.setColor(Theme.TEXT_DIM);
            g.drawString(xp + " xp", x + 10, y + 36);
        }
        int bottom = top + (skills.length / 2) * 44 + 14;
        g.setFont(Theme.SMALL);
        g.setColor(Theme.TEXT_DIM);
        g.drawString("Total experience: " + engine.player().skills().totalXp(), 12, bottom);
    }

    private void drawEquipment(Graphics2D g) {
        int top = contentTop();
        g.setFont(Theme.UI_BOLD);
        EquipSlot[] slots = EquipSlot.values();
        for (int i = 0; i < slots.length; i++) {
            int y = top + i * 34;
            g.setColor(Theme.SLOT);
            g.fillRoundRect(12, y, WIDTH - 24, 30, 6, 6);
            String itemId = engine.player().equipment().get(slots[i]);
            g.setColor(Theme.TEXT_DIM);
            g.setFont(Theme.SMALL);
            g.drawString(slots[i].displayName(), 20, y + 12);
            g.setFont(Theme.UI_BOLD);
            g.setColor(itemId == null ? Theme.TEXT_DIM : Theme.TEXT);
            g.drawString(itemId == null ? "empty" : ItemRegistry.nameOf(itemId), 20, y + 25);
            if (itemId != null) {
                Sprites.drawItem(g, ItemRegistry.get(itemId), WIDTH - 52, y + 1, 28);
            }
        }
        int y = top + slots.length * 34 + 16;
        g.setColor(Theme.TEXT);
        g.setFont(Theme.UI_BOLD);
        g.drawString("Bonuses", 12, y);
        g.setFont(Theme.UI);
        g.setColor(Theme.ACCENT);
        g.drawString("Attack  +" + engine.player().equipment().attackBonus(), 12, y + 18);
        g.drawString("Strength  +" + engine.player().equipment().strengthBonus(), 12, y + 34);
        g.drawString("Defence  +" + engine.player().equipment().defenceBonus(), 12, y + 50);
        g.setFont(Theme.SMALL);
        g.setColor(Theme.TEXT_DIM);
        g.drawString("Click a slot to take the item off.", 12, y + 72);
    }

    private void drawQuest(Graphics2D g) {
        int top = contentTop();
        g.setColor(Theme.TEXT);
        g.setFont(Theme.TITLE);
        g.drawString(Quest.NAME, 12, top + 4);
        int stage = engine.player().questStage();
        g.setFont(Theme.UI_BOLD);
        g.setColor(stage == Quest.COMPLETE ? Theme.HEALTH : (stage == Quest.STARTED ? Theme.ACCENT : Theme.TEXT_DIM));
        g.drawString(stage == Quest.COMPLETE ? "Complete" : (stage == Quest.STARTED ? "In progress" : "Not started"),
                12, top + 24);
        g.setFont(Theme.UI);
        g.setColor(Theme.TEXT_DIM);
        int y = top + 48;
        for (String line : wrap(Quest.progressText(stage), 32)) {
            g.drawString(line, 12, y);
            y += 16;
        }
        y += 12;
        g.setColor(Theme.TEXT);
        g.setFont(Theme.UI_BOLD);
        g.drawString("Deliveries", 12, y);
        g.setFont(Theme.UI);
        for (var requirement : Quest.requirements().entrySet()) {
            y += 18;
            int held = engine.player().inventory().count(requirement.getKey());
            g.setColor(held >= requirement.getValue() ? Theme.HEALTH : Theme.TEXT_DIM);
            g.drawString(ItemRegistry.nameOf(requirement.getKey()) + "  " + held + " / "
                    + requirement.getValue(), 12, y);
        }
    }

    private java.util.List<String> wrap(String text, int width) {
        java.util.List<String> lines = new java.util.ArrayList<>();
        StringBuilder line = new StringBuilder();
        for (String word : text.split(" ")) {
            if (line.length() + word.length() > width) {
                lines.add(line.toString());
                line.setLength(0);
            }
            line.append(line.isEmpty() ? "" : " ").append(word);
        }
        if (!line.isEmpty()) {
            lines.add(line.toString());
        }
        return lines;
    }
}
