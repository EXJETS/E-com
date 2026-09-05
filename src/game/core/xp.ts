// The classic experience curve: reaching level n costs
// floor(sum(l + 300 * 2^(l/7)) / 4) for l in [1, n).

export const MAX_LEVEL = 99;
export const MAX_XP = 200_000_000;

const XP_FOR_LEVEL: number[] = (() => {
  const table = new Array<number>(MAX_LEVEL + 1).fill(0);
  let points = 0;
  for (let level = 1; level <= MAX_LEVEL; level++) {
    table[level] = Math.floor(points / 4);
    points += Math.floor(level + 300 * Math.pow(2, level / 7));
  }
  return table;
})();

export function xpForLevel(level: number): number {
  if (level < 1) return 0;
  return XP_FOR_LEVEL[Math.min(level, MAX_LEVEL)];
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (level < MAX_LEVEL && xp >= XP_FOR_LEVEL[level + 1]) level++;
  return level;
}

export function xpToNextLevel(xp: number): number {
  const level = levelForXp(xp);
  return level >= MAX_LEVEL ? 0 : XP_FOR_LEVEL[level + 1] - xp;
}

/** Progress through the current level, from 0 to 1. */
export function levelProgress(xp: number): number {
  const level = levelForXp(xp);
  if (level >= MAX_LEVEL) return 1;
  const start = XP_FOR_LEVEL[level];
  const end = XP_FOR_LEVEL[level + 1];
  return (xp - start) / (end - start);
}
