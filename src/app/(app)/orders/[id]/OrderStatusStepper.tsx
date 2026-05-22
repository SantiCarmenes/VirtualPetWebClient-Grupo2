import type { ElementType } from "react";
import { Receipt, Package, Truck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";

const STEP_ORDER: OrderStatus[] = ["RECEIVED", "IN_PREPARATION", "IN_TRANSIT", "DELIVERED"];

const STEP_CONFIG: { id: OrderStatus; label: string; icon: ElementType }[] = [
  { id: "RECEIVED",       label: "Pedido recibido", icon: Receipt },
  { id: "IN_PREPARATION", label: "En preparación",  icon: Package },
  { id: "IN_TRANSIT",     label: "En camino",        icon: Truck },
  { id: "DELIVERED",      label: "Entregado",        icon: CheckCircle2 },
];

function getActiveStep(status: OrderStatus): number {
  if (status === "NOT_DELIVERED") return STEP_ORDER.indexOf("IN_TRANSIT");
  return STEP_ORDER.indexOf(status);
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function OrderStatusStepper({ order }: { order: Order }) {
  const activeStep     = getActiveStep(order.status);
  const isNotDelivered = order.status === "NOT_DELIVERED";

  // Build a map status → first occurrence date from history
  const historyMap = new Map<OrderStatus, string>();
  for (const entry of (order.statusHistory ?? [])) {
    if (!historyMap.has(entry.status)) historyMap.set(entry.status, entry.createdAt);
  }

  return (
    <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-8">Estado del envío</h2>

      {order.status === "CANCELLED" ? (
        <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Este pedido fue cancelado</p>
            <p className="text-sm mt-1 opacity-80">
              {historyMap.get("CANCELLED") ? fmt(historyMap.get("CANCELLED")!) : fmt(order.updatedAt)}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-muted rounded-full" />
            <div
              className="absolute left-6 top-8 w-1 bg-primary rounded-full transition-all duration-1000"
              style={{ height: `${(activeStep / (STEP_CONFIG.length - 1)) * 100}%` }}
            />
            <div className="space-y-12 relative">
              {STEP_CONFIG.map((step, index) => {
                const isCompleted  = index <= activeStep;
                const isCurrent    = index === activeStep;
                const isFailedStep = isCurrent && isNotDelivered;
                const Icon         = isFailedStep ? AlertTriangle : step.icon;
                const stepDate     = historyMap.get(step.id);

                return (
                  <div key={step.id} className="flex gap-6 items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 transition-colors duration-500 ${
                        isFailedStep
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/20"
                          : isCompleted
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-muted text-muted-foreground border-2 border-background"
                      } ${isCurrent && !isFailedStep ? "ring-4 ring-primary/20" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <h3
                        className={`font-bold text-lg ${
                          isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isCompleted && stepDate && (
                        <p className="text-sm text-muted-foreground mt-1">{fmt(stepDate)}</p>
                      )}
                      {step.id === "DELIVERED" && isCompleted && !isNotDelivered && (
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

          {isNotDelivered && (
            <div className="mt-6 flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl text-orange-700 dark:text-orange-400">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Intento de entrega fallido</p>
                <p className="text-sm mt-1 opacity-90">
                  Intento #{order.deliveryAttempts} de 3.
                  {order.nextDeliveryAt
                    ? ` Próximo intento: ${new Date(order.nextDeliveryAt).toLocaleDateString("es-AR")}.`
                    : " Se reprogramará en las próximas 24 horas."}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
