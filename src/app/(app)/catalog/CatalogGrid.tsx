import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Pagination } from "@/lib/types";

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-10 w-10 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  products: Product[];
  isLoading: boolean;
  pagination: Pagination | null;
  pageParam: number;
  onPage: (page: number) => void;
  onClearFilters: () => void;
}

export function CatalogGrid({ products, isLoading, pagination, pageParam, onPage, onClearFilters }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border border-dashed">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No se encontraron productos</h3>
        <p className="text-muted-foreground max-w-md">
          Intentá ajustar los filtros o buscar otro término.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-6 px-6 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-10 flex-wrap">
          <button
            disabled={pageParam <= 1}
            onClick={() => onPage(pageParam - 1)}
            className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                p === pageParam
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border hover:bg-muted text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={pageParam >= pagination.totalPages}
            onClick={() => onPage(pageParam + 1)}
            className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </>
  );
}
