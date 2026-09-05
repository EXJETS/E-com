package com.exjets.aetheria.ui;

import java.awt.Color;
import java.awt.Font;

/** Shared colours and fonts so every panel looks like part of the same client. */
public final class Theme {

    public static final Color CHROME = new Color(0x2B2118);
    public static final Color CHROME_LIGHT = new Color(0x3B2E22);
    public static final Color BORDER = new Color(0x6B5136);
    public static final Color SLOT = new Color(0x1F1811);
    public static final Color TEXT = new Color(0xF2E8D5);
    public static final Color TEXT_DIM = new Color(0xB9A78A);
    public static final Color ACCENT = new Color(0xE0B341);
    public static final Color DANGER = new Color(0xD44B3C);
    public static final Color HEALTH = new Color(0x4ADE80);
    public static final Color ENERGY = new Color(0xFACC15);

    public static final Font UI = new Font(Font.SANS_SERIF, Font.PLAIN, 12);
    public static final Font UI_BOLD = new Font(Font.SANS_SERIF, Font.BOLD, 12);
    public static final Font TITLE = new Font(Font.SANS_SERIF, Font.BOLD, 15);
    public static final Font SMALL = new Font(Font.SANS_SERIF, Font.PLAIN, 10);
    public static final Font HITSPLAT = new Font(Font.SANS_SERIF, Font.BOLD, 11);

    private Theme() {
    }

    /** A deterministic per-tile shade so terrain does not look like flat paint. */
    public static Color jitter(Color base, int x, int y, int amount) {
        int hash = (x * 73856093) ^ (y * 19349663);
        int delta = (Math.floorMod(hash, amount * 2 + 1)) - amount;
        return new Color(
                clamp(base.getRed() + delta),
                clamp(base.getGreen() + delta),
                clamp(base.getBlue() + delta));
    }

    public static Color shade(Color base, double factor) {
        return new Color(
                clamp((int) (base.getRed() * factor)),
                clamp((int) (base.getGreen() * factor)),
                clamp((int) (base.getBlue() * factor)));
    }

    private static int clamp(int value) {
        return Math.max(0, Math.min(255, value));
    }
}
