import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductDetailClient } from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
