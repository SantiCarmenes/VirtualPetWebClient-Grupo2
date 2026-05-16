"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import type { Product, Variant } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [showPicker, setShowPicker]           = useState(false);

  const activeVariants = product.variants.filter((v) => v.active);
  const hasVariants    = activeVariants.length > 0;

  // ── Imagen reactiva ───────────────────────────────────────────────────────
  const displayImage =
    selectedVariant?.images?.[0]?.url   // imagen de la variante activa
    ?? product.images?.[0]?.url          // fallback: imagen principal del producto
    ?? null;                             // fallback final: placeholder

  // ── Precio ────────────────────────────────────────────────────────────────
  const priceDisplay = () => {
    if (!hasVariants) return null;
    if (selectedVariant) {
      return `$${selectedVariant.price.toLocaleString("es-AR")}`;
    }
    if (activeVariants.length === 1) {
      return `$${activeVariants[0].price.toLocaleString("es-AR")}`;
    }
    const minPrice = Math.min(...activeVariants.map((v) => v.price));
    return `Desde $${minPrice.toLocaleString("es-AR")}`;
  };

  // ── Agregar al carrito ────────────────────────────────────────────────────
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasVariants) return;

    if (activeVariants.length === 1) {
      addItem(activeVariants[0].id, 1);
      return;
    }

    // Más de una variante → abrir picker
    setShowPicker(true);
  };

  const handlePickVariant = (e: React.MouseEvent, variant: Variant) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(variant.id, 1);
    setShowPicker(false);
    setSelectedVariant(null);
  };

  const closePicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPicker(false);
    setSelectedVariant(null);
  };

  return (
    <div className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 relative">

      {/* Badge sin stock */}
      {!hasVariants && (
        <div className="absolute top-4 left-4 z-10 bg-red-600/90 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
          Agotado
        </div>
      )}

      {/* Imagen */}
      <Link href={`/catalog/${product.slug}`} className="relative aspect-square bg-muted/20 overflow-hidden block">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted">
            <ShoppingBag className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
          {product.category?.name}
        </div>
        <Link href={`/catalog/${product.slug}`} className="hover:text-primary transition-colors block">
          <h3 className="font-bold text-foreground leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Variantes (hover preview) */}
        {activeVariants.length > 1 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {activeVariants.slice(0, 4).map((v) => {
              const label = v.variantAttributes?.[0]?.attributeValue?.value ?? v.sku;
              return (
                <button
                  key={v.id}
                  onClick={(e) => { e.preventDefault(); setSelectedVariant(v); }}
                  title={v.variantAttributes?.map((va) => va.attributeValue.value).join(" · ")}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    selectedVariant?.id === v.id
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            {activeVariants.length > 4 && (
              <span className="text-xs text-muted-foreground px-2 py-0.5">
                +{activeVariants.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Precio + botón */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">
            {priceDisplay() ?? <span className="text-muted-foreground text-sm">Sin stock</span>}
          </div>
          <button
            disabled={!hasVariants}
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={hasVariants ? "Agregar al carrito" : "Sin stock"}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Mini-modal de variantes ── */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={closePicker}
          />
          <div className="absolute bottom-full left-0 right-0 z-50 bg-card border border-border rounded-2xl shadow-2xl p-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">Elegí una variante</p>
              <button onClick={closePicker} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeVariants.map((v) => {
                const label = v.variantAttributes
                  ?.map((va) => va.attributeValue.value)
                  .join(" · ") ?? v.sku;
                const img = v.images?.[0]?.url ?? displayImage;

                return (
                  <button
                    key={v.id}
                    onClick={(e) => handlePickVariant(e, v)}
                    onMouseEnter={() => setSelectedVariant(v)}
                    onMouseLeave={() => setSelectedVariant(null)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={label}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover w-10 h-10 border border-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground opacity-40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{label}</p>
                      <p className="text-xs text-muted-foreground">{v.sku}</p>
                    </div>
                    <p className="text-sm font-bold text-primary shrink-0">
                      ${v.price.toLocaleString("es-AR")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
