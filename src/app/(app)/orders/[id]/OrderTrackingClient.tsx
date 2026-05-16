"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Package, Truck, CheckCircle2,
  Clock, MapPin, Receipt, XCircle, Loader2
} from "lucide-react";
import type { Order, OrderStatus, Payment, Shipment, PaymentMethod, ShipmentStatus } from "@/lib/types";
import * as paymentService from "@/lib/services/payment.service";
import * as shippingService from "@/lib/services/shipping.service";

// ── Mapeos de estado ──────────────────────────────────────────────────────

const STEP_ORDER: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const STEP_CONFIG: {
  id: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "PENDING",   label: "Pedido recibido", icon: Receipt },
  { id: "CONFIRMED", label: "En preparación",  icon: Package },
  { id: "SHIPPED",   label: "En camino",        icon: Truck },
  { id: "DELIVERED", label: "Entregado",        icon: CheckCircle2 },
];

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "Pago pendiente",  className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  APPROVED: { label: "Pago aprobado",   className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  REJECTED: { label: "Pago rechazado",  className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  REFUNDED: { label: "Reembolsado",     className: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400" },
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH:        "Efectivo",
  CREDIT_CARD: "Tarjeta de crédito",
  DEBIT_CARD:  "Tarjeta de débito",
  TRANSFER:    "Transferencia bancaria",
};

const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING:    "Pendiente",
  PROCESSING: "Preparando",
  SHIPPED:    "En camino",
  DELIVERED:  "Entregado",
  RETURNED:   "Devuelto",
};

// ── Componente ────────────────────────────────────────────────────────────

export function OrderTrackingClient({ order }: { order: Order }) {
  const activeStep = STEP_ORDER.indexOf(order.status); // -1 si CANCELLED

  // ── Pago ──────────────────────────────────────────────────────────────
  const [payment, setPayment]               = useState<Payment | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError]     = useState(false);

  useEffect(() => {
    paymentService
      .getPaymentByOrder(order.id)
      .then(setPayment)
      .catch(() => setPaymentError(true))
      .finally(() => setPaymentLoading(false));
  }, [order.id]);

  // ── Envío ─────────────────────────────────────────────────────────────
  const [shipment, setShipment]               = useState<Shipment | null>(null);
  const [shipmentLoading, setShipmentLoading] = useState(true);
  const [shipmentError, setShipmentError]     = useState(false);

  useEffect(() => {
    shippingService
      .getShipmentByOrder(order.id)
      .then(setShipment)
      .catch(() => setShipmentError(true))
      .finally(() => setShipmentLoading(false));
  }, [order.id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis pedidos
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Seguimiento de Pedido</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-mono font-medium bg-muted px-2 py-0.5 rounded text-foreground">
              #{order.id.substring(0, 8).toUpperCase()}
            </span>
            <span>•</span>
            <span>{new Date(order.createdAt).toLocaleDateString("es-AR")}</span>
          </p>
        </div>

        {order.status === "SHIPPED" && shipment?.estimatedDelivery && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-primary/20">
            <Clock className="w-4 h-4" />
            Llega el{" "}
            {new Date(shipment.estimatedDelivery).toLocaleDateString("es-AR")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ── Columna izquierda: stepper + tabla de items ── */}
        <div className="md:col-span-2 space-y-6">

          {/* Stepper / Banner cancelado */}
          <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8">Estado del envío</h2>

            {order.status === "CANCELLED" ? (
              <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Este pedido fue cancelado</p>
                  <p className="text-sm mt-1 opacity-80">
                    {new Date(order.updatedAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Línea fondo */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-muted rounded-full" />
                {/* Línea activa */}
                <div
                  className="absolute left-6 top-8 w-1 bg-primary rounded-full transition-all duration-1000"
                  style={{ height: `${(activeStep / (STEP_CONFIG.length - 1)) * 100}%` }}
                />

                <div className="space-y-12 relative">
                  {STEP_CONFIG.map((step, index) => {
                    const isCompleted = index <= activeStep;
                    const isCurrent  = index === activeStep;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex gap-6 items-start">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 transition-colors duration-500 ${
                            isCompleted
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                              : "bg-muted text-muted-foreground border-2 border-background"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="pt-2">
                          <h3 className={`font-bold text-lg ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </h3>
                          {isCurrent && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(order.updatedAt).toLocaleDateString("es-AR")}
                            </p>
                          )}
                          {step.id === "DELIVERED" && isCompleted && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                              El paquete fue entregado con éxito. ✓
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tabla de items */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Productos del pedido</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                    <th className="pb-3 pr-4">Producto</th>
                    <th className="pb-3 pr-4 text-center">Cant.</th>
                    <th className="pb-3 pr-4 text-right">P. Unit.</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <p className="font-medium">{item.productNameSnapshot}</p>
                        <p className="text-xs text-muted-foreground">{item.skuSnapshot}</p>
                      </td>
                      <td className="py-3 pr-4 text-center">{item.quantity}</td>
                      <td className="py-3 pr-4 text-right">
                        ${item.unitPrice.toLocaleString("es-AR")}
                      </td>
                      <td className="py-3 text-right font-medium">
                        ${item.lineTotal.toLocaleString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className={order.shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                  {order.shippingCost === 0
                    ? "Gratis"
                    : `$${order.shippingCost.toLocaleString("es-AR")}`}
                </span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-${order.discountTotal.toLocaleString("es-AR")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary text-lg">
                  ${order.total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Columna derecha: datos cliente + pago + envío ── */}
        <div className="space-y-6">

          {/* Datos del cliente y dirección */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              Dirección de entrega
            </h3>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{order.customerEmail}</p>
            <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              {order.shippingAddress.zipCode && <p>CP {order.shippingAddress.zipCode}</p>}
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Estado del pago */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4">Estado del pago</h3>
            {paymentLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : paymentError ? (
              <p className="text-sm text-muted-foreground">
                No se pudo cargar info de pago.
              </p>
            ) : payment ? (
              <div className="space-y-3">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${PAYMENT_STATUS_CONFIG[payment.status]?.className ?? ""}`}>
                  {PAYMENT_STATUS_CONFIG[payment.status]?.label ?? payment.status}
                </span>
                <p className="text-sm text-muted-foreground">
                  {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                </p>
                <p className="font-bold">
                  ${payment.amount.toLocaleString("es-AR")} {payment.currency}
                </p>
              </div>
            ) : null}
          </div>

          {/* Info de envío */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              Info de envío
            </h3>
            {shipmentLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : shipmentError ? (
              <p className="text-sm text-muted-foreground">
                No se pudo cargar info de envío.
              </p>
            ) : shipment ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método</span>
                  <span className="font-medium">{shipment.methodName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <span className="font-medium">
                    {SHIPMENT_STATUS_LABELS[shipment.status] ?? shipment.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seguimiento</span>
                  <span className="font-mono text-xs">
                    {shipment.trackingNumber ?? "Sin número aún"}
                  </span>
                </div>
                {shipment.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega est.</span>
                    <span className="font-medium">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
