import { ATTACK_STYLES, AttackStyle } from "./combat/formulas";
import { EQUIP_SLOTS, EquipSlot, itemExists } from "./core/items";
import { INVENTORY_CAPACITY } from "./core/inventory";
import { MAX_RUN_ENERGY, Player } from "./core/player";
import { SKILLS, SkillType } from "./core/skills";
import { parsePosition } from "./world/position";

export const SAVE_KEY = "ashvale.character";

/**
 * Characters are stored as plain key/value lines, the same format the desktop build writes,
 * so a save can be read and hand edited.
 */
export function serialize(player: Player): string {
  const lines: string[] = [
    "version=1",
    `name=${player.name}`,
    `position=${player.position.x},${player.position.y}`,
    `hitpoints=${player.skills.currentHitpoints()}`,
    `runEnergy=${player.runEnergy}`,
    `running=${player.runToggled}`,
    `attackStyle=${player.attackStyle}`,
    `questStage=${player.questStage}`,
    `deaths=${player.deaths}`,
  ];
  for (const skill of SKILLS) lines.push(`xp.${skill}=${player.skills.xp(skill)}`);
  for (let i = 0; i < INVENTORY_CAPACITY; i++) {
    const slot = player.inventory.slot(i);
    if (slot) lines.push(`inventory.${i}=${slot.id}:${slot.count}`);
  }
  for (const [slot, itemId] of player.equipment.entries()) lines.push(`equipment.${slot}=${itemId}`);
  for (const [itemId, count] of player.bank.entries()) lines.push(`bank.${itemId}=${count}`);
  return lines.join("\n");
}

/** Loads a character in place, ignoring anything the current build no longer knows about. */
export function deserialize(player: Player, text: string): void {
  const values = new Map<string, string>();
  for (const line of text.split("\n")) {
    const split = line.indexOf("=");
    if (split > 0) values.set(line.slice(0, split).trim(), line.slice(split + 1).trim());
  }

  player.name = values.get("name") ?? player.name;
  const position = values.get("position");
  if (position) player.position = parsePosition(position);
  player.inventory.clear();
  player.equipment.clear();
  player.bank.clear();

  for (const [key, value] of values) {
    if (key.startsWith("xp.")) {
      const skill = key.slice(3) as SkillType;
      if (SKILLS.includes(skill)) player.skills.setXp(skill, Number.parseInt(value, 10));
    } else if (key.startsWith("inventory.")) {
      const [id, count] = value.split(":");
      if (itemExists(id)) {
        player.inventory.setSlot(Number.parseInt(key.slice(10), 10), id, Number.parseInt(count, 10));
      }
    } else if (key.startsWith("equipment.")) {
      const slot = key.slice(10) as EquipSlot;
      if (EQUIP_SLOTS.includes(slot) && itemExists(value)) player.equipment.equip(value);
    } else if (key.startsWith("bank.")) {
      const itemId = key.slice(5);
      if (itemExists(itemId)) player.bank.deposit(itemId, Number.parseInt(value, 10));
    }
  }

  player.skills.setCurrentHitpoints(
    Number.parseInt(values.get("hitpoints") ?? String(player.skills.maxHitpoints()), 10),
  );
  player.setRunEnergy(Number.parseInt(values.get("runEnergy") ?? String(MAX_RUN_ENERGY), 10));
  player.runToggled = (values.get("running") ?? "true") === "true";
  player.questStage = Number.parseInt(values.get("questStage") ?? "0", 10);
  player.deaths = Number.parseInt(values.get("deaths") ?? "0", 10);
  const style = values.get("attackStyle") as AttackStyle;
  player.attackStyle = ATTACK_STYLES.includes(style) ? style : "aggressive";
}

/** Browser storage can be unavailable or full, and a lost save must never break the page. */
export function saveToStorage(player: Player): void {
  try {
    window.localStorage.setItem(SAVE_KEY, serialize(player));
  } catch {
    // Private browsing or a full quota; the character simply is not persisted.
  }
}

export function loadFromStorage(player: Player): boolean {
  try {
    const text = window.localStorage.getItem(SAVE_KEY);
    if (!text) return false;
    deserialize(player, text);
    return true;
  } catch {
    return false;
  }
}

export function clearStorage(): void {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}
