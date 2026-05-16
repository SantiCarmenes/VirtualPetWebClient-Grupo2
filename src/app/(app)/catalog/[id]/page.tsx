import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/catalog.service";
import { ProductDetailClient } from "./ProductDetailClient";

/**
 * Server Component — recibe el slug del producto y hace fetch real.
 * La ruta sigue siendo /catalog/[id] pero el parámetro es el slug del producto.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    return <ProductDetailClient product={product} />;
  } catch {
    notFound();
  }
}
