import { fetchApi } from '@/lib/api';
import type { ShippingMethod, Shipment } from '@/lib/types';

/**
 * Obtiene los métodos de envío disponibles.
 * Se llama al montar el checkout.
 */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  return fetchApi('/shipping/methods');
}

/**
 * Obtiene la información de envío de una orden específica.
 * Se llama en OrderTrackingClient para mostrar estado y tracking.
 */
export async function getShipmentByOrder(orderId: string): Promise<Shipment> {
  return fetchApi(`/shipping/orders/${orderId}`);
}
