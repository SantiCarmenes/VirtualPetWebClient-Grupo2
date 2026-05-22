"use client";

import Image from "next/image";
import { ShoppingBag, ShieldCheck, Check, Loader2, AlertCircle } from "lucide-react";
import type { CartItem, PaymentMethod, ShippingMethod } from "@/lib/types";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  CREDIT_CARD: "Tarjeta de crédito",
  DEBIT_CARD: "Tarjeta de débito",
  TRANSFER: "Transferencia bancaria",
};

interface Props {
  items: CartItem[];
  cartTotal: number;
  selectedShippingMethod: ShippingMethod | undefined;
  shippingCost: number;
  totalWithShipping: number;
  selectedPaymentCode: PaymentMethod | null;
  isSubmitting: boolean;
  methodsLoading: boolean;
  submitError: string | null;
}

export function CheckoutOrderSummary({
  items,
  cartTotal,
  selectedShippingMethod,
  shippingCost,
  totalWithShipping,
  selectedPaymentCode,
  isSubmitting,
  methodsLoading,
  submitError,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>

      {/* Lista de items */}
      <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto pr-1">
        {items.map((item) => {
          const imageUrl = item.variant?.images?.[0]?.url ?? item.variant?.product?.images?.[0]?.url ?? null;
          const name = item.variant?.product?.name ?? "Producto";
          const price = item.variant?.price ?? 0;
          const attrValues = item.variant?.variantAttributes
            ?.map((va) => va.attributeValue.value)
            .join(", ");

          return (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="w-14 h-14 rounded-xl bg-muted shrink-0 border border-border overflow-hidden relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold line-clamp-2">{name}</h4>
                {attrValues && (
                  <p className="text-xs text-muted-foreground">{attrValues}</p>
                )}
                <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                <p className="font-medium text-primary text-sm mt-0.5">
                  ${(price * item.quantity).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtotal + envío */}
      <div className="border-t border-border py-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${cartTotal.toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {selectedShippingMethod ? selectedShippingMethod.name : "Envío"}
          </span>
          <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}>
            {shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString("es-AR")}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="flex justify-between items-end">
          <span className="font-bold text-lg">Total</span>
          <span className="font-extrabold text-2xl text-primary">
            ${totalWithShipping.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {selectedPaymentCode && (
        <p className="text-xs text-muted-foreground text-center mb-4">
          Pago con {PAYMENT_LABELS[selectedPaymentCode]}
        </p>
      )}

      {/* Error */}
      {submitError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      {/* Botón confirmar */}
      <button
        id="checkout-confirm"
        type="submit"
        disabled={isSubmitting || items.length === 0 || methodsLoading}
        aria-disabled={isSubmitting}
        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Procesando...</>
        ) : (
          <><ShieldCheck className="w-5 h-5 mr-2" />Confirmar pedido</>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
        <Check className="w-3 h-3" />
        Transacción segura
      </p>
    </div>
  );
}
