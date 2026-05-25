"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "processing" | "shipped" | "out_for_delivery" | "delivered";
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  shippingAddress: Address;
}

// ── Stored user record (includes hashed password) ─────────────────────────────

interface StoredUser extends User {
  passwordHash: string;
}

// ── Context value type ────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  saveOrder: (orderData: Omit<Order, "id" | "userId" | "status" | "createdAt" | "estimatedDelivery" | "trackingNumber">) => Order;
  getOrders: () => Order[];
  getAddresses: () => Address[];
  saveAddress: (data: Omit<Address, "id">) => Address;
  updateAddress: (id: string, data: Partial<Omit<Address, "id">>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

// ── localStorage keys ─────────────────────────────────────────────────────────

const KEY_USERS = "nexhome_users";
const KEY_SESSION = "nexhome_session";
const KEY_ORDERS = "nexhome_orders";
const addressesKey = (userId: string) => `nexhome_addresses_${userId}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  return btoa(password);
}

function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_USERS) || "[]");
  } catch {
    return [];
  }
}

function setStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

function getStoredOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_ORDERS) || "[]");
  } catch {
    return [];
  }
}

function setStoredOrders(orders: Order[]): void {
  localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
}

function getStoredAddresses(userId: string): Address[] {
  try {
    return JSON.parse(localStorage.getItem(addressesKey(userId)) || "[]");
  } catch {
    return [];
  }
}

function setStoredAddresses(userId: string, addresses: Address[]): void {
  localStorage.setItem(addressesKey(userId), JSON.stringify(addresses));
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem(KEY_SESSION);
      if (session) {
        const parsed = JSON.parse(session) as User;
        setUser(parsed);
      }
    } catch {
      // corrupted session — ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = useCallback((u: User) => {
    localStorage.setItem(KEY_SESSION, JSON.stringify(u));
    setUser(u);
  }, []);

  // ── login ────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const users = getStoredUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!found) {
        return { success: false, error: "No account found with that email address." };
      }
      if (found.passwordHash !== hashPassword(password)) {
        return { success: false, error: "Incorrect password. Please try again." };
      }
      const { passwordHash: _, ...userWithoutHash } = found;
      persistSession(userWithoutHash);
      return { success: true };
    },
    [persistSession]
  );

  // ── register ─────────────────────────────────────────────────────────────

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }): Promise<{ success: boolean; error?: string }> => {
      const users = getStoredUsers();
      if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, error: "An account with this email already exists." };
      }
      const newUser: StoredUser = {
        id: generateId("USR"),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: "",
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword(data.password),
      };
      setStoredUsers([...users, newUser]);
      const { passwordHash: _, ...userWithoutHash } = newUser;
      persistSession(userWithoutHash);
      return { success: true };
    },
    [persistSession]
  );

  // ── logout ───────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    localStorage.removeItem(KEY_SESSION);
    setUser(null);
  }, []);

  // ── updateProfile ────────────────────────────────────────────────────────

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated: User = { ...user, ...data };
      // also update in stored users list
      const users = getStoredUsers();
      setStoredUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, ...data } : u
        )
      );
      persistSession(updated);
    },
    [user, persistSession]
  );

  // ── saveOrder ────────────────────────────────────────────────────────────

  const saveOrder = useCallback(
    (
      orderData: Omit<
        Order,
        "id" | "userId" | "status" | "createdAt" | "estimatedDelivery" | "trackingNumber"
      >
    ): Order => {
      if (!user) throw new Error("Must be logged in to save an order");
      const now = new Date();
      const estimated = new Date(now);
      estimated.setDate(estimated.getDate() + 7);
      const order: Order = {
        ...orderData,
        id: "NX-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        userId: user.id,
        status: "processing",
        createdAt: now.toISOString(),
        estimatedDelivery: estimated.toISOString(),
        trackingNumber: "1Z" + Math.random().toString(36).slice(2, 12).toUpperCase(),
      };
      const orders = getStoredOrders();
      setStoredOrders([order, ...orders]);
      return order;
    },
    [user]
  );

  // ── getOrders ────────────────────────────────────────────────────────────

  const getOrders = useCallback((): Order[] => {
    if (!user) return [];
    const orders = getStoredOrders();
    return orders
      .filter((o) => o.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user]);

  // ── getAddresses ─────────────────────────────────────────────────────────

  const getAddresses = useCallback((): Address[] => {
    if (!user) return [];
    return getStoredAddresses(user.id);
  }, [user]);

  // ── saveAddress ──────────────────────────────────────────────────────────

  const saveAddress = useCallback(
    (data: Omit<Address, "id">): Address => {
      if (!user) throw new Error("Must be logged in to save an address");
      const newAddress: Address = { ...data, id: generateId("ADDR") };
      let addresses = getStoredAddresses(user.id);
      if (newAddress.isDefault) {
        addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      }
      setStoredAddresses(user.id, [...addresses, newAddress]);
      return newAddress;
    },
    [user]
  );

  // ── updateAddress ────────────────────────────────────────────────────────

  const updateAddress = useCallback(
    (id: string, data: Partial<Omit<Address, "id">>) => {
      if (!user) return;
      let addresses = getStoredAddresses(user.id);
      if (data.isDefault) {
        addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      }
      setStoredAddresses(
        user.id,
        addresses.map((a) => (a.id === id ? { ...a, ...data } : a))
      );
    },
    [user]
  );

  // ── deleteAddress ────────────────────────────────────────────────────────

  const deleteAddress = useCallback(
    (id: string) => {
      if (!user) return;
      const addresses = getStoredAddresses(user.id).filter((a) => a.id !== id);
      setStoredAddresses(user.id, addresses);
    },
    [user]
  );

  // ── setDefaultAddress ────────────────────────────────────────────────────

  const setDefaultAddress = useCallback(
    (id: string) => {
      if (!user) return;
      const addresses = getStoredAddresses(user.id).map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      setStoredAddresses(user.id, addresses);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        saveOrder,
        getOrders,
        getAddresses,
        saveAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
