"use client";

import Link from "next/link";
import { Package, AlertCircle, ShoppingBag, ChevronRight, ChevronLeft } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import type { OrderStatus } from "@/lib/types";

const LIMIT = 5;

const STATUS_LABEL: Record<OrderStatus, string> = {
  RECEIVED:       "Pedido recibido",
  IN_PREPARATION: "En preparación",
  IN_TRANSIT:     "En camino",
  DELIVERED:      "Entregado",
  NOT_DELIVERED:  "Entrega fallida",
  CANCELLED:      "Cancelado",
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  RECEIVED:       "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_PREPARATION: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IN_TRANSIT:     "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  DELIVERED:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  NOT_DELIVERED:  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  CANCELLED:      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function ProfilePedidosTab() {
  const { orders, isLoading, error, page, totalPages, total, setPage, refetch } = useOrders(LIMIT);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-primary" />
        Mis Pedidos
        {!isLoading && total > 0 && (
          <span className="ml-auto text-sm font-normal text-muted-foreground">{total} en total</span>
        )}
      </h2>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: LIMIT }).map((_, n) => (
            <div key={n} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={refetch} className="text-sm text-primary hover:underline">
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-40" />
          <div>
            <p className="font-bold text-lg">Todavía no realizaste pedidos</p>
            <p className="text-muted-foreground text-sm mt-1">
              ¡Explorá el catálogo y encontrá lo que necesitás!
            </p>
          </div>
          <Link
            href="/catalog"
            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            Ir al catálogo
          </Link>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block border border-border bg-background/50 rounded-xl p-5 hover:border-primary/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block ${STATUS_BADGE_CLASS[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                    <p className="font-bold text-lg group-hover:text-primary transition-colors">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span className="font-bold text-lg">
                    ${order.total.toLocaleString("es-AR")}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">
                  {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                </p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-AR")}
                  </span>
                  <span className="text-primary font-medium group-hover:underline flex items-center">
                    Ver seguimiento <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
