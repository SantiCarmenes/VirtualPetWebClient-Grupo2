import { fetchApi } from '@/lib/api';

/**
 * Registra un nuevo usuario.
 * Guarda el refreshToken en localStorage.
 */
export async function register(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string
): Promise<{ refreshToken: string }> {
  const data = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, username, email, password }),
  });
  if (data?.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
}

/**
 * Inicia sesión con email y contraseña.
 * Guarda el refreshToken en localStorage.
 */
export async function login(
  email: string,
  password: string
): Promise<{ refreshToken: string }> {
  const data = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data;
}

/**
 * Cierra la sesión del usuario.
 * Llama a POST /auth/logout con el refreshToken y limpia el localStorage.
 * Re-exportada desde api.ts para centralizar la lógica acá.
 */
export async function logout(): Promise<void> {
  const refreshToken =
    typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  try {
    await fetchApi('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Ignorar errores de red — igual limpiamos localmente
  } finally {
    localStorage.removeItem('refreshToken');
  }
}

/**
 * Solicita el email de recuperación de contraseña.
 */
export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  return fetchApi('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Resetea la contraseña con el token recibido por email.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  return fetchApi('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
