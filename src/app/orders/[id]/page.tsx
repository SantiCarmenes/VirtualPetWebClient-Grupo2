import { notFound } from "next/navigation";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { OrderTrackingClient } from "./OrderTrackingClient";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = MOCK_ORDERS.find(o => o.id === id);

  if (!order) {
    notFound();
  }

  return <OrderTrackingClient order={order} />;
}
