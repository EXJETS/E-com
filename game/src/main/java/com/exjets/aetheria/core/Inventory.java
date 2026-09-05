package com.exjets.aetheria.core;

import java.util.ArrayList;
import java.util.List;

/** A 28 slot backpack. Stackable items share a slot, everything else takes one slot each. */
public class Inventory {

    public static final int CAPACITY = 28;

    /** A slot holds an item id and a count; a null id marks the slot empty. */
    public static final class Slot {
        public String id;
        public int count;

        Slot(String id, int count) {
            this.id = id;
            this.count = count;
        }
    }

    private final Slot[] slots = new Slot[CAPACITY];

    public int capacity() {
        return CAPACITY;
    }

    public Slot slot(int index) {
        return index >= 0 && index < CAPACITY ? slots[index] : null;
    }

    public boolean isEmpty(int index) {
        return slot(index) == null;
    }

    public int usedSlots() {
        int used = 0;
        for (Slot slot : slots) {
            if (slot != null) {
                used++;
            }
        }
        return used;
    }

    public int freeSlots() {
        return CAPACITY - usedSlots();
    }

    public boolean hasSpaceFor(String itemId, int count) {
        if (ItemRegistry.get(itemId).stackable() && count(itemId) > 0) {
            return true;
        }
        return freeSlots() >= (ItemRegistry.get(itemId).stackable() ? 1 : count);
    }

    /**
     * Adds items to the backpack.
     *
     * @return how many were actually added; the rest did not fit
     */
    public int add(String itemId, int count) {
        ItemDef def = ItemRegistry.get(itemId);
        if (count <= 0) {
            return 0;
        }
        if (def.stackable()) {
            for (Slot slot : slots) {
                if (slot != null && slot.id.equals(itemId)) {
                    slot.count += count;
                    return count;
                }
            }
            int free = firstEmptySlot();
            if (free < 0) {
                return 0;
            }
            slots[free] = new Slot(itemId, count);
            return count;
        }
        int added = 0;
        while (added < count) {
            int free = firstEmptySlot();
            if (free < 0) {
                break;
            }
            slots[free] = new Slot(itemId, 1);
            added++;
        }
        return added;
    }

    public boolean add(String itemId) {
        return add(itemId, 1) == 1;
    }

    /**
     * Removes items from the backpack.
     *
     * @return how many were actually removed
     */
    public int remove(String itemId, int count) {
        int removed = 0;
        for (int i = 0; i < CAPACITY && removed < count; i++) {
            Slot slot = slots[i];
            if (slot == null || !slot.id.equals(itemId)) {
                continue;
            }
            int take = Math.min(slot.count, count - removed);
            slot.count -= take;
            removed += take;
            if (slot.count <= 0) {
                slots[i] = null;
            }
        }
        return removed;
    }

    /** Empties a single slot and reports what it held, or null if it was already empty. */
    public Slot clearSlot(int index) {
        Slot slot = slot(index);
        slots[index] = null;
        return slot;
    }

    public void setSlot(int index, String itemId, int count) {
        slots[index] = itemId == null || count <= 0 ? null : new Slot(itemId, count);
    }

    public void swap(int a, int b) {
        Slot tmp = slots[a];
        slots[a] = slots[b];
        slots[b] = tmp;
    }

    public int count(String itemId) {
        int total = 0;
        for (Slot slot : slots) {
            if (slot != null && slot.id.equals(itemId)) {
                total += slot.count;
            }
        }
        return total;
    }

    public boolean contains(String itemId) {
        return count(itemId) > 0;
    }

    public boolean contains(String itemId, int count) {
        return count(itemId) >= count;
    }

    public int firstIndexOf(String itemId) {
        for (int i = 0; i < CAPACITY; i++) {
            if (slots[i] != null && slots[i].id.equals(itemId)) {
                return i;
            }
        }
        return -1;
    }

    /** All distinct item ids currently held, in slot order. */
    public List<String> distinctIds() {
        List<String> ids = new ArrayList<>();
        for (Slot slot : slots) {
            if (slot != null && !ids.contains(slot.id)) {
                ids.add(slot.id);
            }
        }
        return ids;
    }

    public void clear() {
        for (int i = 0; i < CAPACITY; i++) {
            slots[i] = null;
        }
    }

    private int firstEmptySlot() {
        for (int i = 0; i < CAPACITY; i++) {
            if (slots[i] == null) {
                return i;
            }
        }
        return -1;
    }
}
