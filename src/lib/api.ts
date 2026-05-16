const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // El access_token viaja como cookie HttpOnly (se envía automáticamente con credentials: 'include')
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Si da 401 e intentamos pegar a un endpoint que NO es el refresh ni login, renovamos el token
  if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include', // el nuevo access_token llega como cookie
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('refreshToken', refreshData.refreshToken);

          // Reintentar la petición original (ahora con la nueva cookie seteada)
          response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
          });
        } else {
          localStorage.removeItem('refreshToken');
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      } catch {
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    } else {
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  }

  if (!response.ok) {
    let errorMessage = 'Error en la solicitud';
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
      }
    } catch {
      // Si no es JSON, mantenemos el mensaje default
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // ignorar errores de red — igual limpiamos localmente
  } finally {
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}
