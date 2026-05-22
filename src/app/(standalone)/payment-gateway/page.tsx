"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Lock, XCircle, CheckCircle2, Loader2 } from "lucide-react";
import { trackOrder } from "@/lib/services/order.service";
import { simulateWebhook } from "@/lib/services/payment.service";
import type { Order } from "@/lib/types";

type Stage = "loading" | "ready" | "processing" | "error";

function PaymentGateway() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.replace("/catalog");
      return;
    }
    trackOrder(orderId)
      .then((o) => { setOrder(o); setStage("ready"); })
      .catch(() => { setErrorMsg("No se pudo cargar la orden."); setStage("error"); });
  }, [orderId, router]);

  const handleResult = async (result: "approved" | "rejected") => {
    if (!orderId) return;
    setStage("processing");
    try {
      await simulateWebhook(orderId, result);
      if (result === "approved") {
        router.replace(`/track/${orderId}`);
      } else {
        router.replace("/catalog");
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error al procesar el pago.");
      setStage("error");
    }
  };

  if (stage === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="font-semibold">{errorMsg}</p>
          <button
            onClick={() => router.push("/catalog")}
            className="text-sm text-primary underline"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="bg-card border border-border rounded-2xl shadow-lg max-w-md w-full overflow-hidden">

        <div className="bg-primary px-6 py-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-primary-foreground" />
          <span className="text-primary-foreground font-bold text-lg">Pasarela de Pago Segura</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-muted/50 rounded-xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Orden</p>
            <p className="font-mono text-xs break-all text-foreground">{order?.id}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">Total a pagar</span>
              <span className="text-xl font-extrabold text-foreground">
                ${Number(order?.total ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              Datos de pago (simulación)
            </div>
            <input
              readOnly
              value="4242 4242 4242 4242"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground cursor-not-allowed"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                readOnly
                value="12/99"
                className="bg-muted border border-border rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground cursor-not-allowed"
              />
              <input
                readOnly
                value="123"
                className="bg-muted border border-border rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleResult("approved")}
              disabled={stage === "processing"}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {stage === "processing" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirmar pago
            </button>
            <button
              onClick={() => handleResult("rejected")}
              disabled={stage === "processing"}
              className="w-full flex items-center justify-center gap-2 border border-border hover:bg-muted disabled:opacity-60 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <XCircle className="w-4 h-4 text-destructive" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PaymentGateway />
    </Suspense>
  );
}
