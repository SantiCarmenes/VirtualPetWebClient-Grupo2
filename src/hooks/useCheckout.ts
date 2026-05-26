import { useState } from "react";
import { useRouter } from "next/navigation";
import * as orderService from "@/lib/services/order.service";
import { PriceConflictError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { ShippingAddress, PaymentMethod, Order, PriceChange } from "@/lib/types";

export interface AuthCheckoutParams {
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  shippingMethodId?: string;
  paymentMethodCode: PaymentMethod;
  acceptPriceChanges?: boolean;
}

export interface GuestCheckoutParams {
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  shippingMethodId?: string;
  paymentMethodCode: PaymentMethod;
  items: { variantId: string; quantity: number }[];
}

interface UseCheckoutReturn {
  submitOrder: (params: AuthCheckoutParams) => Promise<void>;
  submitGuestOrder: (params: GuestCheckoutParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  confirmedOrder: Order | null;
  priceChanges: PriceChange[] | null;
  confirmPriceChanges: () => Promise<void>;
  dismissPriceChanges: () => void;
}

export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const { clearCart, syncCart } = useCart();
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [priceChanges, setPriceChanges]     = useState<PriceChange[] | null>(null);
  const [pendingParams, setPendingParams]   = useState<AuthCheckoutParams | null>(null);

  const handleCash = async (order: Order, isGuest: boolean) => {
    // Setear confirmedOrder ANTES de clearCart evita la race condition:
    // el useEffect del checkout vería items=[] && !confirmedOrder y redirigiría a /catalog.
    setConfirmedOrder(order);
    await clearCart();
    if (!isGuest) router.replace(`/orders/${order.id}`);
  };

  const submitOrder = async (params: AuthCheckoutParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { order } = await orderService.createOrder(params);
      if (params.paymentMethodCode !== "CASH") {
        setConfirmedOrder(order);
        await syncCart();
        router.replace(`/payment-gateway?orderId=${order.id}`);
      } else {
        await handleCash(order, false);
      }
    } catch (err: unknown) {
      if (err instanceof PriceConflictError) {
        setPriceChanges(err.priceChanges);
        setPendingParams(params);
      } else {
        setError(err instanceof Error ? err.message : "Error al procesar el pedido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPriceChanges = async () => {
    if (!pendingParams) return;
    const params = pendingParams;
    setPendingParams(null);
    setPriceChanges(null);
    await submitOrder({ ...params, acceptPriceChanges: true });
  };

  const dismissPriceChanges = () => {
    setPriceChanges(null);
    setPendingParams(null);
  };

  const submitGuestOrder = async (params: GuestCheckoutParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { order } = await orderService.guestCheckout(params);
      if (params.paymentMethodCode !== "CASH") {
        setConfirmedOrder(order);
        await syncCart();
        router.replace(`/payment-gateway?orderId=${order.id}`);
      } else {
        await handleCash(order, true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al procesar el pedido.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitOrder,
    submitGuestOrder,
    isLoading,
    error,
    confirmedOrder,
    priceChanges,
    confirmPriceChanges,
    dismissPriceChanges,
  };
}
