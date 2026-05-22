"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import type { Order } from "@/lib/types";
import { OrderStatusStepper } from "./OrderStatusStepper";
import { OrderItemsTable } from "./OrderItemsTable";
import { OrderSideColumn } from "./OrderSideColumn";

export function OrderTrackingClient({
  order,
  backHref = "/profile",
  backLabel = "Volver a mis pedidos",
}: {
  order: Order;
  backHref?: string;
  backLabel?: string;
}) {
  const payment  = order.payment  ?? null;
  const shipment = order.shipment ?? null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Seguimiento de Pedido</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-mono font-medium bg-muted px-2 py-0.5 rounded text-foreground">
              #{order.id.substring(0, 8).toUpperCase()}
            </span>
            <span>•</span>
            <span>{new Date(order.createdAt).toLocaleDateString("es-AR")}</span>
          </p>
        </div>

        {order.status === "IN_TRANSIT" && shipment?.estimatedDelivery && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-primary/20">
            <Clock className="w-4 h-4" />
            Llega el {new Date(shipment.estimatedDelivery).toLocaleDateString("es-AR")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <OrderStatusStepper order={order} />
          <OrderItemsTable order={order} />
        </div>
        <OrderSideColumn
          order={order}
          payment={payment}
          shipment={shipment}
        />
      </div>
    </div>
  );
}
