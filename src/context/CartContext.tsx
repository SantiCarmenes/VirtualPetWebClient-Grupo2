"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, Cart } from "@/lib/types";
import * as cartService from "@/lib/services/cart.service";
import { useAuth } from "@/context/AuthContext";

// ─── Tipos del contexto ───────────────────────────────────────

export interface CartItemMeta {
  sku?: string;
  price?: number;
  images?: { id: string; url: string }[];
  productName?: string;
  productId?: string;
  productSlug?: string;
  variantAttributes?: { attributeValue: { value: string } }[];
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (variantId: string, quantity: number, meta?: CartItemMeta) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

// ─── Guest cart helpers ──────────────────────────────────────

const GUEST_CART_KEY = "guestCart";

function loadGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function guestId(): string {
  return `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// ─── Contexto ────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; id: number } | null>(null);

  /**
   * Sincroniza el carrito:
   * - Si hay sesión (confirmada por AuthContext) → carga desde la API.
   * - Si no hay sesión → carga el carrito guest desde localStorage.
   */
  const syncCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems(loadGuestCart());
      return;
    }

    try {
      const cart: Cart = await cartService.getCart();
      setItems(cart.items ?? []);
    } catch {
      setItems([]);
    }
  }, [isAuthenticated]);

  // Espera a que AuthContext termine de verificar tokens antes de sincronizar.
  // Evita llamar getCart() con tokens stale que dispararían redirect a /login.
  useEffect(() => {
    if (!authLoading) syncCart();
  }, [syncCart, authLoading]);

  // Al hacer login: fusionar el carrito guest al carrito del servidor
  useEffect(() => {
    if (!isAuthenticated) return;

    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;

    const mergeGuestCart = async () => {
      try {
        await Promise.all(
          guestItems.map((item) => cartService.addItem(item.variantId, item.quantity))
        );
      } catch {
        // Si falla alguno, igualmente limpiamos y sincronizamos
      } finally {
        localStorage.removeItem(GUEST_CART_KEY);
        await syncCart();
      }
    };

    mergeGuestCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Auto-hide toast después de 3 segundos
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  /**
   * Agrega un ítem al carrito.
   * - Sin sesión: guarda en localStorage (carrito guest).
   * - Con sesión: llama a la API y refresca el carrito.
   */
  const addItem = async (variantId: string, quantity: number, meta?: CartItemMeta) => {
    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("refreshToken");

    // ── Carrito guest (sin sesión) ────────────────────────────
    if (!hasSession) {
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === variantId);
        let updated: CartItem[];

        if (existing) {
          updated = prev.map((i) =>
            i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          const newItem: CartItem = {
            id: guestId(),
            variantId,
            quantity,
            variant: meta
              ? {
                  id: variantId,
                  sku: meta.sku ?? "",
                  price: meta.price ?? 0,
                  images: meta.images ?? [],
                  variantAttributes: meta.variantAttributes ?? [],
                  product: {
                    id: meta.productId ?? "",
                    name: meta.productName ?? "Producto",
                    slug: meta.productSlug ?? "",
                  },
                }
              : null,
          };
          updated = [...prev, newItem];
        }

        saveGuestCart(updated);
        return updated;
      });

      setToastMessage({
        text: `Se agregó ${meta?.productName ?? "Producto"} al carrito`,
        id: Date.now(),
      });
      return;
    }

    // ── Carrito del servidor (con sesión) ─────────────────────
    setIsLoading(true);
    try {
      await cartService.addItem(variantId, quantity);
      const cart: Cart = await cartService.getCart();
      setItems(cart.items ?? []);

      const added = cart.items.find((i) => i.variantId === variantId);
      const name = added?.variant?.product?.name ?? meta?.productName ?? "Producto";
      setToastMessage({ text: `Se agregó ${name} al carrito`, id: Date.now() });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al agregar al carrito";
      setToastMessage({ text: msg, id: Date.now() });
    } finally {
      setIsLoading(false);
    }
  };

  /** Elimina un ítem. Para guests: actualiza localStorage. Para autenticados: optimistic + API. */
  const removeItem = async (itemId: string) => {
    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("refreshToken");

    if (!hasSession) {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== itemId);
        saveGuestCart(updated);
        return updated;
      });
      return;
    }

    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await cartService.removeItem(itemId);
    } catch {
      setItems(previous);
    }
  };

  /** Actualiza cantidad. Si quantity <= 0 → elimina. */
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("refreshToken");

    if (!hasSession) {
      setItems((prev) => {
        const updated = prev.map((i) => (i.id === itemId ? { ...i, quantity } : i));
        saveGuestCart(updated);
        return updated;
      });
      return;
    }

    const previous = items;
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
    try {
      await cartService.updateItem(itemId, quantity);
    } catch {
      setItems(previous);
    }
  };

  /** Vacía el carrito completo. */
  const clearCart = async () => {
    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("refreshToken");

    if (!hasSession) {
      setItems([]);
      saveGuestCart([]);
      return;
    }

    const previous = items;
    setItems([]);
    try {
      await cartService.clearCart();
    } catch {
      setItems(previous);
    }
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce(
    (total, item) => total + (item.variant?.price ?? 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncCart,
      }}
    >
      {children}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-3 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {toastMessage.text}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
