import { fetchApi } from '@/lib/api';
import type { Product, ProductsResponse, Category, Attribute } from '@/lib/types';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryIds?: string;
  search?: string;
  attributeValueIds?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'menor' | 'mayor' | 'destacados';
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  if (params.page)  query.set('page',   String(params.page));
  if (params.limit) query.set('limit',  String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
  if (params.sort)  query.set('sort',   params.sort);

  // Mandar IDs como params repetidos (?categoryIds=a&categoryIds=b) en vez de
  // coma-separados, para que Express los parsee como array nativo y no depender
  // del @Transform de class-transformer en el backend.
  if (params.categoryIds) {
    params.categoryIds.split(',').forEach((id) => query.append('categoryIds', id));
  }
  if (params.attributeValueIds) {
    params.attributeValueIds.split(',').forEach((id) => query.append('attributeValueIds', id));
  }

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

/**
 * Devuelve el stock disponible de una variante. Retorna 0 si falla.
 */
export async function getStockByVariantId(variantId: string): Promise<number> {
  try {
    const data = await fetchApi(`/stock/variants/${variantId}`);
    return (data?.quantityAvailable as number) ?? 0;
  } catch {
    return 0;
  }
}
