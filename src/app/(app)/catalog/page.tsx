import { Suspense } from "react";
import { getCategories, getAttributes } from "@/lib/services/catalog.service";
import { CatalogClient } from "./CatalogClient";
import type { Category, Attribute } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  let categories: Category[] = [];
  let attributes: Attribute[] = [];

  try {
    [categories, attributes] = await Promise.all([
      getCategories(),
      getAttributes(true),
    ]);
  } catch {
    // Si falla → CatalogClient recibe arrays vacíos y sigue funcionando
  }

  return (
    <Suspense fallback={null}>
      <CatalogClient
        categories={categories}
        filterableAttributes={attributes}
      />
    </Suspense>
  );
}
