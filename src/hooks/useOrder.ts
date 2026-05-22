import { useState, useEffect } from "react";
import { getOrderById, trackOrder } from "@/lib/services/order.service";
import type { Order } from "@/lib/types";

interface UseOrderResult {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
}

export function useOrder(id: string, { isPublic = false } = {}): UseOrderResult {
  const [order, setOrder]         = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    const fetcher = isPublic ? trackOrder : getOrderById;
    fetcher(id)
      .then((data) => { if (!cancelled) setOrder(data); })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error al cargar la orden.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [id, isPublic]);

  return { order, isLoading, error };
}
