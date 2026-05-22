import { Suspense } from "react";
import { getCategoriesWithAttributes } from "@/lib/services/catalog.service";
import { CatalogClient } from "./CatalogClient";
import type { CategoryWithAttributes } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  let categories: CategoryWithAttributes[] = [];

  try {
    categories = await getCategoriesWithAttributes();
  } catch {
    // Si falla → CatalogClient recibe array vacío y sigue funcionando
  }

  return (
    <Suspense fallback={null}>
      <CatalogClient categories={categories} />
    </Suspense>
  );
}
