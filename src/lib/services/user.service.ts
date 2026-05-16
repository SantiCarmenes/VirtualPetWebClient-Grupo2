import { fetchApi } from '@/lib/api';
import type { User } from '@/lib/types';

/**
 * Obtiene el perfil del usuario autenticado.
 * Requiere cookie de access_token válida.
 */
export async function getMe(): Promise<User> {
  return fetchApi('/users/me');
}

/**
 * Actualiza los datos del usuario autenticado.
 */
export async function updateMe(data: {
  firstName?: string;
  lastName?: string;
  username?: string;
}): Promise<User> {
  return fetchApi('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
