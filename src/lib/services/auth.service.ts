import { fetchApi } from '@/lib/api';

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const data = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken);
  document.cookie = 'has_session=1; path=/; max-age=86400; SameSite=Lax';
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const data = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken);
  document.cookie = 'has_session=1; path=/; max-age=86400; SameSite=Lax';
  return data;
}

export async function logout(): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const refreshToken =
    typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  document.cookie = 'has_session=; path=/; max-age=0; SameSite=Lax';

  if (refreshToken) {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignorar errores de red
    }
  }
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return fetchApi('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  return fetchApi('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}
