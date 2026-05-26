import { fetchApi } from '@/lib/api';
import type {
  Order,
  OrdersResponse,
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
  acceptPriceChanges?: boolean;
}

export interface GuestCartItem {
  variantId: string;
  quantity: number;
}

export interface GuestCheckoutParams {
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  shippingMethodId?: string;
  paymentMethodCode: PaymentMethod;
  items: GuestCartItem[];
}

/**
 * Crea una orden para usuario autenticado (lee el carrito desde el servidor).
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
 * Crea una orden para invitado (sin sesión). Envía los items en el body.
 */
export async function guestCheckout(
  params: GuestCheckoutParams
): Promise<CheckoutResponse> {
  return fetchApi('/orders/guest', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Obtiene las órdenes del usuario autenticado (paginadas).
 */
export async function getMyOrders(page = 1, limit = 5): Promise<OrdersResponse> {
  return fetchApi(`/orders?page=${page}&limit=${limit}`);
}

/**
 * Obtiene todas las órdenes (backoffice, paginadas).
 */
export async function getAllOrders(page = 1, limit = 20): Promise<OrdersResponse> {
  return fetchApi(`/orders/all?page=${page}&limit=${limit}`);
}

/**
 * Obtiene el detalle de una orden por su ID.
 */
export async function getOrderById(id: string): Promise<Order> {
  return fetchApi(`/orders/${id}`);
}

/**
 * Obtiene el seguimiento de una orden sin autenticación (endpoint público).
 */
export async function trackOrder(id: string): Promise<Order> {
  return fetchApi(`/orders/${id}/track`, { skipAuth: true });
}
