"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ShoppingCart, Check,
  ShieldCheck, Truck, ShoppingBag, Minus, Plus
} from "lucide-react";
import type { Product, Variant } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();

  const activeVariants = product.variants.filter((v) => v.active);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    activeVariants.length === 1 ? activeVariants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);

  // ── Imagen reactiva ───────────────────────────────────────────────────────
  const displayImage =
    selectedVariant?.images?.[0]?.url
    ?? product.images?.[0]?.url
    ?? null;

  // ── Precio ────────────────────────────────────────────────────────────────
  const price = selectedVariant?.price
    ?? (activeVariants.length > 0
      ? Math.min(...activeVariants.map((v) => v.price))
      : null);
  const pricePrefix = !selectedVariant && activeVariants.length > 1 ? "Desde " : "";

  // ── Agregar al carrito ────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedVariant && activeVariants.length > 1) return; // necesita elegir variante
    const variantId = selectedVariant?.id ?? activeVariants[0]?.id;
    if (!variantId) return;

    addItem(variantId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const canAddToCart = activeVariants.length > 0 &&
    (activeVariants.length === 1 || selectedVariant !== null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-6">
        <Link
          href="/catalog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* ── Imagen ── */}
          <div className="bg-muted/30 p-8 md:p-12 flex items-center justify-center min-h-[400px] border-b md:border-b-0 md:border-r border-border relative">
            {activeVariants.length === 0 && (
              <div className="absolute top-8 left-8 z-10 bg-red-600/90 text-white px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wider shadow-sm">
                Agotado
              </div>
            )}
            <div className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden bg-muted border border-border/50">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={selectedVariant ? `${product.name} - ${selectedVariant.sku}` : product.name}
                  fill
                  className="object-contain transition-all duration-300"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                </div>
              )}
            </div>

            {/* Thumbnails de otras imágenes del producto */}
            {product.images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {product.images.slice(0, 5).map((img) => (
                  <div
                    key={img.id}
                    className="w-12 h-12 rounded-lg border-2 border-border bg-muted overflow-hidden relative"
                  >
                    <Image src={img.url} alt={product.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Detalles ── */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="text-sm text-primary font-bold tracking-widest uppercase mb-3">
              {product.category?.name}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-4">
              {product.name}
            </h1>

            {price !== null && (
              <div className="text-3xl font-black text-primary mb-6">
                {pricePrefix}${price.toLocaleString("es-AR")}
              </div>
            )}

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Selector de variantes */}
            {activeVariants.length > 1 && (
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-3">
                  Variantes disponibles:
                  {!selectedVariant && (
                    <span className="text-primary ml-1">*</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {activeVariants.map((variant) => {
                    const label = variant.variantAttributes
                      ?.map((va) => va.attributeValue.value)
                      .join(" · ") ?? variant.sku;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(
                          selectedVariant?.id === variant.id ? null : variant
                        )}
                        className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {!selectedVariant && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Seleccioná una variante para agregar al carrito.
                  </p>
                )}
              </div>
            )}

            {/* Cantidad + Botón */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-xl bg-background">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Reducir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                id="product-detail-add-to-cart"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 font-bold rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  added
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-lg"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    ¡Agregado!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al carrito
                  </>
                )}
              </button>
            </div>

            {/* Info extra */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                {activeVariants.length > 0
                  ? `${activeVariants.length} variante${activeVariants.length > 1 ? "s" : ""} disponible${activeVariants.length > 1 ? "s" : ""}`
                  : "Sin stock por el momento"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary mr-3 shrink-0" />
                Envíos a todo Mar del Plata en el día
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary mr-3 shrink-0" />
                Garantía de calidad Virtual Pet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
