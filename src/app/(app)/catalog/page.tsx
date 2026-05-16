import { getCategories, getAttributes } from "@/lib/services/catalog.service";
import { CatalogClient } from "./CatalogClient";
import type { Category, Attribute } from "@/lib/types";

/**
 * Server Component — fetches categorías y atributos filtrables.
 * Los pasa como props a CatalogClient (Client Component).
 */
export default async function CatalogPage() {
  let categories: Category[] = [];
  let attributes: Attribute[] = [];

  try {
    [categories, attributes] = await Promise.all([
      getCategories(),
      getAttributes(true), // solo filtrables
    ]);
  } catch {
    // Si falla → CatalogClient recibe arrays vacíos y sigue funcionando
  }

  return (
    <CatalogClient
      categories={categories}
      filterableAttributes={attributes}
    />
  );
}
