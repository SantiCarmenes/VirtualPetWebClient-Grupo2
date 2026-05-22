import { fetchApi } from '@/lib/api';
import type { PaymentMethodOption, Payment } from '@/lib/types';

/**
 * Obtiene los métodos de pago disponibles.
 * Se llama al montar el checkout.
 */
export async function getPaymentMethods(): Promise<PaymentMethodOption[]> {
  return fetchApi('/payment/methods');
}

/**
 * Obtiene la información de pago de una orden específica.
 * Se llama en OrderTrackingClient para mostrar badge de pago.
 */
export async function getPaymentByOrder(orderId: string): Promise<Payment> {
  return fetchApi(`/payment/orders/${orderId}`);
}

export async function simulateWebhook(
  orderId: string,
  result: 'approved' | 'rejected',
): Promise<void> {
  return fetchApi(`/orders/${orderId}/payment-webhook`, {
    method: 'POST',
    body: JSON.stringify({ result }),
    skipAuth: true,
  });
}
