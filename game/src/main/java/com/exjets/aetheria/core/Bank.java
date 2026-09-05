package com.exjets.aetheria.core;

import java.util.LinkedHashMap;
import java.util.Map;

/** Unlimited storage, reachable at any bank booth. Every item stacks here. */
public class Bank {

    private final Map<String, Integer> contents = new LinkedHashMap<>();

    public void deposit(String itemId, int count) {
        if (count <= 0) {
            return;
        }
        contents.merge(itemId, count, Integer::sum);
    }

    /** @return how many were actually withdrawn */
    public int withdraw(String itemId, int count) {
        int held = count(itemId);
        int taken = Math.min(held, count);
        if (taken <= 0) {
            return 0;
        }
        if (held - taken <= 0) {
            contents.remove(itemId);
        } else {
            contents.put(itemId, held - taken);
        }
        return taken;
    }

    public int count(String itemId) {
        return contents.getOrDefault(itemId, 0);
    }

    public Map<String, Integer> contents() {
        return contents;
    }

    public boolean isEmpty() {
        return contents.isEmpty();
    }

    public void clear() {
        contents.clear();
    }
}
