import { fetchApi } from '@/lib/api';
import type {
  Order,
  ShippingAddress,
  PaymentMethod,
  CheckoutResponse,
} from '@/lib/types';

export interface CreateOrderParams {
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  shippingMethodId?: string;
  paymentMethodCode?: PaymentMethod;
}

/**
 * Crea una nueva orden a partir del carrito activo.
 * Retorna { order, payment, paymentUrl? }.
 * Si paymentUrl está presente → redirigir al gateway (futuro).
 */
export async function createOrder(
  params: CreateOrderParams
): Promise<CheckoutResponse> {
  return fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Obtiene todas las órdenes del usuario autenticado.
 */
export async function getMyOrders(): Promise<Order[]> {
  return fetchApi('/orders');
}

/**
 * Obtiene el detalle de una orden por su ID.
 */
export async function getOrderById(id: string): Promise<Order> {
  return fetchApi(`/orders/${id}`);
}
