import { fetchApi } from '@/lib/api';
import type { Address } from '@/lib/types';

export interface AddressPayload {
  street: string;
  city: string;
  province: string;
  postalCode?: string;
  isDefault?: boolean;
}

export function getAddresses(): Promise<Address[]> {
  return fetchApi('/users/me/addresses');
}

export function createAddress(data: AddressPayload): Promise<Address> {
  return fetchApi('/users/me/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAddress(id: string, data: Partial<AddressPayload>): Promise<Address> {
  return fetchApi(`/users/me/addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteAddress(id: string): Promise<void> {
  return fetchApi(`/users/me/addresses/${id}`, { method: 'DELETE' });
}
