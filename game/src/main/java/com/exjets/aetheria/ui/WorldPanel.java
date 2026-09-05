package com.exjets.aetheria.ui;

import com.exjets.aetheria.core.EquipSlot;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.world.GroundItem;
import com.exjets.aetheria.world.Position;
import com.exjets.aetheria.world.TileType;
import com.exjets.aetheria.world.World;
import com.exjets.aetheria.world.WorldObject;

import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JPopupMenu;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.RenderingHints;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/** The main viewport: terrain, scenery, creatures, loot, the player and the minimap. */
public class WorldPanel extends JPanel {

    private static final int TILE = 32;

    private final GameEngine engine;
    private Point hoverTile;

    public WorldPanel(GameEngine engine) {
        this.engine = engine;
        setPreferredSize(new Dimension(21 * TILE, 17 * TILE));
        setBackground(new Color(0x101010));
        setFocusable(true);
        MouseAdapter mouse = new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent event) {
                requestFocusInWindow();
                Position tile = toTile(event.getPoint());
                if (event.isPopupTrigger() || event.getButton() == MouseEvent.BUTTON3) {
                    showMenu(event, tile);
                } else if (event.getButton() == MouseEvent.BUTTON1) {
                    defaultClick(tile);
                }
            }

            @Override
            public void mouseMoved(MouseEvent event) {
                Position tile = toTile(event.getPoint());
                hoverTile = new Point(tile.x(), tile.y());
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent event) {
                hoverTile = null;
                repaint();
            }
        };
        addMouseListener(mouse);
        addMouseMotionListener(mouse);
    }

    private Position toTile(Point point) {
        return new Position(
                Math.floorDiv(point.x + cameraX(), TILE),
                Math.floorDiv(point.y + cameraY(), TILE));
    }

    private int cameraX() {
        return engine.player().position().x() * TILE + TILE / 2 - getWidth() / 2;
    }

    private int cameraY() {
        return engine.player().position().y() * TILE + TILE / 2 - getHeight() / 2;
    }

    private void defaultClick(Position tile) {
        World world = engine.world();
        Npc npc = world.npcAt(tile);
        if (npc != null) {
            if (npc.def().attackable()) {
                engine.attack(npc);
            } else {
                engine.talkTo(npc);
            }
            return;
        }
        WorldObject object = world.objectAt(tile);
        if (object != null) {
            engine.interact(object);
            return;
        }
        GroundItem item = world.groundItemAt(tile);
        if (item != null) {
            engine.pickUp(item);
            return;
        }
        engine.walkTo(tile);
    }

    private void showMenu(MouseEvent event, Position tile) {
        World world = engine.world();
        JPopupMenu menu = new JPopupMenu();
        Npc npc = world.npcAt(tile);
        if (npc != null) {
            if (npc.def().attackable()) {
                menu.add(item("Attack " + npc.name() + " (level " + npc.def().combatLevel() + ")",
                        () -> engine.attack(npc)));
            }
            menu.add(item("Talk to " + npc.name(), () -> engine.talkTo(npc)));
            menu.add(item("Examine " + npc.name(), () -> engine.message(examine(npc))));
        }
        WorldObject object = world.objectAt(tile);
        if (object != null) {
            menu.add(item(object.type().action() + " " + object.type().displayName(),
                    () -> engine.interact(object)));
        }
        GroundItem groundItem = world.groundItemAt(tile);
        if (groundItem != null) {
            menu.add(item("Take " + ItemRegistry.nameOf(groundItem.itemId()), () -> engine.pickUp(groundItem)));
        }
        menu.add(item("Walk here", () -> engine.walkTo(tile)));
        menu.add(item("Examine " + world.tile(tile).displayName().toLowerCase(),
                () -> engine.message("It is " + world.tile(tile).displayName().toLowerCase() + ".")));
        menu.show(this, event.getX(), event.getY());
    }

    private String examine(Npc npc) {
        return npc.name() + " - level " + npc.def().combatLevel() + ", "
                + npc.hitpoints() + "/" + npc.maxHitpoints() + " hitpoints.";
    }

    private JMenuItem item(String label, Runnable onClick) {
        JMenuItem menuItem = new JMenuItem(label);
        menuItem.addActionListener(event -> onClick.run());
        return menuItem;
    }

    @Override
    protected void paintComponent(Graphics graphics) {
        super.paintComponent(graphics);
        Graphics2D g = (Graphics2D) graphics.create();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        World world = engine.world();
        int camX = cameraX();
        int camY = cameraY();
        int firstX = Math.max(0, Math.floorDiv(camX, TILE));
        int firstY = Math.max(0, Math.floorDiv(camY, TILE));
        int lastX = Math.min(world.width() - 1, (camX + getWidth()) / TILE);
        int lastY = Math.min(world.height() - 1, (camY + getHeight()) / TILE);
        long tick = engine.tickCount();

        for (int y = firstY; y <= lastY; y++) {
            for (int x = firstX; x <= lastX; x++) {
                drawTile(g, world, x, y, x * TILE - camX, y * TILE - camY, tick);
            }
        }
        for (GroundItem item : world.groundItems()) {
            Position position = item.position();
            if (position.x() < firstX || position.x() > lastX || position.y() < firstY || position.y() > lastY) {
                continue;
            }
            int px = position.x() * TILE - camX;
            int py = position.y() * TILE - camY;
            Sprites.drawItem(g, ItemRegistry.get(item.itemId()), px + 6, py + 6, TILE - 12);
        }
        for (Npc npc : world.npcs()) {
            if (!npc.isVisible()) {
                continue;
            }
            Position position = npc.position();
            if (position.x() < firstX - 1 || position.x() > lastX + 1
                    || position.y() < firstY - 1 || position.y() > lastY + 1) {
                continue;
            }
            drawNpc(g, npc, position.x() * TILE - camX, position.y() * TILE - camY);
        }
        drawPlayer(g, engine.player(), engine.player().position().x() * TILE - camX,
                engine.player().position().y() * TILE - camY);
        drawHover(g, camX, camY);
        drawMinimap(g, world);
        drawStatus(g);
        g.dispose();
    }

    private void drawTile(Graphics2D g, World world, int x, int y, int px, int py, long tick) {
        TileType type = world.tile(x, y);
        Color base = Theme.jitter(type.color(), x, y, 3);
        if (type == TileType.WATER) {
            int shimmer = (int) ((tick + x * 3L + y * 5L) % 14);
            base = Theme.shade(base, shimmer < 2 ? 1.10 : 1.0);
        }
        g.setColor(base);
        g.fillRect(px, py, TILE, TILE);
        drawTexture(g, type, x, y, px, py);
        if (type == TileType.WALL) {
            g.setColor(Theme.shade(type.color(), 0.75));
            g.drawLine(px, py + TILE / 2, px + TILE, py + TILE / 2);
            g.drawLine(px + TILE / 2, py, px + TILE / 2, py + TILE / 2);
        } else if (type == TileType.FENCE) {
            g.setColor(Theme.shade(type.color(), 1.3));
            g.fillRect(px + TILE / 3, py + 2, 4, TILE - 4);
            g.fillRect(px + 2, py + TILE / 3, TILE - 4, 4);
        }
        WorldObject object = world.objectAt(new Position(x, y));
        if (object != null) {
            Sprites.drawObject(g, object.type(), px, py, TILE, object.isDepleted(), tick);
        }
    }

    /** A few deterministic specks so grass, sand and floors read as surfaces, not paint. */
    private void drawTexture(Graphics2D g, TileType type, int x, int y, int px, int py) {
        int hash = Math.abs((x * 73856093) ^ (y * 19349663));
        switch (type) {
            case GRASS -> {
                g.setColor(Theme.shade(type.color(), 1.12));
                for (int blade = 0; blade < 3; blade++) {
                    int bx = px + (hash >> (blade * 5)) % (TILE - 6) + 3;
                    int by = py + (hash >> (blade * 7 + 2)) % (TILE - 6) + 3;
                    g.drawLine(bx, by, bx, by - 3);
                }
            }
            case SAND, DIRT -> {
                g.setColor(Theme.shade(type.color(), 0.9));
                for (int speck = 0; speck < 3; speck++) {
                    int sx = px + (hash >> (speck * 4)) % (TILE - 4) + 2;
                    int sy = py + (hash >> (speck * 6 + 1)) % (TILE - 4) + 2;
                    g.fillRect(sx, sy, 2, 2);
                }
            }
            case FLOOR -> {
                g.setColor(Theme.shade(type.color(), 0.88));
                g.drawLine(px, py + TILE - 1, px + TILE, py + TILE - 1);
            }
            case ROAD -> {
                g.setColor(Theme.shade(type.color(), 0.96));
                g.fillRect(px + (hash % 20), py + (hash % 22), 3, 2);
            }
            default -> {
            }
        }
    }

    private void drawNpc(Graphics2D g, Npc npc, int px, int py) {
        int size = TILE - 10;
        g.setColor(new Color(0, 0, 0, 60));
        g.fillOval(px + 5, py + TILE - 10, size, 7);
        Sprites.drawCreature(g, npc.def().key(), npc.def().color(), px, py, TILE);
        if (npc.hitpoints() < npc.maxHitpoints()) {
            drawHealthBar(g, px + 4, py, TILE - 8, npc.hitpoints(), npc.maxHitpoints());
        }
        if (npc.lastDamage() >= 0) {
            drawHitsplat(g, px + TILE / 2, py + TILE / 2, npc.lastDamage());
        }
    }

    private void drawPlayer(Graphics2D g, Player player, int px, int py) {
        g.setColor(new Color(0, 0, 0, 70));
        g.fillOval(px + 6, py + TILE - 9, TILE - 12, 7);
        String bodyId = player.equipment().get(EquipSlot.BODY);
        Color body = bodyId == null ? new Color(0x8B5CF6) : ItemRegistry.get(bodyId).color();
        String legsId = player.equipment().get(EquipSlot.LEGS);
        Color legs = legsId == null ? new Color(0x475569) : ItemRegistry.get(legsId).color();
        g.setColor(legs);
        g.fillRect(px + TILE / 3, py + TILE * 5 / 8, TILE / 3, TILE / 4);
        g.setColor(body);
        g.fillRoundRect(px + TILE / 4, py + TILE / 3, TILE / 2, TILE / 3, 5, 5);
        String headId = player.equipment().get(EquipSlot.HEAD);
        g.setColor(headId == null ? new Color(0xF5D0A9) : ItemRegistry.get(headId).color());
        g.fillOval(px + TILE / 3, py + TILE / 6, TILE / 3, TILE / 3);
        String weaponId = player.equipment().get(EquipSlot.WEAPON);
        if (weaponId != null) {
            g.setColor(ItemRegistry.get(weaponId).color());
            g.fillRect(px + TILE * 3 / 4 - 2, py + TILE / 4, 3, TILE / 2);
        }
        String shieldId = player.equipment().get(EquipSlot.SHIELD);
        if (shieldId != null) {
            g.setColor(ItemRegistry.get(shieldId).color());
            g.fillRect(px + TILE / 6, py + TILE / 3, 5, TILE / 3);
        }
        drawHealthBar(g, px + 4, py, TILE - 8, player.skills().currentHitpoints(),
                player.skills().maxHitpoints());
        if (player.lastDamage() >= 0) {
            drawHitsplat(g, px + TILE / 2, py + TILE / 2, player.lastDamage());
        }
    }

    private void drawHealthBar(Graphics2D g, int x, int y, int width, int current, int max) {
        g.setColor(new Color(0x7F1D1D));
        g.fillRect(x, y, width, 4);
        g.setColor(Theme.HEALTH);
        g.fillRect(x, y, (int) (width * Math.max(0, current) / (double) max), 4);
    }

    private void drawHitsplat(Graphics2D g, int cx, int cy, int damage) {
        g.setColor(damage == 0 ? new Color(0x2563EB) : Theme.DANGER);
        g.fillOval(cx - 9, cy - 9, 18, 18);
        g.setColor(Color.WHITE);
        g.setFont(Theme.HITSPLAT);
        String text = String.valueOf(damage);
        g.drawString(text, cx - g.getFontMetrics().stringWidth(text) / 2, cy + 4);
    }

    private void drawHover(Graphics2D g, int camX, int camY) {
        if (hoverTile == null) {
            return;
        }
        int px = hoverTile.x * TILE - camX;
        int py = hoverTile.y * TILE - camY;
        g.setColor(new Color(255, 255, 255, 60));
        g.setStroke(new BasicStroke(2f));
        g.drawRect(px + 1, py + 1, TILE - 2, TILE - 2);
        g.setStroke(new BasicStroke(1f));

        Position tile = new Position(hoverTile.x, hoverTile.y);
        String label = null;
        Npc npc = engine.world().npcAt(tile);
        WorldObject object = engine.world().objectAt(tile);
        GroundItem item = engine.world().groundItemAt(tile);
        if (npc != null) {
            label = (npc.def().attackable() ? "Attack " : "Talk to ") + npc.name()
                    + (npc.def().attackable() ? " (level " + npc.def().combatLevel() + ")" : "");
        } else if (object != null) {
            label = object.type().action() + " " + object.type().displayName();
        } else if (item != null) {
            label = "Take " + ItemRegistry.nameOf(item.itemId());
        }
        if (label != null) {
            g.setFont(Theme.UI_BOLD);
            g.setColor(new Color(0, 0, 0, 150));
            int width = g.getFontMetrics().stringWidth(label) + 12;
            g.fillRoundRect(6, 6, width, 20, 6, 6);
            g.setColor(Theme.ACCENT);
            g.drawString(label, 12, 20);
        }
    }

    private void drawMinimap(Graphics2D g, World world) {
        int scale = 2;
        int span = 40;
        int size = span * scale;
        int originX = getWidth() - size - 12;
        int originY = 12;
        Position centre = engine.player().position();
        g.setColor(new Color(0, 0, 0, 170));
        g.fillRoundRect(originX - 4, originY - 4, size + 8, size + 8, 8, 8);
        for (int y = 0; y < span; y++) {
            for (int x = 0; x < span; x++) {
                int worldX = centre.x() - span / 2 + x;
                int worldY = centre.y() - span / 2 + y;
                if (!world.inBounds(worldX, worldY)) {
                    continue;
                }
                Position position = new Position(worldX, worldY);
                WorldObject object = world.objectAt(position);
                Color color = object != null && object.type().isResource()
                        ? Theme.ACCENT.darker()
                        : world.tile(worldX, worldY).color();
                g.setColor(color);
                g.fillRect(originX + x * scale, originY + y * scale, scale, scale);
            }
        }
        for (Npc npc : world.npcs()) {
            if (!npc.isVisible()) {
                continue;
            }
            int dx = npc.position().x() - centre.x() + span / 2;
            int dy = npc.position().y() - centre.y() + span / 2;
            if (dx < 0 || dy < 0 || dx >= span || dy >= span) {
                continue;
            }
            g.setColor(npc.def().attackable() ? Theme.DANGER : new Color(0x38BDF8));
            g.fillRect(originX + dx * scale, originY + dy * scale, scale + 1, scale + 1);
        }
        g.setColor(Color.WHITE);
        g.fillRect(originX + (span / 2) * scale, originY + (span / 2) * scale, scale + 1, scale + 1);
        g.setColor(Theme.BORDER);
        g.drawRoundRect(originX - 4, originY - 4, size + 8, size + 8, 8, 8);
    }

    private void drawStatus(Graphics2D g) {
        String status = engine.currentAction() == null
                ? (engine.player().isMoving() ? "Walking" : "Idle")
                : engine.currentAction().description();
        g.setFont(Theme.SMALL);
        g.setColor(new Color(0, 0, 0, 150));
        int width = g.getFontMetrics().stringWidth(status) + 14;
        g.fillRoundRect(6, getHeight() - 26, width, 18, 6, 6);
        g.setColor(Theme.TEXT_DIM);
        g.drawString(status, 13, getHeight() - 13);
    }
}
