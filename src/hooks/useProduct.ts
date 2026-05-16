import { useState, useEffect } from "react";
import { getProductBySlug } from "@/lib/services/catalog.service";
import type { Product } from "@/lib/types";

interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct]   = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getProductBySlug(slug)
      .then((data) => { if (!cancelled) setProduct(data); })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error al cargar el producto.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  return { product, isLoading, error };
}
