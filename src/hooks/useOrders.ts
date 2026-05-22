import { useState, useEffect } from "react";
import { getMyOrders } from "@/lib/services/order.service";
import type { Order } from "@/lib/types";

interface UseOrdersResult {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useOrders(limit = 5): UseOrdersResult {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [tick, setTick]             = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getMyOrders(page, limit)
      .then((res) => {
        if (!cancelled) {
          setOrders(res.data);
          setTotalPages(res.totalPages);
          setTotal(res.total);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Error al cargar pedidos.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [page, limit, tick]);

  return {
    orders, isLoading, error,
    page, totalPages, total,
    setPage,
    refetch: () => setTick((t) => t + 1),
  };
}
