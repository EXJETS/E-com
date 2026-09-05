import { levelForXp, MAX_XP, xpForLevel } from "./xp";

export const SKILLS = [
  "attack",
  "strength",
  "defence",
  "hitpoints",
  "woodcutting",
  "mining",
  "fishing",
  "cooking",
  "firemaking",
  "smithing",
] as const;

export type SkillType = (typeof SKILLS)[number];

export const SKILL_INFO: Record<SkillType, { name: string; start: number; color: string }> = {
  attack: { name: "Attack", start: 1, color: "#9B1C1C" },
  strength: { name: "Strength", start: 1, color: "#166534" },
  defence: { name: "Defence", start: 1, color: "#1E40AF" },
  hitpoints: { name: "Hitpoints", start: 10, color: "#B91C1C" },
  woodcutting: { name: "Woodcutting", start: 1, color: "#3F6212" },
  mining: { name: "Mining", start: 1, color: "#57534E" },
  fishing: { name: "Fishing", start: 1, color: "#0E7490" },
  cooking: { name: "Cooking", start: 1, color: "#7C2D12" },
  firemaking: { name: "Firemaking", start: 1, color: "#C2410C" },
  smithing: { name: "Smithing", start: 1, color: "#44403C" },
};

/** Experience, levels and the temporary hitpoints pool for one character. */
export class Skills {
  private readonly experience: Record<SkillType, number>;
  private hitpoints: number;

  constructor() {
    this.experience = {} as Record<SkillType, number>;
    for (const skill of SKILLS) {
      this.experience[skill] = xpForLevel(SKILL_INFO[skill].start);
    }
    this.hitpoints = this.maxHitpoints();
  }

  xp(skill: SkillType): number {
    return this.experience[skill];
  }

  setXp(skill: SkillType, xp: number): void {
    this.experience[skill] = Math.max(0, Math.min(MAX_XP, Math.floor(xp)));
  }

  level(skill: SkillType): number {
    return levelForXp(this.experience[skill]);
  }

  /** @returns how many levels were gained, so the caller can announce them */
  addXp(skill: SkillType, amount: number): number {
    if (amount <= 0) return 0;
    const before = this.level(skill);
    this.setXp(skill, this.xp(skill) + amount);
    const after = this.level(skill);
    if (skill === "hitpoints" && after > before) {
      this.hitpoints += after - before;
    }
    return after - before;
  }

  maxHitpoints(): number {
    return this.level("hitpoints");
  }

  currentHitpoints(): number {
    return this.hitpoints;
  }

  setCurrentHitpoints(value: number): void {
    this.hitpoints = Math.max(0, Math.min(this.maxHitpoints(), value));
  }

  damage(amount: number): void {
    this.setCurrentHitpoints(this.hitpoints - amount);
  }

  /** @returns the hitpoints actually restored */
  heal(amount: number): number {
    const before = this.hitpoints;
    this.setCurrentHitpoints(this.hitpoints + amount);
    return this.hitpoints - before;
  }

  isDead(): boolean {
    return this.hitpoints <= 0;
  }

  totalLevel(): number {
    return SKILLS.reduce((total, skill) => total + this.level(skill), 0);
  }

  totalXp(): number {
    return SKILLS.reduce((total, skill) => total + this.xp(skill), 0);
  }

  /** Melee combat level: a quarter of defence and hitpoints, plus 13/40 of attack and strength. */
  combatLevel(): number {
    const base = 0.25 * (this.level("defence") + this.level("hitpoints"));
    const melee = 0.325 * (this.level("attack") + this.level("strength"));
    return Math.floor(base + melee);
  }
}
