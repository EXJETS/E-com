import { SkillType } from "../core/skills";

export type AttackStyle = "accurate" | "aggressive" | "defensive" | "controlled";

export const ATTACK_STYLES: AttackStyle[] = ["accurate", "aggressive", "defensive", "controlled"];

export const STYLE_INFO: Record<AttackStyle, { name: string; trains: SkillType | null }> = {
  accurate: { name: "Accurate", trains: "attack" },
  aggressive: { name: "Aggressive", trains: "strength" },
  defensive: { name: "Defensive", trains: "defence" },
  controlled: { name: "Controlled", trains: null },
};

export function styleBoost(style: AttackStyle, skill: "attack" | "strength" | "defence"): number {
  if (style === "controlled") return 1;
  if (style === "accurate") return skill === "attack" ? 3 : 0;
  if (style === "aggressive") return skill === "strength" ? 3 : 0;
  return skill === "defence" ? 3 : 0;
}

export function nextStyle(style: AttackStyle): AttackStyle {
  return ATTACK_STYLES[(ATTACK_STYLES.indexOf(style) + 1) % ATTACK_STYLES.length];
}

/** Attack or defence rating: effective level times the matching equipment bonus. */
export function rating(effectiveLevel: number, equipmentBonus: number): number {
  return (effectiveLevel + 8) * (equipmentBonus + 64);
}

/** Chance for an attack roll to beat a defence roll, from 0 to 1. */
export function hitChance(attackRating: number, defenceRating: number): number {
  if (attackRating > defenceRating) {
    return 1 - (defenceRating + 2) / (2 * (attackRating + 1));
  }
  return attackRating / (2 * (defenceRating + 1));
}

/** The highest damage a swing can deal. */
export function maxHit(effectiveStrength: number, strengthBonus: number): number {
  return Math.max(1, Math.floor(0.5 + ((effectiveStrength + 8) * (strengthBonus + 64)) / 640));
}

/** Rolls one swing. @returns the damage dealt, which is 0 for a miss */
export function rollDamage(
  random: () => number,
  attackRating: number,
  defenceRating: number,
  effectiveStrength: number,
  strengthBonus: number,
): number {
  if (random() >= hitChance(attackRating, defenceRating)) return 0;
  return Math.floor(random() * (maxHit(effectiveStrength, strengthBonus) + 1));
}
