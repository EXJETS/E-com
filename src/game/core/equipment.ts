import { EquipSlot, ItemDef, itemDef } from "./items";

/** Worn gear, one item per slot, feeding the combat formulas. */
export class Equipment {
  private readonly worn = new Map<EquipSlot, string>();

  get(slot: EquipSlot): string | null {
    return this.worn.get(slot) ?? null;
  }

  /** @returns the item that was in the slot before, or null */
  equip(id: string): string | null {
    const def = itemDef(id);
    if (!def.slot) throw new Error(`${def.name} cannot be equipped`);
    const previous = this.worn.get(def.slot) ?? null;
    this.worn.set(def.slot, id);
    return previous;
  }

  unequip(slot: EquipSlot): string | null {
    const removed = this.worn.get(slot) ?? null;
    this.worn.delete(slot);
    return removed;
  }

  entries(): [EquipSlot, string][] {
    return [...this.worn.entries()];
  }

  attackBonus(): number {
    return this.sum((def) => def.attackBonus);
  }

  strengthBonus(): number {
    return this.sum((def) => def.strengthBonus);
  }

  defenceBonus(): number {
    return this.sum((def) => def.defenceBonus);
  }

  clear(): void {
    this.worn.clear();
  }

  private sum(field: (def: ItemDef) => number): number {
    let total = 0;
    for (const id of this.worn.values()) total += field(itemDef(id));
    return total;
  }
}
