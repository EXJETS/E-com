/** Guaranteed drops plus one weighted roll on the random table. */
export interface DropEntry {
  itemId: string | null;
  min: number;
  max: number;
  weight: number;
}

export interface DropTable {
  always: DropEntry[];
  random: DropEntry[];
}

export interface ResolvedDrop {
  itemId: string;
  count: number;
}

export function rollDrops(table: DropTable, random: () => number): ResolvedDrop[] {
  const rollCount = (entry: DropEntry) => entry.min + Math.floor(random() * (entry.max - entry.min + 1));
  const drops: ResolvedDrop[] = table.always
    .filter((entry): entry is DropEntry & { itemId: string } => entry.itemId !== null)
    .map((entry) => ({ itemId: entry.itemId, count: rollCount(entry) }));

  const totalWeight = table.random.reduce((total, entry) => total + entry.weight, 0);
  if (totalWeight > 0) {
    let pick = Math.floor(random() * totalWeight);
    for (const entry of table.random) {
      pick -= entry.weight;
      if (pick < 0) {
        if (entry.itemId !== null) drops.push({ itemId: entry.itemId, count: rollCount(entry) });
        break;
      }
    }
  }
  return drops;
}

export interface NpcDef {
  key: string;
  name: string;
  hitpoints: number;
  attackLevel: number;
  strengthLevel: number;
  defenceLevel: number;
  attackBonus: number;
  strengthBonus: number;
  defenceBonus: number;
  attackable: boolean;
  aggressive: boolean;
  respawnTicks: number;
  color: string;
  drops: DropTable;
  dialogue: string[];
  shopkeeper: boolean;
}

type NpcInput = Partial<NpcDef> & Pick<NpcDef, "key" | "name">;

const NPCS = new Map<string, NpcDef>();

function always(itemId: string, min = 1, max = min): DropEntry {
  return { itemId, min, max, weight: 0 };
}

function chance(itemId: string | null, min: number, max: number, weight: number): DropEntry {
  return { itemId, min, max, weight };
}

function register(npc: NpcInput): void {
  NPCS.set(npc.key, {
    hitpoints: 5,
    attackLevel: 1,
    strengthLevel: 1,
    defenceLevel: 1,
    attackBonus: 0,
    strengthBonus: 0,
    defenceBonus: 0,
    attackable: true,
    aggressive: false,
    respawnTicks: 50,
    color: "#EAB308",
    drops: { always: [], random: [] },
    dialogue: [],
    shopkeeper: false,
    ...npc,
  });
}

register({
  key: "chicken", name: "Chicken", hitpoints: 3, color: "#F5F5F4", respawnTicks: 40,
  drops: { always: [always("bones")], random: [chance("raw_chicken", 1, 1, 60), chance(null, 0, 0, 40)] },
});

register({
  key: "cow", name: "Cow", hitpoints: 8, color: "#D6D3D1", respawnTicks: 50,
  drops: { always: [always("bones"), always("raw_beef")], random: [chance("cowhide", 1, 1, 70), chance(null, 0, 0, 30)] },
});

register({
  key: "giant_rat", name: "Giant rat", hitpoints: 10, attackLevel: 3, strengthLevel: 3, defenceLevel: 2,
  color: "#78716C", respawnTicks: 50,
  drops: { always: [always("bones")], random: [chance("coins", 2, 12, 50), chance(null, 0, 0, 50)] },
});

register({
  key: "goblin", name: "Goblin", hitpoints: 14, attackLevel: 5, strengthLevel: 5, defenceLevel: 4,
  attackBonus: 4, strengthBonus: 4, defenceBonus: 4, aggressive: true, color: "#4D7C0F", respawnTicks: 60,
  drops: {
    always: [always("bones")],
    random: [
      chance("coins", 5, 40, 45),
      chance("goblin_mail", 1, 1, 15),
      chance("bronze_dagger", 1, 1, 8),
      chance("bronze_helm", 1, 1, 6),
      chance("copper_ore", 1, 2, 6),
      chance(null, 0, 0, 20),
    ],
  },
});

register({
  key: "guard", name: "Guard", hitpoints: 24, attackLevel: 19, strengthLevel: 18, defenceLevel: 17,
  attackBonus: 14, strengthBonus: 12, defenceBonus: 20, color: "#3B82F6", respawnTicks: 90,
  drops: {
    always: [always("bones")],
    random: [
      chance("coins", 20, 90, 55),
      chance("iron_sword", 1, 1, 6),
      chance("steel_bar", 1, 1, 5),
      chance(null, 0, 0, 34),
    ],
  },
});

register({
  key: "shopkeeper", name: "Shopkeeper Bram", hitpoints: 20, attackable: false, shopkeeper: true, color: "#A855F7",
  dialogue: [
    "Welcome to the Ashvale general store!",
    "I buy anything you drag out of the mine, and I sell the basics.",
  ],
});

register({
  key: "aldric", name: "Aldric the Cook", hitpoints: 20, attackable: false, color: "#F59E0B",
  dialogue: ["The village feast is tonight and my larder is bare!"],
});

export function npcDef(key: string): NpcDef {
  const def = NPCS.get(key);
  if (!def) throw new Error(`Unknown npc: ${key}`);
  return def;
}

/** The same melee combat level formula the player uses. */
export function npcCombatLevel(def: NpcDef): number {
  const base = 0.25 * (def.defenceLevel + def.hitpoints);
  const melee = 0.325 * (def.attackLevel + def.strengthLevel);
  return Math.max(1, Math.floor(base + melee));
}
