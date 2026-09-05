package com.exjets.aetheria.ui;

import com.exjets.aetheria.core.ItemDef;
import com.exjets.aetheria.world.ObjectType;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Polygon;

/** Hand drawn scenery and item icons. Everything is vector shapes, so there are no assets to ship. */
public final class Sprites {

    private Sprites() {
    }

    public static void drawObject(Graphics2D g, ObjectType type, int x, int y, int size, boolean depleted,
                                  long tick) {
        switch (type) {
            case TREE -> drawTree(g, x, y, size, depleted, new Color(0x2F6B23), 0.78);
            case OAK -> drawTree(g, x, y, size, depleted, new Color(0x3F7A24), 0.92);
            case WILLOW -> drawTree(g, x, y, size, depleted, new Color(0x6FA83C), 0.86);
            case COPPER_ROCK -> drawRock(g, x, y, size, depleted, new Color(0xC2701C));
            case TIN_ROCK -> drawRock(g, x, y, size, depleted, new Color(0xD6D3D1));
            case IRON_ROCK -> drawRock(g, x, y, size, depleted, new Color(0x9B4A3A));
            case COAL_ROCK -> drawRock(g, x, y, size, depleted, new Color(0x1F2937));
            case SHRIMP_SPOT, TROUT_SPOT -> drawFishingSpot(g, x, y, size, tick);
            case FURNACE -> drawFurnace(g, x, y, size, tick);
            case ANVIL -> drawAnvil(g, x, y, size);
            case BANK_BOOTH -> drawBankBooth(g, x, y, size);
            case RANGE -> drawRange(g, x, y, size);
            case FIRE -> drawFire(g, x, y, size, tick);
            case SHOP_COUNTER -> drawCounter(g, x, y, size);
            case DOOR -> drawDoor(g, x, y, size);
            default -> {
            }
        }
    }

    private static void drawTree(Graphics2D g, int x, int y, int size, boolean stump, Color leaves, double scale) {
        int trunkWidth = Math.max(3, size / 6);
        g.setColor(new Color(0x5B3A1E));
        g.fillRect(x + size / 2 - trunkWidth / 2, y + size / 2, trunkWidth, size / 2 - 2);
        if (stump) {
            g.setColor(new Color(0x7C5326));
            g.fillOval(x + size / 2 - trunkWidth, y + size / 2 - trunkWidth / 2, trunkWidth * 2, trunkWidth);
            return;
        }
        int canopy = (int) (size * scale);
        int cx = x + size / 2 - canopy / 2;
        int cy = y + size / 2 - canopy * 3 / 4;
        g.setColor(Theme.shade(leaves, 0.75));
        g.fillOval(cx - 2, cy + 4, canopy, canopy);
        g.setColor(leaves);
        g.fillOval(cx, cy, canopy, canopy - 2);
        g.setColor(Theme.shade(leaves, 1.25));
        g.fillOval(cx + canopy / 5, cy + canopy / 6, canopy / 3, canopy / 3);
    }

    private static void drawRock(Graphics2D g, int x, int y, int size, boolean mined, Color ore) {
        int inset = size / 8;
        Polygon rock = new Polygon();
        rock.addPoint(x + inset, y + size - inset);
        rock.addPoint(x + inset + size / 8, y + size / 2);
        rock.addPoint(x + size / 2, y + inset + (mined ? size / 4 : 0));
        rock.addPoint(x + size - inset - size / 8, y + size / 2);
        rock.addPoint(x + size - inset, y + size - inset);
        g.setColor(mined ? new Color(0x57534E) : blend(new Color(0x8A837C), ore, 0.35));
        g.fillPolygon(rock);
        g.setColor(new Color(0x3F3B37));
        g.drawPolygon(rock);
        if (!mined) {
            g.setColor(ore);
            g.fillOval(x + size / 3, y + size / 2, size / 5, size / 5);
            g.fillOval(x + size / 2, y + size / 2 + size / 8, size / 6, size / 6);
            g.fillOval(x + size / 2 - size / 8, y + size / 3, size / 7, size / 7);
        }
    }

    /** Mixes {@code amount} of the tint into the base colour. */
    private static Color blend(Color base, Color tint, double amount) {
        return new Color(
                (int) (base.getRed() * (1 - amount) + tint.getRed() * amount),
                (int) (base.getGreen() * (1 - amount) + tint.getGreen() * amount),
                (int) (base.getBlue() * (1 - amount) + tint.getBlue() * amount));
    }

    private static void drawFishingSpot(Graphics2D g, int x, int y, int size, long tick) {
        g.setStroke(new BasicStroke(2f));
        for (int ring = 0; ring < 3; ring++) {
            int phase = (int) ((tick + ring * 3) % 9);
            int radius = size / 6 + phase * size / 24;
            g.setColor(new Color(200, 235, 255, Math.max(20, 140 - phase * 15)));
            g.drawOval(x + size / 2 - radius, y + size / 2 - radius, radius * 2, radius * 2);
        }
        g.setStroke(new BasicStroke(1f));
    }

    private static void drawFurnace(Graphics2D g, int x, int y, int size, long tick) {
        g.setColor(new Color(0x57534E));
        g.fillRect(x + 2, y + size / 4, size - 4, size - size / 4 - 2);
        g.setColor(new Color(0x292524));
        g.fillArc(x + size / 4, y + size / 2, size / 2, size / 2, 0, 180);
        g.setColor(tick % 2 == 0 ? new Color(0xF97316) : new Color(0xFACC15));
        g.fillArc(x + size / 3, y + size / 2 + 2, size / 3, size / 3, 0, 180);
        g.setColor(new Color(0x78716C));
        g.fillRect(x + size / 3, y + 2, size / 3, size / 4);
    }

    private static void drawAnvil(Graphics2D g, int x, int y, int size) {
        g.setColor(new Color(0x3F3F46));
        g.fillRect(x + size / 4, y + size / 2, size / 2, size / 6);
        g.fillRect(x + size / 3, y + size / 2 + size / 6, size / 3, size / 5);
        g.fillRect(x + size / 5, y + size - size / 4, size * 3 / 5, size / 6);
        g.setColor(new Color(0x71717A));
        g.fillRect(x + size / 4, y + size / 2, size / 2, 3);
    }

    private static void drawBankBooth(Graphics2D g, int x, int y, int size) {
        g.setColor(new Color(0x4E3A21));
        g.fillRect(x + 2, y + size / 3, size - 4, size * 2 / 3 - 2);
        g.setColor(new Color(0x8A6A3B));
        g.fillRect(x + 2, y + size / 3, size - 4, size / 6);
        g.setColor(Theme.ACCENT);
        g.setFont(Theme.UI_BOLD);
        g.drawString("$", x + size / 2 - 4, y + size - size / 5);
    }

    private static void drawRange(Graphics2D g, int x, int y, int size) {
        g.setColor(new Color(0x44403C));
        g.fillRect(x + 2, y + size / 4, size - 4, size - size / 4 - 2);
        g.setColor(new Color(0x1C1917));
        g.fillRect(x + size / 5, y + size / 2, size * 3 / 5, size / 3);
        g.setColor(new Color(0xEA580C));
        g.fillRect(x + size / 4, y + size / 2 + size / 8, size / 2, size / 8);
    }

    private static void drawFire(Graphics2D g, int x, int y, int size, long tick) {
        g.setColor(new Color(0x57534E));
        g.fillRect(x + size / 4, y + size - size / 4, size / 2, size / 6);
        int flicker = (int) (tick % 3);
        g.setColor(new Color(0xEA580C));
        Polygon flame = new Polygon();
        flame.addPoint(x + size / 2, y + size / 5 - flicker);
        flame.addPoint(x + size - size / 5, y + size - size / 4);
        flame.addPoint(x + size / 5, y + size - size / 4);
        g.fillPolygon(flame);
        g.setColor(new Color(0xFBBF24));
        Polygon inner = new Polygon();
        inner.addPoint(x + size / 2, y + size / 2 - flicker);
        inner.addPoint(x + size * 2 / 3, y + size - size / 4);
        inner.addPoint(x + size / 3, y + size - size / 4);
        g.fillPolygon(inner);
    }

    private static void drawCounter(Graphics2D g, int x, int y, int size) {
        g.setColor(new Color(0x6B4423));
        g.fillRect(x + 1, y + size / 2, size - 2, size / 2 - 2);
        g.setColor(new Color(0x8B5E3C));
        g.fillRect(x + 1, y + size / 2, size - 2, size / 8);
    }

    private static void drawDoor(Graphics2D g, int x, int y, int size) {
        g.setColor(new Color(0x3F2C18));
        g.drawRect(x + size / 6, y + size / 6, size - size / 3, size - size / 3);
    }

    /** Creature portraits: simple shapes, but each kind is recognisable at a glance. */
    public static void drawCreature(Graphics2D g, String key, Color color, int x, int y, int size) {
        int body = size - 10;
        int bx = x + 5;
        int by = y + 6;
        switch (key) {
            case "chicken" -> {
                g.setColor(color);
                g.fillOval(bx + 2, by + 4, body - 4, body - 6);
                g.fillOval(bx + body / 3, by, body / 2, body / 2);
                g.setColor(new Color(0xF97316));
                g.fillPolygon(new int[]{bx + body - 2, bx + body + 4, bx + body - 2},
                        new int[]{by + body / 5, by + body / 4, by + body / 3}, 3);
                g.setColor(new Color(0xDC2626));
                g.fillOval(bx + body / 2, by - 3, body / 4, body / 4);
            }
            case "cow" -> {
                g.setColor(color);
                g.fillRoundRect(bx, by + 3, body, body - 4, 6, 6);
                g.setColor(new Color(0x1C1917));
                g.fillOval(bx + 2, by + 5, body / 3, body / 3);
                g.fillOval(bx + body / 2, by + body / 2, body / 3, body / 3);
                g.setColor(new Color(0xFDE68A));
                g.fillRect(bx - 2, by + 2, 3, 3);
                g.fillRect(bx + body - 1, by + 2, 3, 3);
            }
            case "goblin" -> {
                g.setColor(color);
                g.fillOval(bx + 1, by + 2, body - 2, body);
                g.fillPolygon(new int[]{bx, bx - 4, bx + 2},
                        new int[]{by + body / 3, by + body / 4, by + body / 2}, 3);
                g.fillPolygon(new int[]{bx + body, bx + body + 4, bx + body - 2},
                        new int[]{by + body / 3, by + body / 4, by + body / 2}, 3);
                g.setColor(new Color(0xFCA5A5));
                g.fillOval(bx + body / 4, by + body / 3, 3, 3);
                g.fillOval(bx + body * 2 / 3, by + body / 3, 3, 3);
            }
            case "guard" -> {
                g.setColor(color);
                g.fillRoundRect(bx + 1, by + body / 3, body - 2, body * 2 / 3, 4, 4);
                g.setColor(new Color(0xF5D0A9));
                g.fillOval(bx + body / 4, by + 1, body / 2, body / 2);
                g.setColor(new Color(0x94A3B8));
                g.fillArc(bx + body / 4 - 1, by, body / 2 + 2, body / 2, 0, 180);
                g.fillRect(bx + body - 1, by + body / 3, 2, body * 2 / 3);
            }
            case "giant_rat" -> {
                g.setColor(color);
                g.fillOval(bx, by + body / 3, body, body / 2);
                g.fillOval(bx + body * 2 / 3, by + body / 4, body / 2, body / 2);
                g.setColor(Theme.shade(color, 0.7));
                g.drawLine(bx, by + body / 2, bx - 6, by + body / 2 + 4);
            }
            default -> {
                g.setColor(color);
                g.fillRoundRect(bx + 1, by + body / 3, body - 2, body * 2 / 3, 5, 5);
                g.setColor(new Color(0xF5D0A9));
                g.fillOval(bx + body / 4, by, body / 2, body / 2);
            }
        }
    }

    /** Item icons are a coloured chip plus a hint of the item's shape. */
    public static void drawItem(Graphics2D g, ItemDef def, int x, int y, int size) {
        Color color = def.color();
        String id = def.id();
        if (id.equals("coins")) {
            g.setColor(color);
            g.fillOval(x + size / 4, y + size / 3, size / 3, size / 3);
            g.fillOval(x + size / 2 - 2, y + size / 4, size / 3, size / 3);
            g.fillOval(x + size / 3, y + size / 2, size / 3, size / 3);
            return;
        }
        if (id.endsWith("logs")) {
            g.setColor(color);
            g.fillRoundRect(x + size / 8, y + size / 3, size * 3 / 4, size / 5, 4, 4);
            g.fillRoundRect(x + size / 8, y + size / 2, size * 3 / 4, size / 5, 4, 4);
            return;
        }
        if (id.endsWith("_ore") || id.equals("coal")) {
            g.setColor(color);
            g.fillOval(x + size / 5, y + size / 3, size * 3 / 5, size / 2);
            g.setColor(Theme.shade(color, 1.3));
            g.fillOval(x + size / 3, y + size / 2, size / 5, size / 5);
            return;
        }
        if (id.endsWith("_bar")) {
            g.setColor(color);
            g.fillRect(x + size / 6, y + size / 2 - 3, size * 2 / 3, size / 4);
            g.setColor(Theme.shade(color, 1.3));
            g.fillRect(x + size / 6, y + size / 2 - 3, size * 2 / 3, 3);
            return;
        }
        if (def.slot() != null) {
            drawGear(g, def, x, y, size);
            return;
        }
        g.setColor(color);
        g.fillOval(x + size / 5, y + size / 4, size * 3 / 5, size / 2);
        g.setColor(Theme.shade(color, 0.7));
        g.drawOval(x + size / 5, y + size / 4, size * 3 / 5, size / 2);
    }

    private static void drawGear(Graphics2D g, ItemDef def, int x, int y, int size) {
        Color color = def.color();
        g.setColor(color);
        switch (def.slot()) {
            case WEAPON -> {
                if (def.toolType() != null && def.toolType().equals("axe")) {
                    g.setColor(new Color(0x6B4423));
                    g.fillRect(x + size / 2 - 2, y + size / 4, 4, size / 2);
                    g.setColor(color);
                    g.fillArc(x + size / 3, y + size / 5, size / 2, size / 3, 270, 180);
                } else if (def.toolType() != null && def.toolType().equals("pickaxe")) {
                    g.setColor(new Color(0x6B4423));
                    g.fillRect(x + size / 2 - 2, y + size / 4, 4, size / 2);
                    g.setColor(color);
                    g.fillArc(x + size / 4, y + size / 5, size / 2, size / 4, 0, 180);
                } else {
                    g.fillRect(x + size / 2 - 2, y + size / 6, 4, size * 2 / 3);
                    g.setColor(new Color(0x6B4423));
                    g.fillRect(x + size / 3, y + size * 3 / 4, size / 3, 4);
                }
            }
            case SHIELD -> {
                Polygon shield = new Polygon();
                shield.addPoint(x + size / 4, y + size / 5);
                shield.addPoint(x + size * 3 / 4, y + size / 5);
                shield.addPoint(x + size / 2, y + size * 4 / 5);
                g.fillPolygon(shield);
            }
            case HEAD -> g.fillArc(x + size / 5, y + size / 4, size * 3 / 5, size / 2, 0, 180);
            case BODY -> {
                g.fillRect(x + size / 4, y + size / 4, size / 2, size / 2);
                g.fillRect(x + size / 8, y + size / 4, size / 8, size / 3);
                g.fillRect(x + size * 3 / 4, y + size / 4, size / 8, size / 3);
            }
            case LEGS -> {
                g.fillRect(x + size / 4, y + size / 4, size / 2, size / 5);
                g.fillRect(x + size / 4, y + size / 2 - 4, size / 6, size / 3);
                g.fillRect(x + size / 2, y + size / 2 - 4, size / 6, size / 3);
            }
            default -> g.fillRect(x + size / 4, y + size / 4, size / 2, size / 2);
        }
    }
}
