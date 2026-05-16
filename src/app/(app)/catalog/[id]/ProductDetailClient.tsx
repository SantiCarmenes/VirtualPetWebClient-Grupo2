"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Check, ShieldCheck, Truck } from "lucide-react";
import { Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-6">
        <Link href="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Columna Izquierda: Imagen */}
          <div className="bg-muted/30 p-8 md:p-12 flex items-center justify-center min-h-[400px] border-b md:border-b-0 md:border-r border-border relative">
            {!product.inStock && (
              <div className="absolute top-8 left-8 z-10 bg-destructive text-destructive-foreground px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wider opacity-90 shadow-sm backdrop-blur-sm bg-red-600/90 text-white">
                Agotado
              </div>
            )}
            <div className="w-full max-w-md aspect-square bg-muted rounded-2xl flex items-center justify-center text-muted-foreground shadow-inner border border-border/50">
              [Imagen del Producto: {product.name}]
            </div>
          </div>

          {/* Columna Derecha: Detalles */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="text-sm text-primary font-bold tracking-widest uppercase mb-3">
              {product.category}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="text-3xl font-black text-primary mb-6">
              ${product.price.toLocaleString("es-AR")}
            </div>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-3">Opciones disponibles:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl border font-medium text-sm transition-all ${
                        selectedVariant === variant 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-xl bg-background">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>
              
              <button 
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al carrito
              </button>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                {product.inStock ? `${product.stockCount} unidades en stock` : 'Sin stock por el momento'}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-primary mr-3" />
                Envíos a todo Mar del Plata en el día
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary mr-3" />
                Garantía de calidad Virtual Pet
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
