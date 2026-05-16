import { useState, useEffect, useCallback } from "react";
import { getProducts, type GetProductsParams } from "@/lib/services/catalog.service";
import type { Product, Pagination } from "@/lib/types";

interface UseProductsResult {
  products: Product[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  fetchPage: (page: number) => void;
}

export function useProducts(params: GetProductsParams = {}): UseProductsResult {
  const [products, setProducts]     = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(params.page ?? 1);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProducts({ ...params, page });
      setProducts(result.data);
      setPagination(result.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar productos.");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, pagination, isLoading, error, fetchPage: setPage };
}
