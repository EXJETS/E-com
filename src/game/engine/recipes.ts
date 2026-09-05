import { SkillType } from "../core/skills";

export interface Recipe {
  name: string;
  /** Item id to quantity consumed per item made. */
  inputs: Record<string, number>;
  output: string;
  skill: SkillType;
  levelRequired: number;
  experience: number;
  ticksPerItem: number;
  /** Low levels sometimes ruin food, producing burnt food instead. */
  burnable?: boolean;
  burnFreeLevel?: number;
}

export const SMELTING: Record<string, Recipe> = {
  bronze_bar: { name: "Smelting bronze bars", inputs: { copper_ore: 1, tin_ore: 1 }, output: "bronze_bar",
    skill: "smithing", levelRequired: 1, experience: 6, ticksPerItem: 3 },
  iron_bar: { name: "Smelting iron bars", inputs: { iron_ore: 1 }, output: "iron_bar",
    skill: "smithing", levelRequired: 15, experience: 12, ticksPerItem: 3 },
  steel_bar: { name: "Smelting steel bars", inputs: { iron_ore: 1, coal: 2 }, output: "steel_bar",
    skill: "smithing", levelRequired: 30, experience: 17, ticksPerItem: 3 },
};

function smith(product: string, bar: string, bars: number, level: number, experience: number): Recipe {
  return {
    name: "Smithing",
    inputs: { [bar]: bars },
    output: product,
    skill: "smithing",
    levelRequired: level,
    experience,
    ticksPerItem: 4,
  };
}

export const SMITHING: Record<string, Recipe> = {
  bronze_axe: smith("bronze_axe", "bronze_bar", 1, 1, 12),
  bronze_pickaxe: smith("bronze_pickaxe", "bronze_bar", 1, 2, 12),
  bronze_dagger: smith("bronze_dagger", "bronze_bar", 1, 1, 12),
  bronze_sword: smith("bronze_sword", "bronze_bar", 1, 4, 12),
  bronze_helm: smith("bronze_helm", "bronze_bar", 1, 7, 12),
  bronze_shield: smith("bronze_shield", "bronze_bar", 2, 12, 25),
  bronze_platelegs: smith("bronze_platelegs", "bronze_bar", 3, 16, 37),
  bronze_platebody: smith("bronze_platebody", "bronze_bar", 5, 18, 62),
  iron_sword: smith("iron_sword", "iron_bar", 1, 19, 25),
  iron_axe: smith("iron_axe", "iron_bar", 1, 20, 25),
  iron_pickaxe: smith("iron_pickaxe", "iron_bar", 1, 21, 25),
  iron_helm: smith("iron_helm", "iron_bar", 1, 26, 25),
  iron_shield: smith("iron_shield", "iron_bar", 2, 27, 50),
  iron_platelegs: smith("iron_platelegs", "iron_bar", 3, 31, 75),
  iron_platebody: smith("iron_platebody", "iron_bar", 5, 33, 125),
  steel_sword: smith("steel_sword", "steel_bar", 1, 34, 37),
  steel_axe: smith("steel_axe", "steel_bar", 1, 35, 37),
  steel_pickaxe: smith("steel_pickaxe", "steel_bar", 1, 36, 37),
  steel_helm: smith("steel_helm", "steel_bar", 1, 37, 37),
  steel_shield: smith("steel_shield", "steel_bar", 2, 38, 75),
  steel_platelegs: smith("steel_platelegs", "steel_bar", 3, 41, 112),
  steel_platebody: smith("steel_platebody", "steel_bar", 5, 43, 187),
};

function cook(raw: string, cooked: string, level: number, experience: number, burnFreeLevel: number): Recipe {
  return {
    name: "Cooking",
    inputs: { [raw]: 1 },
    output: cooked,
    skill: "cooking",
    levelRequired: level,
    experience,
    ticksPerItem: 3,
    burnable: true,
    burnFreeLevel,
  };
}

export const COOKING: Record<string, Recipe> = {
  raw_shrimp: cook("raw_shrimp", "shrimp", 1, 30, 34),
  raw_chicken: cook("raw_chicken", "cooked_chicken", 1, 30, 33),
  raw_beef: cook("raw_beef", "cooked_meat", 1, 30, 33),
  raw_trout: cook("raw_trout", "trout", 15, 70, 50),
};

export function isCookable(itemId: string): boolean {
  return itemId in COOKING;
}

/** Burning fades out linearly and stops at the recipe's burn free level. */
export function burnChance(recipe: Recipe, level: number): number {
  if (!recipe.burnable || level >= (recipe.burnFreeLevel ?? 0)) return 0;
  const span = Math.max(1, (recipe.burnFreeLevel ?? 0) - recipe.levelRequired);
  const progress = (level - recipe.levelRequired) / span;
  return Math.max(0.05, 0.55 * (1 - progress));
}

/** Logs, the level to burn them and the experience they give. */
export const FIREMAKING: Record<string, { level: number; experience: number }> = {
  logs: { level: 1, experience: 40 },
  oak_logs: { level: 15, experience: 60 },
  willow_logs: { level: 30, experience: 90 },
};
