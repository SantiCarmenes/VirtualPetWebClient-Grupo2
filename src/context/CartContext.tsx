"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, Cart } from "@/lib/types";
import * as cartService from "@/lib/services/cart.service";

// ─── Tipos del contexto ───────────────────────────────────────

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

// ─── Contexto ────────────────────────────────────────────────

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; id: number } | null>(null);

  /**
   * Carga el carrito desde la API.
   * Solo se llama si hay refreshToken (usuario autenticado).
   */
  const syncCart = useCallback(async () => {
    const hasSession =
      typeof window !== "undefined" && !!localStorage.getItem("refreshToken");

    if (!hasSession) {
      setItems([]);
      return;
    }

    try {
      const cart: Cart = await cartService.getCart();
      setItems(cart.items ?? []);
    } catch {
      // Si falla (ej: 401 sin sesión) → carrito vacío silencioso
      setItems([]);
    }
  }, []);

  // Al montar → cargar carrito si hay sesión
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // Auto-hide toast después de 3 segundos
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  /** Agrega un ítem por variantId y refresca el carrito completo. */
  const addItem = async (variantId: string, quantity: number) => {
    setIsLoading(true);
    try {
      await cartService.addItem(variantId, quantity);
      const cart: Cart = await cartService.getCart();
      setItems(cart.items ?? []);

      const added = cart.items.find((i) => i.variantId === variantId);
      const name = added?.variant?.product?.name ?? "Producto";
      setToastMessage({ text: `Se agregó ${name} al carrito`, id: Date.now() });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al agregar al carrito";
      setToastMessage({ text: msg, id: Date.now() });
    } finally {
      setIsLoading(false);
    }
  };

  /** Elimina un ítem por su ID de CartItem. Optimistic update. */
  const removeItem = async (itemId: string) => {
    // Optimistic: quitar del estado local de inmediato
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== itemId));

    try {
      await cartService.removeItem(itemId);
    } catch {
      // Revertir si falla
      setItems(previous);
    }
  };

  /** Actualiza la cantidad de un ítem. Si quantity <= 0 → lo elimina. */
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    // Optimistic: actualizar cantidad de inmediato
    const previous = items;
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );

    try {
      await cartService.updateItem(itemId, quantity);
    } catch {
      // Revertir si falla
      setItems(previous);
    }
  };

  /** Vacía el carrito completo. */
  const clearCart = async () => {
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
    (total, item) => total + item.variant.price * item.quantity,
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
