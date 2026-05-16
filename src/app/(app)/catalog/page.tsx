"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Filter, ChevronDown, SearchX } from "lucide-react";

export default function CatalogPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"destacados" | "menor" | "mayor">("destacados");

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Filter by min price
    if (minPrice !== "") {
      result = result.filter(product => product.price >= minPrice);
    }

    // Filter by max price
    if (maxPrice !== "") {
      result = result.filter(product => product.price <= maxPrice);
    }

    // Sort
    if (sortBy === "menor") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "mayor") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-background border border-border text-foreground px-4 py-2 pr-10 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
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
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Categorías</h3>
            <ul className="space-y-3">
              <li>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.length === 0}
                    onChange={() => setSelectedCategories([])}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary cursor-pointer accent-primary" 
                  />
                  <span className={`transition-colors ${selectedCategories.length === 0 ? 'text-primary font-medium' : 'text-foreground group-hover:text-primary'}`}>
                    Todos
                  </span>
                </label>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="w-4 h-4 text-primary rounded border-border focus:ring-primary cursor-pointer accent-primary" 
                    />
                    <span className={`transition-colors ${selectedCategories.includes(cat.id) ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {cat.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Rango de Precio</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
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
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
            </div>
            {(minPrice !== "" || maxPrice !== "") && (
              <button 
                onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                className="text-xs text-primary font-medium hover:underline mt-3"
              >
                Limpiar precio
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground max-w-md">
                Intenta ajustar los filtros de categoría o rango de precios para ver más resultados.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
