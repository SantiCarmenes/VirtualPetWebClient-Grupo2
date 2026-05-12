import { ProductCard } from "@/components/ProductCard";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Filter, ChevronDown } from "lucide-react";

export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Catálogo de Productos</h1>
          <p className="text-muted-foreground">Mostrando todos los productos disponibles</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-background border border-border text-foreground px-4 py-2 pr-10 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option>Destacados</option>
              <option>Menor Precio</option>
              <option>Mayor Precio</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
          <button className="md:hidden p-2 rounded-full border border-border text-foreground">
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
                  <input type="checkbox" className="w-4 h-4 text-primary rounded border-border focus:ring-primary cursor-pointer accent-primary" defaultChecked />
                  <span className="text-foreground group-hover:text-primary transition-colors">Todos</span>
                </label>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-primary rounded border-border focus:ring-primary cursor-pointer accent-primary" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{cat.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">Rango de Precio</h3>
            <div className="space-y-4">
              <input type="range" min="0" max="100000" className="w-full accent-primary" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>$0</span>
                <span>$100.000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
