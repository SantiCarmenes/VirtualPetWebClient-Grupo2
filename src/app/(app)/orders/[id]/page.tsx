"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { OrderTrackingClient } from "./OrderTrackingClient";

export default function OrderPage() {
  const params  = useParams();
  const orderId = params?.id as string;
  const { order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <p className="text-4xl mb-4">⏳</p>
        <h1 className="text-2xl font-extrabold mb-2">Cargando pedido...</h1>
      </div>
    );
  }

  if (error) {
    const msgLower = error.toLowerCase();
    if (msgLower.includes("403") || msgLower.includes("forbidden")) {
      return (
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <p className="text-4xl mb-4">🚫</p>
          <h1 className="text-2xl font-extrabold mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground">Esta orden no te pertenece.</p>
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <p className="text-4xl mb-4">📦</p>
        <h1 className="text-2xl font-extrabold mb-2">Orden no encontrada</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <p className="text-4xl mb-4">📦</p>
        <h1 className="text-2xl font-extrabold mb-2">Orden no encontrada</h1>
      </div>
    );
  }

  return <OrderTrackingClient order={order} />;
}
