import { itemDef } from "../core/items";

/** The general store: fixed stock, buys anything at a fraction of its value. */
export const SHOP_STOCK = [
  "bronze_axe",
  "bronze_pickaxe",
  "small_net",
  "fishing_rod",
  "tinderbox",
  "bronze_dagger",
  "bronze_sword",
  "wooden_shield",
  "bronze_helm",
  "shrimp",
];

export function buyPrice(itemId: string): number {
  return Math.max(1, Math.round(itemDef(itemId).value * 1.3));
}

export function sellPrice(itemId: string): number {
  return Math.max(1, Math.round(itemDef(itemId).value * 0.55));
}
