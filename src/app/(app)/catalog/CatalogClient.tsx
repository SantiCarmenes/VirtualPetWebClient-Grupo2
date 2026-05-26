"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import type { CategoryWithAttributes, Attribute } from "@/lib/types";
import { CatalogSidebar } from "./CatalogSidebar";
import { CatalogHeader } from "./CatalogHeader";
import { CatalogGrid } from "./CatalogGrid";

interface Props {
  categories: CategoryWithAttributes[];
}

export function CatalogClient({ categories }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const categoriesRef = useRef<CategoryWithAttributes[]>(categories);
  if (categories.length > 0) categoriesRef.current = categories;
  const effectiveCategories = categoriesRef.current;

  const categoriesParam   = searchParams.get("categories")        ?? "";
  const searchQuery       = searchParams.get("search")            ?? "";
  const sortParam         = (searchParams.get("sort") ?? "destacados") as "destacados" | "menor" | "mayor";
  const pageParam         = Number(searchParams.get("page")       ?? "1");
  const attributeIdsParam = searchParams.get("attributeValueIds") ?? "";
  const urlMinPrice       = searchParams.get("minPrice")          ?? "";
  const urlMaxPrice       = searchParams.get("maxPrice")          ?? "";

  const selectedCategorySlugs = categoriesParam   ? categoriesParam.split(",")   : [];
  const selectedAttributeIds  = attributeIdsParam ? attributeIdsParam.split(",") : [];

  const categoryIds = selectedCategorySlugs
    .map((slug) => effectiveCategories.find((c) => c.slug === slug)?.id)
    .filter(Boolean)
    .join(",");

  const { products, pagination, isLoading } = useProducts({
    categoryIds:       categoryIds    || undefined,
    search:            searchQuery    || undefined,
    sort:              sortParam !== "destacados" ? sortParam : undefined,
    page:              pageParam,
    limit:             8,
    attributeValueIds: attributeIdsParam || undefined,
    minPrice:          urlMinPrice ? Number(urlMinPrice) : undefined,
    maxPrice:          urlMaxPrice ? Number(urlMaxPrice) : undefined,
  });

  const [minPrice, setMinPrice]           = useState(urlMinPrice);
  const [maxPrice, setMaxPrice]           = useState(urlMaxPrice);
  const [expandedAttrs, setExpandedAttrs] = useState<Record<string, boolean>>(
    () => ({ "tipo-animal": true })
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sin categoría: solo "tipo-animal" (presente en todas las categorías).
  // Con categoría(s): todos los atributos de esa categoría (incluye tipo-animal).
  const visibleAttributes = useMemo(() => {
    const attrMap = new Map<string, Attribute>();

    if (selectedCategorySlugs.length === 0) {
      // Mostrar solo tipo-animal (buscarlo en cualquier categoría)
      for (const cat of effectiveCategories) {
        for (const attr of cat.attributes) {
          if (attr.slug === "tipo-animal") attrMap.set(attr.id, attr);
        }
      }
    } else {
      for (const slug of selectedCategorySlugs) {
        const cat = effectiveCategories.find((c) => c.slug === slug);
        for (const attr of (cat?.attributes ?? [])) {
          attrMap.set(attr.id, attr);
        }
      }
    }

    return Array.from(attrMap.values());
  }, [effectiveCategories, selectedCategorySlugs]);

  useEffect(() => {
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
  }, [urlMinPrice, urlMaxPrice]);

  // Limpiar de la URL los atributos seleccionados que ya no son visibles
  // (ej: tenía color=rojo activo, cambia a "Alimentos" que no tiene Color)
  useEffect(() => {
    if (selectedAttributeIds.length === 0) return;
    const validIds = new Set(visibleAttributes.flatMap((a) => a.values.map((v) => v.id)));
    const stillValid = selectedAttributeIds.filter((id) => validIds.has(id));
    if (stillValid.length !== selectedAttributeIds.length) {
      updateUrl({ attributeValueIds: stillValid.length ? stillValid.join(",") : null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleAttributes]);

  const updateUrl = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(overrides).forEach(([k, v]) => {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      });
      if (!("page" in overrides)) params.delete("page");
      router.replace(`/catalog?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, router]
  );

  const applyPrice = useCallback(() => {
    updateUrl({ minPrice: minPrice || null, maxPrice: maxPrice || null });
  }, [minPrice, maxPrice, updateUrl]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.replace("/catalog");
  };

  const hasActiveFilters = !!(categoriesParam || searchQuery || attributeIdsParam || urlMinPrice || urlMaxPrice);
  const totalProducts    = pagination?.total ?? products.length;

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <CatalogHeader
        searchQuery={searchQuery}
        selectedCategorySlugs={selectedCategorySlugs}
        categories={effectiveCategories}
        totalProducts={totalProducts}
        isLoading={isLoading}
        sortParam={sortParam}
        hasActiveFilters={hasActiveFilters}
        onSortChange={(s) => updateUrl({ sort: s })}
        onToggleMobileFilter={() => setIsMobileFilterOpen((o) => !o)}
      />

      <div className="flex flex-col md:flex-row gap-8">
        <CatalogSidebar
          categories={effectiveCategories}
          filterableAttributes={visibleAttributes}
          selectedCategorySlugs={selectedCategorySlugs}
          selectedAttributeIds={selectedAttributeIds}
          expandedAttrs={expandedAttrs}
          minPrice={minPrice}
          maxPrice={maxPrice}
          hasActiveFilters={hasActiveFilters}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          onToggleCategory={(slug) => {
            const next = selectedCategorySlugs.includes(slug)
              ? selectedCategorySlugs.filter((s) => s !== slug)
              : [...selectedCategorySlugs, slug];
            updateUrl({ categories: next.length ? next.join(",") : null });
          }}
          onClearCategories={() => updateUrl({ categories: null })}
          onToggleAttribute={(id) => {
            const next = selectedAttributeIds.includes(id)
              ? selectedAttributeIds.filter((i) => i !== id)
              : [...selectedAttributeIds, id];
            updateUrl({ attributeValueIds: next.length ? next.join(",") : null });
          }}
          onToggleAttrGroup={(slug) =>
            setExpandedAttrs((prev) => ({ ...prev, [slug]: !prev[slug] }))
          }
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onApplyPrice={applyPrice}
          onClearFilters={clearFilters}
        />

        <div className="flex-1 min-w-0">
          <CatalogGrid
            products={products}
            isLoading={isLoading}
            pagination={pagination}
            pageParam={pageParam}
            onPage={(p) => updateUrl({ page: String(p) })}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
}
