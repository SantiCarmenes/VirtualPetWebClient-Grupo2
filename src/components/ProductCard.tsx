"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product detail page
    e.stopPropagation();
    addItem(product, 1, product.variants?.[0]); // Add default variant if any
  };

  return (
    <div className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 relative">
      {!product.inStock && (
        <div className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider opacity-90 shadow-sm backdrop-blur-sm bg-red-600/90 text-white">
          Agotado
        </div>
      )}
      
      <Link href={`/catalog/${product.id}`} className="relative aspect-square bg-muted/20 overflow-hidden block">
        {/* Placeholder for real image */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted">
          [Image]
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
          {product.category}
        </div>
        <Link href={`/catalog/${product.id}`} className="hover:text-primary transition-colors block">
          <h3 className="font-bold text-foreground leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">
            ${product.price.toLocaleString("es-AR")}
          </div>
          <button 
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={product.inStock ? "Agregar al carrito" : "Sin stock"}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
