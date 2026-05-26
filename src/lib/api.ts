import type { PriceChange } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class PriceConflictError extends Error {
  priceChanges: PriceChange[];
  constructor(priceChanges: PriceChange[]) {
    super('Algunos precios cambiaron desde que agregaste los productos al carrito.');
    this.name = 'PriceConflictError';
    this.priceChanges = priceChanges;
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function storeToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
}

let refreshingPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('refreshToken', data.refreshToken);
      storeToken(data.accessToken ?? null);
      return true;
    }
    localStorage.removeItem('refreshToken');
    storeToken(null);
    return false;
  } catch {
    localStorage.removeItem('refreshToken');
    storeToken(null);
    return false;
  }
}

export async function fetchApi(
  endpoint: string,
  options: RequestInit & { skipAuth?: boolean } = {}
) {
  const { skipAuth, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  headers.set('Content-Type', 'application/json');

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!skipAuth && response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
    if (!refreshingPromise) {
      refreshingPromise = refreshAccessToken().finally(() => { refreshingPromise = null; });
    }
    const refreshed = await refreshingPromise;

    if (refreshed) {
      const newToken = getStoredToken();
      if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(`${API_URL}${endpoint}`, {
        ...requestOptions,
        headers,
      });
    } else {
      throw new Error('Sesión expirada. Iniciá sesión nuevamente.');
    }
  }

  if (!response.ok) {
    let errorData: Record<string, unknown> = {};
    try {
      errorData = await response.json();
    } catch {
      // sin JSON
    }

    if (response.status === 409 && Array.isArray(errorData.priceChanges)) {
      throw new PriceConflictError(errorData.priceChanges as PriceChange[]);
    }

    let errorMessage = 'Ocurrió un error inesperado. Intentá de nuevo.';
    if (errorData.message) {
      errorMessage = Array.isArray(errorData.message)
        ? (errorData.message as string[]).join(', ')
        : String(errorData.message);
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;

  return response.json();
}
