"use client";

import { Truck, AlertCircle } from "lucide-react";
import type { ShippingMethod } from "@/lib/types";

interface Props {
  methods: ShippingMethod[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
}

export function CheckoutShippingMethods({
  methods,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Truck className="w-4 h-4" />
        </span>
        Método de envío
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={onRetry} className="ml-2 underline">
            Reintentar
          </button>
        </div>
      ) : methods.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay métodos de envío disponibles.</p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                selectedId === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingMethod"
                  value={method.id}
                  checked={selectedId === method.id}
                  onChange={() => onSelect(method.id)}
                  className="accent-primary"
                />
                <div>
                  <p className="font-medium">{method.name}</p>
                  {method.description && (
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  )}
                  {method.estimatedDays && (
                    <p className="text-xs text-muted-foreground">
                      {method.estimatedDays} días hábiles
                    </p>
                  )}
                </div>
              </div>
              <span className={`font-bold ${method.basePrice === 0 ? "text-green-600" : "text-foreground"}`}>
                {method.basePrice === 0 ? "Gratis" : `$${method.basePrice.toLocaleString("es-AR")}`}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
