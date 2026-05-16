import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/services/order.service";
import { useCart } from "@/context/CartContext";
import type { ShippingAddress, PaymentMethod } from "@/lib/types";

interface SubmitOrderParams {
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  shippingMethodId?: string;
  paymentMethodCode?: PaymentMethod;
}

interface UseCheckoutResult {
  submitOrder: (params: SubmitOrderParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useCheckout(): UseCheckoutResult {
  const router = useRouter();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const submitOrder = async (params: SubmitOrderParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createOrder(params);

      // Si el gateway devuelve paymentUrl → redirigir (futuro)
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      await clearCart();
      router.push(`/orders/${response.order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al procesar el pedido.");
    } finally {
      setIsLoading(false);
    }
  };

  return { submitOrder, isLoading, error };
}
