import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants.filter((v) => v.active);
  const hasVariants    = activeVariants.length > 0;

  const displayImage =
    product.images?.[0]?.url
    ?? activeVariants[0]?.images?.[0]?.url
    ?? null;

  const priceDisplay = () => {
    if (!hasVariants) return null;
    if (activeVariants.length === 1) {
      return `$${activeVariants[0].price.toLocaleString("es-AR")}`;
    }
    const minPrice = Math.min(...activeVariants.map((v) => v.price));
    return `Desde $${minPrice.toLocaleString("es-AR")}`;
  };

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 relative"
    >
      {/* Badge sin stock */}
      {!hasVariants && (
        <div className="absolute top-4 left-4 z-10 bg-red-600/90 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
          Agotado
        </div>
      )}

      {/* Imagen */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted">
            <ShoppingBag className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
          {product.category?.name}
        </div>
        <h3 className="font-bold text-foreground leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Precio + icono carrito */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">
            {priceDisplay() ?? <span className="text-muted-foreground text-sm">Sin stock</span>}
          </div>
          <div
            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            aria-hidden
          >
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
