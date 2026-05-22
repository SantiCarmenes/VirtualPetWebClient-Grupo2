"use client";

import { Wallet } from "lucide-react";
import type { PaymentMethod, PaymentMethodOption } from "@/lib/types";

interface Props {
  methods: PaymentMethodOption[];
  loading: boolean;
  selectedCode: PaymentMethod | null;
  onSelect: (code: PaymentMethod) => void;
}

export function CheckoutPaymentMethods({ methods, loading, selectedCode, onSelect }: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Wallet className="w-4 h-4" />
        </span>
        Método de pago
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : methods.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay métodos de pago disponibles.</p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <label
              key={method.code}
              className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                selectedCode === method.code
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.code}
                checked={selectedCode === method.code}
                onChange={() => onSelect(method.code)}
                className="mt-0.5 accent-primary"
              />
              <div>
                <p className="font-medium">{method.name}</p>
                {method.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
