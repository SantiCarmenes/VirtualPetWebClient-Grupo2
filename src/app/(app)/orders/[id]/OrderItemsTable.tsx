import type { Order } from "@/lib/types";

export function OrderItemsTable({ order }: { order: Order }) {
  return (
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
  );
}
