import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/types";

interface Props {
  searchQuery: string;
  selectedCategorySlugs: string[];
  categories: Category[];
  totalProducts: number;
  isLoading: boolean;
  sortParam: string;
  hasActiveFilters: boolean;
  onSortChange: (sort: string) => void;
  onToggleMobileFilter: () => void;
}

export function CatalogHeader({
  searchQuery,
  selectedCategorySlugs,
  categories,
  totalProducts,
  isLoading,
  sortParam,
  hasActiveFilters,
  onSortChange,
  onToggleMobileFilter,
}: Props) {
  const title = searchQuery
    ? `Resultados para "${searchQuery}"`
    : selectedCategorySlugs.length === 1
      ? (categories.find((c) => c.slug === selectedCategorySlugs[0])?.name ?? "Categoría")
      : selectedCategorySlugs.length > 1
        ? selectedCategorySlugs
            .map((s) => categories.find((c) => c.slug === s)?.name)
            .filter(Boolean)
            .join(", ")
        : "Catálogo de Productos";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">{title}</h1>
        {!isLoading && (
          <p className="text-muted-foreground">
            {totalProducts} {totalProducts === 1 ? "producto" : "productos"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile filter button */}
        <button
          onClick={onToggleMobileFilter}
          className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-colors ${
            hasActiveFilters
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-foreground hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
