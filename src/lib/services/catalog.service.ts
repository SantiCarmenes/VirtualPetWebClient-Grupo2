import { fetchApi } from '@/lib/api';
import type { Product, ProductsResponse, Category, Attribute } from '@/lib/types';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  /** UUID de la categoría (no el slug) */
  categoryId?: string;
  search?: string;
  /** UUIDs de attributeValues separados por coma */
  attributeValueIds?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'menor' | 'mayor' | 'destacados';
}

/**
 * Obtiene el listado paginado de productos con filtros opcionales.
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  if (params.page)               query.set('page',              String(params.page));
  if (params.limit)              query.set('limit',             String(params.limit));
  if (params.categoryId)         query.set('categoryId',        params.categoryId);
  if (params.search)             query.set('search',            params.search);
  if (params.attributeValueIds)  query.set('attributeValueIds', params.attributeValueIds);
  if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
  if (params.sort)               query.set('sort',              params.sort);

  const qs = query.toString();
  return fetchApi(`/catalog/products${qs ? `?${qs}` : ''}`);
}

/**
 * Obtiene un producto por su slug.
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  return fetchApi(`/catalog/products/${slug}`);
}

/**
 * Obtiene todas las categorías.
 */
export async function getCategories(): Promise<Category[]> {
  return fetchApi('/catalog/categories');
}

/**
 * Obtiene atributos. Si filterable=true, solo los marcados como filtrables.
 */
export async function getAttributes(filterable?: boolean): Promise<Attribute[]> {
  const qs = filterable !== undefined ? `?filterable=${filterable}` : '';
  return fetchApi(`/catalog/attributes${qs}`);
}
