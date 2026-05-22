import { useState, useEffect } from "react";
import { getProducts, type GetProductsParams } from "@/lib/services/catalog.service";
import type { Product, Pagination } from "@/lib/types";

interface UseProductsResult {
  products: Product[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

export function useProducts(params: GetProductsParams = {}): UseProductsResult {
  const [products, setProducts]     = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getProducts(params)
      .then((result) => {
        if (cancelled) return;
        if (!result) { setProducts([]); setPagination(null); return; }
        setProducts(result.data);
        setPagination({ total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar productos.");
          setProducts([]);
          setPagination(null);
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { products, pagination, isLoading, error };
}
