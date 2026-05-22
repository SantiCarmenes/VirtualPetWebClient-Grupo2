"use client";

import Link from "next/link";
import { PackageCheck, Clock, CheckCircle2 } from "lucide-react";
import type { Order, PaymentMethod } from "@/lib/types";

interface Props {
  order: Order;
  paymentMethod: PaymentMethod | null;
}

export function CheckoutConfirmation({ order, paymentMethod }: Props) {
  const isCash = paymentMethod === "CASH";

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center animate-in fade-in">
      <div className="bg-card rounded-3xl border border-border p-10 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <PackageCheck className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-extrabold mb-2">¡Pedido confirmado!</h1>
        <p className="text-muted-foreground mb-6">
          Tu pedido fue registrado correctamente. Te enviaremos novedades a{" "}
          <span className="font-medium text-foreground">{order.customerEmail}</span>.
        </p>

        <div className="bg-muted/50 rounded-xl p-4 mb-4 text-left space-y-1">
          <p className="text-xs text-muted-foreground">Número de pedido</p>
          <p className="font-mono text-sm font-bold break-all">{order.id}</p>
        </div>

        {isCash ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-8 flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Pago en efectivo — se abona al momento de la entrega</span>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-8 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pago acreditado correctamente</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/track/${order.id}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Seguir mi pedido
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border font-bold rounded-xl hover:bg-muted transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
