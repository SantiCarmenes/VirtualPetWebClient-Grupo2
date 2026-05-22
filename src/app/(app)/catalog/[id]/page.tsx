import { notFound } from "next/navigation";
import { getProductBySlug, getStockByVariantId } from "@/lib/services/catalog.service";
import { ProductDetailClient } from "./ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    const activeVariants = product.variants.filter((v) => v.active);
    const stockEntries = await Promise.all(
      activeVariants.map((v) =>
        getStockByVariantId(v.id).then((qty) => [v.id, qty] as [string, number])
      )
    );
    const stockMap = Object.fromEntries(stockEntries);

    return <ProductDetailClient product={product} stockMap={stockMap} />;
  } catch {
    notFound();
  }
}
