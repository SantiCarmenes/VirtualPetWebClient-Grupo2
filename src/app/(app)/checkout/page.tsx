"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ShieldCheck, MapPin, ShoppingBag,
  Check, Loader2, AlertCircle, Truck, Wallet
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import * as orderService from "@/lib/services/order.service";
import * as shippingService from "@/lib/services/shipping.service";
import * as paymentService from "@/lib/services/payment.service";
import type { ShippingMethod, PaymentMethodOption, PaymentMethod } from "@/lib/types";
import Image from "next/image";

// Mapeo de códigos de método de pago a labels legibles
const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  CREDIT_CARD: "Tarjeta de crédito",
  DEBIT_CARD: "Tarjeta de débito",
  TRANSFER: "Transferencia bancaria",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // ── Métodos disponibles ───────────────────────────────────────
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState<string | null>(null);

  // ── Selección del usuario ─────────────────────────────────────
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<PaymentMethod | null>(null);

  // ── Formulario de envío ───────────────────────────────────────
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Argentina");

  // ── Estado de submit ──────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Cargar métodos al montar (paralelo) ───────────────────────
  const loadMethods = async () => {
    setMethodsLoading(true);
    setMethodsError(null);
    try {
      const [shipping, payment] = await Promise.all([
        shippingService.getShippingMethods(),
        paymentService.getPaymentMethods(),
      ]);
      setShippingMethods(shipping);
      setPaymentMethods(payment);

      // Auto-seleccionar si hay solo una opción
      if (shipping.length === 1) setSelectedMethodId(shipping[0].id);
      if (payment.length > 0) setSelectedPaymentCode(payment[0].code);
    } catch {
      setMethodsError("No se pudieron cargar los métodos de envío y pago.");
    } finally {
      setMethodsLoading(false);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  // ── Pre-poblar datos del usuario ──────────────────────────────
  // (solo rellena una vez cuando llega el user)
  useEffect(() => {
    if (!user) return;
    // No hay campo de email/nombre en el form — los tomamos del user al submit
  }, [user]);

  // ── Carrito vacío → redirigir ─────────────────────────────────
  useEffect(() => {
    if (!methodsLoading && items.length === 0) {
      router.push("/catalog");
    }
  }, [items, methodsLoading, router]);

  // ── Calcular costo de envío seleccionado ─────────────────────
  const selectedShippingMethod = shippingMethods.find((m) => m.id === selectedMethodId);
  const shippingCost = selectedShippingMethod?.basePrice ?? 0;
  const totalWithShipping = cartTotal + shippingCost;

  // ── Confirmar pedido ──────────────────────────────────────────
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentCode) {
      setSubmitError("Seleccioná un método de pago.");
      return;
    }
    if (!street || !city || !province) {
      setSubmitError("Completá la dirección de envío.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const customerName = user
        ? `${user.firstName} ${user.lastName}`
        : "";
      const customerEmail = user?.email ?? "";

      const response = await orderService.createOrder({
        customerEmail,
        customerName,
        shippingAddress: { street, city, province, zipCode: zipCode || undefined, country },
        shippingMethodId: selectedMethodId ?? undefined,
        paymentMethodCode: selectedPaymentCode,
      });

      // Si el gateway devuelve paymentUrl → redirigir (futuro)
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      // Limpiar carrito local y redirigir al tracking
      await clearCart();
      router.push(`/orders/${response.order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el pedido.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/catalog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight mt-4">Checkout</h1>
      </div>

      <form onSubmit={handleConfirmOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Columna izquierda: formulario ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* ─ Sección: Dirección de envío ─ */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  <MapPin className="w-4 h-4" />
                </span>
                Dirección de envío
              </h2>

              {/* Pre-relleno con datos del usuario */}
              {user && (
                <p className="text-sm text-muted-foreground mb-4">
                  Pedido para{" "}
                  <span className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </span>{" "}
                  ({user.email})
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="checkout-street" className="text-sm font-medium">
                    Calle y número *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="checkout-street"
                      type="text"
                      placeholder="Ej: San Martín 1234, Piso 2"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="checkout-city" className="text-sm font-medium">
                    Ciudad *
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    placeholder="Ej: Mar del Plata"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="checkout-province" className="text-sm font-medium">
                    Provincia *
                  </label>
                  <input
                    id="checkout-province"
                    type="text"
                    placeholder="Ej: Buenos Aires"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="checkout-zip" className="text-sm font-medium">
                    Código postal
                  </label>
                  <input
                    id="checkout-zip"
                    type="text"
                    placeholder="Ej: 7600"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="checkout-country" className="text-sm font-medium">
                    País *
                  </label>
                  <input
                    id="checkout-country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ─ Sección: Método de envío ─ */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </span>
                Método de envío
              </h2>

              {methodsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-14 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : methodsError ? (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{methodsError}</span>
                  <button
                    type="button"
                    onClick={loadMethods}
                    className="ml-2 underline"
                  >
                    Reintentar
                  </button>
                </div>
              ) : shippingMethods.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay métodos de envío disponibles.
                </p>
              ) : (
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedMethodId === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={selectedMethodId === method.id}
                          onChange={() => setSelectedMethodId(method.id)}
                          className="accent-primary"
                        />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          {method.description && (
                            <p className="text-xs text-muted-foreground">
                              {method.description}
                            </p>
                          )}
                          {method.estimatedDays && (
                            <p className="text-xs text-muted-foreground">
                              {method.estimatedDays} días hábiles
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`font-bold ${method.basePrice === 0 ? "text-green-600" : "text-foreground"}`}>
                        {method.basePrice === 0
                          ? "Gratis"
                          : `$${method.basePrice.toLocaleString("es-AR")}`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ─ Sección: Método de pago ─ */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </span>
                Método de pago
              </h2>

              {methodsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-14 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay métodos de pago disponibles.
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.code}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedPaymentCode === method.code
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.code}
                        checked={selectedPaymentCode === method.code}
                        onChange={() => setSelectedPaymentCode(method.code)}
                        className="mt-0.5 accent-primary"
                      />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        {method.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Columna derecha: resumen ── */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto pr-1">
                {items.map((item) => {
                  const imageUrl = item.variant?.images?.[0]?.url ?? null;
                  const name = item.variant?.product?.name ?? "Producto";
                  const price = item.variant?.price ?? 0;
                  const sku = item.variant?.sku;

                  return (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded-xl bg-muted shrink-0 border border-border overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={name}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-muted-foreground opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold line-clamp-2">{name}</h4>
                        {sku && (
                          <p className="text-xs text-muted-foreground">SKU: {sku}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Cant: {item.quantity}
                        </p>
                        <p className="font-medium text-primary text-sm mt-0.5">
                          ${(price * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totales */}
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
                    {shippingCost === 0
                      ? "Gratis"
                      : `$${shippingCost.toLocaleString("es-AR")}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-extrabold text-2xl text-primary">
                    ${totalWithShipping.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              {/* Método seleccionado */}
              {selectedPaymentCode && (
                <p className="text-xs text-muted-foreground text-center mb-4">
                  Pago con {PAYMENT_LABELS[selectedPaymentCode]}
                </p>
              )}

              {/* Error de submit */}
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
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Confirmar pedido
                  </>
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                Transacción segura
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
