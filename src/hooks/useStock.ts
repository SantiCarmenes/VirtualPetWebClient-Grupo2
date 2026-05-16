import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

interface StockItem {
  warehouseId: string;
  warehouseName?: string;
  quantityAvailable: number;
}

interface UseStockResult {
  stockItems: StockItem[];
  totalStock: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Obtiene el stock de una variante sumando todos los depósitos.
 * Endpoint: GET /stock/variants/:variantId
 *
 * Uso recomendado: página de detalle de producto (/catalog/[slug]).
 * NO usar en la ProductCard — el botón se habilita si hay variantes activas.
 */
export function useStock(variantId: string | null): UseStockResult {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (!variantId) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchApi(`/stock/variants/${variantId}`)
      .then((data: StockItem[]) => {
        if (!cancelled) setStockItems(Array.isArray(data) ? data : []);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error al cargar stock.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [variantId]);

  const totalStock = stockItems.reduce((sum, item) => sum + item.quantityAvailable, 0);

  return { stockItems, totalStock, isLoading, error };
}
