import { useState, useEffect } from "react";
import { getMyOrders } from "@/lib/services/order.service";
import type { Order } from "@/lib/types";

interface UseOrdersResult {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders]       = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [tick, setTick]           = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getMyOrders()
      .then((data) => { if (!cancelled) setOrders(data); })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error al cargar pedidos.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [tick]);

  return { orders, isLoading, error, refetch: () => setTick((t) => t + 1) };
}
