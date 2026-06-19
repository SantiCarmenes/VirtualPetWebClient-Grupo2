import { FileText, MapPin, Truck } from "lucide-react";
import type { Order, Payment, Shipment, PaymentMethod, ShipmentStatus, InvoiceStatus } from "@/lib/types";

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "Pago pendiente", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  APPROVED: { label: "Pago aprobado",  className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  REJECTED: { label: "Pago rechazado", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  REFUNDED: { label: "Reembolsado",    className: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400" },
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

interface Props {
  order: Order;
  payment: Payment | null;
  shipment: Shipment | null;
}

export function OrderSideColumn({ order, payment, shipment }: Props) {
  return (
    <div className="space-y-6">
      {/* Dirección */}
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

      {/* Pago */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold mb-4">Estado del pago</h3>
        {payment ? (
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

      {/* Envío */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          Info de envío
        </h3>
        {shipment ? (
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

      {/* Facturación */}
      {order.invoiceStatus !== 'NONE' && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            Facturación
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <span
                className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                  order.invoiceStatus === 'DONE'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}
              >
                {order.invoiceStatus === 'DONE' ? 'Facturado' : 'Requiere factura'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CUIT</span>
              <span className="font-mono font-medium">{order.invoiceCuit}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
