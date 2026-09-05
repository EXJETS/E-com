package com.exjets.aetheria.core;

/**
 * The classic experience curve: the experience required for level {@code n} is
 * {@code floor(sum(l + 300 * 2^(l/7)) / 4)} for {@code l} in {@code [1, n)}.
 */
public final class XpTable {

    public static final int MAX_LEVEL = 99;
    public static final int MAX_XP = 200_000_000;

    private static final int[] XP_FOR_LEVEL = new int[MAX_LEVEL + 1];

    static {
        double points = 0;
        for (int level = 1; level <= MAX_LEVEL; level++) {
            XP_FOR_LEVEL[level] = (int) (points / 4);
            points += Math.floor(level + 300 * Math.pow(2, level / 7.0));
        }
    }

    private XpTable() {
    }

    /** Experience needed to reach {@code level}. */
    public static int xpForLevel(int level) {
        if (level < 1) {
            return 0;
        }
        return XP_FOR_LEVEL[Math.min(level, MAX_LEVEL)];
    }

    /** The level reached with {@code xp} experience. */
    public static int levelForXp(int xp) {
        int level = 1;
        while (level < MAX_LEVEL && xp >= XP_FOR_LEVEL[level + 1]) {
            level++;
        }
        return level;
    }

    /** Experience still owed before the next level, or 0 at the cap. */
    public static int xpToNextLevel(int xp) {
        int level = levelForXp(xp);
        return level >= MAX_LEVEL ? 0 : XP_FOR_LEVEL[level + 1] - xp;
    }

    /** Progress through the current level in the range {@code [0, 1]}. */
    public static double levelProgress(int xp) {
        int level = levelForXp(xp);
        if (level >= MAX_LEVEL) {
            return 1.0;
        }
        int start = XP_FOR_LEVEL[level];
        int end = XP_FOR_LEVEL[level + 1];
        return (double) (xp - start) / (end - start);
    }
}
