import { fetchApi } from '@/lib/api';
import type { Cart, CartItem } from '@/lib/types';

/**
 * Obtiene el carrito del usuario autenticado.
 */
export async function getCart(): Promise<Cart> {
  return fetchApi('/cart');
}

/**
 * Agrega un ítem al carrito.
 * Retorna el CartItem creado (con variant.product anidado).
 */
export async function addItem(
  variantId: string,
  quantity: number
): Promise<CartItem> {
  return fetchApi('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ variantId, quantity }),
  });
}

/**
 * Actualiza la cantidad de un ítem existente.
 */
export async function updateItem(
  itemId: string,
  quantity: number
): Promise<CartItem> {
  return fetchApi(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

/**
 * Elimina un ítem del carrito. Devuelve null (204 No Content).
 */
export async function removeItem(itemId: string): Promise<null> {
  return fetchApi(`/cart/items/${itemId}`, { method: 'DELETE' });
}

/**
 * Vacía el carrito completo. Devuelve null (204 No Content).
 */
export async function clearCart(): Promise<null> {
  return fetchApi('/cart', { method: 'DELETE' });
}
