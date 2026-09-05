export type EquipSlot = "head" | "body" | "legs" | "weapon" | "shield";

export const EQUIP_SLOTS: EquipSlot[] = ["head", "body", "legs", "weapon", "shield"];

export const EQUIP_SLOT_NAMES: Record<EquipSlot, string> = {
  head: "Head",
  body: "Body",
  legs: "Legs",
  weapon: "Weapon",
  shield: "Shield",
};

export type ToolType = "axe" | "pickaxe" | "net" | "rod" | "tinderbox";

export interface ItemDef {
  id: string;
  name: string;
  stackable: boolean;
  value: number;
  color: string;
  slot?: EquipSlot;
  attackBonus: number;
  strengthBonus: number;
  defenceBonus: number;
  attackRequirement: number;
  defenceRequirement: number;
  /** How many hitpoints eating it restores; 0 means it is not food. */
  heals: number;
  toolType?: ToolType;
  /** Doubles as the level needed to use the tool and as its speed bonus. */
  toolTier: number;
}

type ItemInput = Partial<ItemDef> & Pick<ItemDef, "id" | "name">;

const ITEMS = new Map<string, ItemDef>();

function register(item: ItemInput): void {
  ITEMS.set(item.id, {
    stackable: false,
    value: 1,
    color: "#A1A1AA",
    attackBonus: 0,
    strengthBonus: 0,
    defenceBonus: 0,
    attackRequirement: 0,
    defenceRequirement: 0,
    heals: 0,
    toolTier: 0,
    ...item,
  });
}

// currency and junk
register({ id: "coins", name: "Coins", stackable: true, value: 1, color: "#FACC15" });
register({ id: "bones", name: "Bones", value: 2, color: "#E7E5E4" });
register({ id: "cowhide", name: "Cowhide", value: 12, color: "#8B5E3C" });
register({ id: "goblin_mail", name: "Goblin mail", value: 20, color: "#4D7C0F" });

// woodcutting
register({ id: "logs", name: "Logs", value: 4, color: "#92400E" });
register({ id: "oak_logs", name: "Oak logs", value: 20, color: "#7C3F12" });
register({ id: "willow_logs", name: "Willow logs", value: 40, color: "#65A30D" });

// mining and smithing
register({ id: "copper_ore", name: "Copper ore", value: 8, color: "#B45309" });
register({ id: "tin_ore", name: "Tin ore", value: 8, color: "#A8A29E" });
register({ id: "iron_ore", name: "Iron ore", value: 28, color: "#7F1D1D" });
register({ id: "coal", name: "Coal", value: 45, color: "#27272A" });
register({ id: "bronze_bar", name: "Bronze bar", value: 30, color: "#B45309" });
register({ id: "iron_bar", name: "Iron bar", value: 70, color: "#9CA3AF" });
register({ id: "steel_bar", name: "Steel bar", value: 160, color: "#CBD5E1" });

// food
register({ id: "raw_shrimp", name: "Raw shrimp", value: 4, color: "#FDA4AF" });
register({ id: "shrimp", name: "Shrimp", value: 8, heals: 3, color: "#FB7185" });
register({ id: "raw_trout", name: "Raw trout", value: 30, color: "#93C5FD" });
register({ id: "trout", name: "Trout", value: 50, heals: 7, color: "#60A5FA" });
register({ id: "raw_chicken", name: "Raw chicken", value: 5, color: "#FECACA" });
register({ id: "cooked_chicken", name: "Cooked chicken", value: 12, heals: 4, color: "#D97706" });
register({ id: "raw_beef", name: "Raw beef", value: 6, color: "#EF4444" });
register({ id: "cooked_meat", name: "Cooked meat", value: 14, heals: 5, color: "#9A3412" });
register({ id: "burnt_food", name: "Burnt food", value: 1, color: "#1C1917" });

// tools
register({ id: "tinderbox", name: "Tinderbox", value: 10, color: "#A16207", toolType: "tinderbox", toolTier: 1 });
register({ id: "small_net", name: "Small fishing net", value: 15, color: "#84CC16", toolType: "net", toolTier: 1 });
register({ id: "fishing_rod", name: "Fishing rod", value: 30, color: "#A16207", toolType: "rod", toolTier: 1 });
register({ id: "bronze_axe", name: "Bronze axe", value: 30, color: "#B45309", toolType: "axe", toolTier: 1,
  slot: "weapon", attackBonus: 3, strengthBonus: 3, attackRequirement: 1 });
register({ id: "iron_axe", name: "Iron axe", value: 90, color: "#9CA3AF", toolType: "axe", toolTier: 5,
  slot: "weapon", attackBonus: 5, strengthBonus: 5, attackRequirement: 1 });
register({ id: "steel_axe", name: "Steel axe", value: 200, color: "#CBD5E1", toolType: "axe", toolTier: 10,
  slot: "weapon", attackBonus: 8, strengthBonus: 8, attackRequirement: 5 });
register({ id: "bronze_pickaxe", name: "Bronze pickaxe", value: 30, color: "#B45309", toolType: "pickaxe", toolTier: 1,
  slot: "weapon", attackBonus: 3, strengthBonus: 2, attackRequirement: 1 });
register({ id: "iron_pickaxe", name: "Iron pickaxe", value: 90, color: "#9CA3AF", toolType: "pickaxe", toolTier: 5,
  slot: "weapon", attackBonus: 5, strengthBonus: 4, attackRequirement: 1 });
register({ id: "steel_pickaxe", name: "Steel pickaxe", value: 200, color: "#CBD5E1", toolType: "pickaxe", toolTier: 10,
  slot: "weapon", attackBonus: 8, strengthBonus: 6, attackRequirement: 5 });

// weapons
register({ id: "bronze_dagger", name: "Bronze dagger", value: 20, color: "#B45309",
  slot: "weapon", attackBonus: 4, strengthBonus: 3, attackRequirement: 1 });
register({ id: "bronze_sword", name: "Bronze sword", value: 52, color: "#B45309",
  slot: "weapon", attackBonus: 7, strengthBonus: 6, attackRequirement: 1 });
register({ id: "iron_sword", name: "Iron sword", value: 140, color: "#9CA3AF",
  slot: "weapon", attackBonus: 11, strengthBonus: 10, attackRequirement: 1 });
register({ id: "steel_sword", name: "Steel sword", value: 325, color: "#CBD5E1",
  slot: "weapon", attackBonus: 17, strengthBonus: 16, attackRequirement: 5 });
register({ id: "mithril_sword", name: "Mithril sword", value: 910, color: "#818CF8",
  slot: "weapon", attackBonus: 24, strengthBonus: 23, attackRequirement: 20 });

// armour
register({ id: "wooden_shield", name: "Wooden shield", value: 20, color: "#92400E",
  slot: "shield", defenceBonus: 4, defenceRequirement: 1 });
register({ id: "bronze_shield", name: "Bronze shield", value: 68, color: "#B45309",
  slot: "shield", defenceBonus: 8, defenceRequirement: 1 });
register({ id: "iron_shield", name: "Iron shield", value: 182, color: "#9CA3AF",
  slot: "shield", defenceBonus: 14, defenceRequirement: 1 });
register({ id: "steel_shield", name: "Steel shield", value: 455, color: "#CBD5E1",
  slot: "shield", defenceBonus: 21, defenceRequirement: 5 });
register({ id: "bronze_helm", name: "Bronze helm", value: 36, color: "#B45309",
  slot: "head", defenceBonus: 5, defenceRequirement: 1 });
register({ id: "iron_helm", name: "Iron helm", value: 98, color: "#9CA3AF",
  slot: "head", defenceBonus: 9, defenceRequirement: 1 });
register({ id: "steel_helm", name: "Steel helm", value: 245, color: "#CBD5E1",
  slot: "head", defenceBonus: 13, defenceRequirement: 5 });
register({ id: "bronze_platebody", name: "Bronze platebody", value: 160, color: "#B45309",
  slot: "body", defenceBonus: 12, defenceRequirement: 1 });
register({ id: "iron_platebody", name: "Iron platebody", value: 400, color: "#9CA3AF",
  slot: "body", defenceBonus: 20, defenceRequirement: 1 });
register({ id: "steel_platebody", name: "Steel platebody", value: 1000, color: "#CBD5E1",
  slot: "body", defenceBonus: 30, defenceRequirement: 5 });
register({ id: "bronze_platelegs", name: "Bronze platelegs", value: 80, color: "#B45309",
  slot: "legs", defenceBonus: 9, defenceRequirement: 1 });
register({ id: "iron_platelegs", name: "Iron platelegs", value: 200, color: "#9CA3AF",
  slot: "legs", defenceBonus: 15, defenceRequirement: 1 });
register({ id: "steel_platelegs", name: "Steel platelegs", value: 500, color: "#CBD5E1",
  slot: "legs", defenceBonus: 23, defenceRequirement: 5 });

export function itemDef(id: string): ItemDef {
  const def = ITEMS.get(id);
  if (!def) throw new Error(`Unknown item: ${id}`);
  return def;
}

export function itemExists(id: string): boolean {
  return ITEMS.has(id);
}

export function itemName(id: string): string {
  return itemDef(id).name;
}

export function allItems(): ItemDef[] {
  return [...ITEMS.values()];
}
