import { Inventory } from "../core/inventory";

/** "The Village Feast": Aldric wants a cooked meal delivered before nightfall. */
export const QUEST_NOT_STARTED = 0;
export const QUEST_STARTED = 1;
export const QUEST_COMPLETE = 2;

export const QUEST_NAME = "The Village Feast";
export const QUEST_REWARD_COINS = 500;
export const QUEST_REWARD_COOKING_XP = 350;

export const QUEST_REQUIREMENTS: Record<string, number> = {
  cooked_chicken: 1,
  cooked_meat: 1,
  shrimp: 2,
};

export function hasQuestIngredients(inventory: Inventory): boolean {
  return Object.entries(QUEST_REQUIREMENTS).every(([id, count]) => inventory.contains(id, count));
}

export function takeQuestIngredients(inventory: Inventory): void {
  for (const [id, count] of Object.entries(QUEST_REQUIREMENTS)) inventory.remove(id, count);
}

export function questProgressText(stage: number): string {
  if (stage === QUEST_STARTED) return "Aldric needs 1 cooked chicken, 1 cooked meat and 2 shrimp.";
  if (stage === QUEST_COMPLETE) return "You cooked for the village feast. Aldric is delighted.";
  return "Aldric the Cook is fretting by the crossroads.";
}
