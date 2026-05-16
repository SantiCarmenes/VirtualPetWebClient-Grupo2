"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, ChevronDown, SearchX, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/services/catalog.service";
import type { Product, Category, Attribute, Pagination } from "@/lib/types";

interface Props {
  categories: Category[];
  filterableAttributes: Attribute[];
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
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

export function CatalogClient({ categories, filterableAttributes }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // ── Leer filtros desde la URL ─────────────────────────────────────────────
  const categorySlug        = searchParams.get("category") ?? "";
  const searchQuery         = searchParams.get("search")   ?? "";
  const sortParam           = (searchParams.get("sort") ?? "destacados") as "destacados" | "menor" | "mayor";
  const pageParam           = Number(searchParams.get("page") ?? "1");
  const attributeIdsParam   = searchParams.get("attributeValueIds") ?? "";

  // ── Estado de productos ───────────────────────────────────────────────────
  const [products, setProducts]       = useState<Product[]>([]);
  const [pagination, setPagination]   = useState<Pagination | null>(null);
  const [isLoading, setIsLoading]     = useState(true);

  // ── Filtros locales sincronizados con la URL ───────────────────────────────
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  // Resolver slug → categoryId
  const categoryId = categories.find((c) => c.slug === categorySlug)?.id ?? "";

  // ── Actualizar URL helper ─────────────────────────────────────────────────
  const updateUrl = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(overrides).forEach(([k, v]) => {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      });
      // Reset page cuando cambia cualquier filtro (salvo si el override ya incluye page)
      if (!("page" in overrides)) params.delete("page");
      router.replace(`/catalog?${params.toString()}`);
    },
    [searchParams, router]
  );

  // ── Fetch de productos ────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getProducts({
        categoryId:       categoryId || undefined,
        search:           searchQuery || undefined,
        sort:             sortParam !== "destacados" ? sortParam : undefined,
        page:             pageParam,
        limit:            20,
        attributeValueIds: attributeIdsParam || undefined,
        minPrice:         minPrice ? Number(minPrice) : undefined,
        maxPrice:         maxPrice ? Number(maxPrice) : undefined,
      });
      setProducts(result.data);
      setPagination(result.pagination);
    } catch {
      setProducts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, searchQuery, sortParam, pageParam, attributeIdsParam, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Manejo de filtros de atributos (checkboxes) ───────────────────────────
  const selectedAttributeIds = attributeIdsParam ? attributeIdsParam.split(",") : [];

  const toggleAttributeValue = (valueId: string) => {
    const next = selectedAttributeIds.includes(valueId)
      ? selectedAttributeIds.filter((id) => id !== valueId)
      : [...selectedAttributeIds, valueId];
    updateUrl({ attributeValueIds: next.length ? next.join(",") : null });
  };

  // ── Limpiar todos los filtros ─────────────────────────────────────────────
  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.replace("/catalog");
  };

  const totalProducts = pagination?.total ?? products.length;

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : categorySlug
                ? `${categories.find((c) => c.slug === categorySlug)?.name ?? "Categoría"}`
                : "Catálogo de Productos"}
          </h1>
          {!isLoading && (
            <p className="text-muted-foreground">
              {totalProducts} {totalProducts === 1 ? "producto" : "productos"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortParam}
              onChange={(e) => updateUrl({ sort: e.target.value as string })}
              className="appearance-none bg-background border border-border text-foreground px-4 py-2 pr-10 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="destacados">Destacados</option>
              <option value="menor">Menor Precio</option>
              <option value="mayor">Mayor Precio</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
          <button className="md:hidden p-2 rounded-full border border-border text-foreground hover:bg-muted transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Sidebar filtros ── */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">

          {/* Categorías */}
          {categories.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Categorías</h3>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!categorySlug}
                      onChange={() => updateUrl({ category: null })}
                      className="w-4 h-4 accent-primary rounded border-border cursor-pointer"
                    />
                    <span className={`transition-colors ${!categorySlug ? "text-primary font-medium" : "text-foreground group-hover:text-primary"}`}>
                      Todos
                    </span>
                  </label>
                </li>
                {categories.filter((c) => c.active).map((cat) => (
                  <li key={cat.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={categorySlug === cat.slug}
                        onChange={() => updateUrl({ category: categorySlug === cat.slug ? null : cat.slug })}
                        className="w-4 h-4 accent-primary rounded border-border cursor-pointer"
                      />
                      <span className={`transition-colors ${categorySlug === cat.slug ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {cat.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Atributos filtrables */}
          {filterableAttributes.map((attr) => (
            <div key={attr.id}>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">{attr.name}</h3>
              <ul className="space-y-3">
                {attr.values.map((val) => (
                  <li key={val.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAttributeIds.includes(val.id)}
                        onChange={() => toggleAttributeValue(val.id)}
                        className="w-4 h-4 accent-primary rounded border-border cursor-pointer"
                      />
                      <span className={`transition-colors text-sm ${selectedAttributeIds.includes(val.id) ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {val.value}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Rango de precio */}
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Rango de Precio</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => updateUrl({ minPrice: minPrice || null })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
              <span className="text-muted-foreground font-medium">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => updateUrl({ maxPrice: maxPrice || null })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Botón limpiar */}
          {(categorySlug || searchQuery || attributeIdsParam || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </aside>

        {/* ── Grilla de productos ── */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground max-w-md">
                Intentá ajustar los filtros o buscar otro término.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginación */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    disabled={pageParam <= 1}
                    onClick={() => updateUrl({ page: String(pageParam - 1) })}
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Página {pageParam} de {pagination.totalPages}
                  </span>
                  <button
                    disabled={pageParam >= pagination.totalPages}
                    onClick={() => updateUrl({ page: String(pageParam + 1) })}
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
