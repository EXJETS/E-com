import { itemDef } from "./items";

export const INVENTORY_CAPACITY = 28;

/** A backpack slot: an item id and how many of it, or null when empty. */
export interface InventorySlot {
  id: string;
  count: number;
}

/** 28 slots. Stackable items share one slot, everything else takes a slot each. */
export class Inventory {
  private readonly slots: (InventorySlot | null)[] = new Array(INVENTORY_CAPACITY).fill(null);

  slot(index: number): InventorySlot | null {
    return index >= 0 && index < INVENTORY_CAPACITY ? this.slots[index] : null;
  }

  setSlot(index: number, id: string | null, count = 0): void {
    this.slots[index] = id === null || count <= 0 ? null : { id, count };
  }

  usedSlots(): number {
    return this.slots.filter((slot) => slot !== null).length;
  }

  freeSlots(): number {
    return INVENTORY_CAPACITY - this.usedSlots();
  }

  hasSpaceFor(id: string, count: number): boolean {
    if (itemDef(id).stackable) {
      return this.count(id) > 0 || this.freeSlots() >= 1;
    }
    return this.freeSlots() >= count;
  }

  /** @returns how many were actually added; the rest did not fit */
  add(id: string, count = 1): number {
    if (count <= 0) return 0;
    if (itemDef(id).stackable) {
      const existing = this.slots.find((slot) => slot?.id === id);
      if (existing) {
        existing.count += count;
        return count;
      }
      const free = this.firstEmptySlot();
      if (free < 0) return 0;
      this.slots[free] = { id, count };
      return count;
    }
    let added = 0;
    while (added < count) {
      const free = this.firstEmptySlot();
      if (free < 0) break;
      this.slots[free] = { id, count: 1 };
      added++;
    }
    return added;
  }

  /** @returns how many were actually removed */
  remove(id: string, count: number): number {
    let removed = 0;
    for (let i = 0; i < INVENTORY_CAPACITY && removed < count; i++) {
      const slot = this.slots[i];
      if (!slot || slot.id !== id) continue;
      const take = Math.min(slot.count, count - removed);
      slot.count -= take;
      removed += take;
      if (slot.count <= 0) this.slots[i] = null;
    }
    return removed;
  }

  /** Empties one slot and reports what it held. */
  clearSlot(index: number): InventorySlot | null {
    const slot = this.slot(index);
    this.slots[index] = null;
    return slot;
  }

  count(id: string): number {
    return this.slots.reduce((total, slot) => (slot?.id === id ? total + slot.count : total), 0);
  }

  contains(id: string, count = 1): boolean {
    return this.count(id) >= count;
  }

  firstIndexOf(id: string): number {
    return this.slots.findIndex((slot) => slot?.id === id);
  }

  /** Every distinct item held, in slot order. */
  distinctIds(): string[] {
    const ids: string[] = [];
    for (const slot of this.slots) {
      if (slot && !ids.includes(slot.id)) ids.push(slot.id);
    }
    return ids;
  }

  all(): (InventorySlot | null)[] {
    return this.slots;
  }

  clear(): void {
    this.slots.fill(null);
  }

  private firstEmptySlot(): number {
    return this.slots.findIndex((slot) => slot === null);
  }
}
