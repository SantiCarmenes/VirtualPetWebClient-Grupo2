import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { Category, Attribute } from "@/lib/types";

interface Props {
  categories: Category[];
  filterableAttributes: Attribute[];
  selectedCategorySlugs: string[];
  selectedAttributeIds: string[];
  expandedAttrs: Record<string, boolean>;
  minPrice: string;
  maxPrice: string;
  hasActiveFilters: boolean;
  isOpen: boolean;
  onClose: () => void;
  onToggleCategory: (slug: string) => void;
  onClearCategories: () => void;
  onToggleAttribute: (id: string) => void;
  onToggleAttrGroup: (slug: string) => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onMinPriceBlur: () => void;
  onMaxPriceBlur: () => void;
  onClearFilters: () => void;
}

function AttrGroup({
  attr,
  label,
  isOpen,
  selectedAttributeIds,
  onToggle,
  onToggleAttribute,
}: {
  attr: Attribute;
  label?: string;
  isOpen: boolean;
  selectedAttributeIds: string[];
  onToggle: () => void;
  onToggleAttribute: (id: string) => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between font-bold text-lg pb-2 border-b border-border hover:text-primary transition-colors"
      >
        {label ?? attr.name}
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <ul className="space-y-3 mt-4">
          {attr.values.map((val) => (
            <li key={val.id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedAttributeIds.includes(val.id)}
                  onChange={() => onToggleAttribute(val.id)}
                  className="w-4 h-4 accent-primary rounded border-border cursor-pointer"
                />
                <span className={`transition-colors text-sm ${
                  selectedAttributeIds.includes(val.id)
                    ? "text-primary font-medium"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {val.value}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SidebarContent({
  categories,
  filterableAttributes,
  selectedCategorySlugs,
  selectedAttributeIds,
  expandedAttrs,
  minPrice,
  maxPrice,
  hasActiveFilters,
  onToggleCategory,
  onClearCategories,
  onToggleAttribute,
  onToggleAttrGroup,
  onMinPriceChange,
  onMaxPriceChange,
  onMinPriceBlur,
  onMaxPriceBlur,
  onClearFilters,
}: Omit<Props, "isOpen" | "onClose">) {
  // Tipo de animal shown second (after categories), rest in original order
  const tipoAnimal = filterableAttributes.find((a) => a.slug === "tipo-animal");
  const otherAttrs = filterableAttributes.filter((a) => a.slug !== "tipo-animal");

  return (
    <div className="space-y-8">
      {/* 1. Categorías */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Categoría</h3>
          <ul className="space-y-3">
            <li>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategorySlugs.length === 0}
                  onChange={onClearCategories}
                  className="w-4 h-4 accent-primary rounded border-border cursor-pointer"
                />
                <span className={`transition-colors ${
                  selectedCategorySlugs.length === 0
                    ? "text-primary font-medium"
                    : "text-foreground group-hover:text-primary"
                }`}>
                  Todos
                </span>
              </label>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategorySlugs.includes(cat.slug)}
                    onChange={() => onToggleCategory(cat.slug)}
                    className="w-4 h-4 accent-primary rounded border-border cursor-pointer"
                  />
                  <span className={`transition-colors ${
                    selectedCategorySlugs.includes(cat.slug)
                      ? "text-primary font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {cat.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. Mascota (tipo-animal) — always second */}
      {tipoAnimal && (
        <AttrGroup
          attr={tipoAnimal}
          label="Mascota"
          isOpen={!!expandedAttrs[tipoAnimal.slug]}
          selectedAttributeIds={selectedAttributeIds}
          onToggle={() => onToggleAttrGroup(tipoAnimal.slug)}
          onToggleAttribute={onToggleAttribute}
        />
      )}

      {/* 3. Otros atributos filtrables */}
      {otherAttrs.map((attr) => (
        <AttrGroup
          key={attr.id}
          attr={attr}
          isOpen={!!expandedAttrs[attr.slug]}
          selectedAttributeIds={selectedAttributeIds}
          onToggle={() => onToggleAttrGroup(attr.slug)}
          onToggleAttribute={onToggleAttribute}
        />
      ))}

      {/* 4. Rango de precio */}
      <div>
        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Precio</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              onBlur={onMinPriceBlur}
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>
          <span className="text-muted-foreground font-medium">–</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              onBlur={onMaxPriceBlur}
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
        >
          <X className="w-4 h-4" />
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

export function CatalogSidebar({ isOpen, onClose, ...rest }: Props) {
  const contentProps = rest;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile overlay drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          {/* Drawer panel */}
          <div className="relative w-80 max-w-[85vw] bg-background h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
              <h2 className="font-bold text-xl">Filtros</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6 flex-1">
              <SidebarContent {...contentProps} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
