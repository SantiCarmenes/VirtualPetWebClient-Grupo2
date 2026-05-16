"use client";

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export function CartSlideOver() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Tu Carrito
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <div>
                <p className="font-bold text-lg">Tu carrito está vacío</p>
                <p className="text-muted-foreground text-sm mt-1">
                  ¡Descubrí nuestros productos y empezá a comprar!
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const imageUrl = item.variant?.images?.[0]?.url ?? null;
                const productName = item.variant?.product?.name ?? "Producto";
                const sku = item.variant?.sku;
                const price = item.variant?.price ?? 0;

                return (
                  <li key={item.id} className="flex gap-4">
                    {/* Imagen */}
                    <div className="w-20 h-20 rounded-xl bg-muted shrink-0 border border-border overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={productName}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-40" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold leading-tight line-clamp-2">
                            {productName}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label={`Eliminar ${productName}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {sku && (
                          <p className="text-xs text-muted-foreground mt-1">
                            SKU: {sku}
                          </p>
                        )}
                      </div>

                      {/* Cantidad + precio */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-bold text-primary">
                          ${(price * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-background/50">
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-primary">${cartTotal.toLocaleString("es-AR")}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all flex items-center justify-center"
            >
              Ir a Pagar
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
