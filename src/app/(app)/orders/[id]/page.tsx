import { getOrderById } from "@/lib/services/order.service";
import { OrderTrackingClient } from "./OrderTrackingClient";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const order = await getOrderById(id);
    return <OrderTrackingClient order={order} />;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";

    // 403 — la orden no le pertenece al usuario
    if (msg.includes("403") || msg.toLowerCase().includes("forbidden")) {
      return (
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <p className="text-4xl mb-4">🚫</p>
          <h1 className="text-2xl font-extrabold mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground">Esta orden no te pertenece.</p>
        </div>
      );
    }

    // 404 — orden no encontrada
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <p className="text-4xl mb-4">📦</p>
        <h1 className="text-2xl font-extrabold mb-2">Orden no encontrada</h1>
        <p className="text-muted-foreground">
          No encontramos una orden con el ID <span className="font-mono">{id}</span>.
        </p>
      </div>
    );
  }
}
