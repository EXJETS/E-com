"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const KEY_WISHLIST = "nexhome_wishlist";

interface WishlistContextValue {
  items: string[];
  count: number;
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  // Rehydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY_WISHLIST);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    localStorage.setItem(KEY_WISHLIST, JSON.stringify(next));
    setItems(next);
  }, []);

  const toggle = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem(KEY_WISHLIST, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const isWishlisted = useCallback(
    (productId: string): boolean => items.includes(productId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, count: items.length, toggle, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
