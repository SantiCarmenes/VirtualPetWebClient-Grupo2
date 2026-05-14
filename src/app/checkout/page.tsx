"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, MapPin, CreditCard, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [shippingData, setShippingData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: ""
  });
  const [isShippingComplete, setIsShippingComplete] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingData.nombre && shippingData.apellido && shippingData.direccion) {
      setIsShippingComplete(true);
    }
  };

  const handlePayment = () => {
    setIsPaymentComplete(true);
    clearCart();
  };

  if (isPaymentComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">¡Pedido Confirmado!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Gracias por tu compra. Te enviamos un email con los detalles del pedido y el seguimiento del envío.
        </p>
        <Link href="/catalog" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in">
      <div className="mb-8">
        <Link href="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight mt-4">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Checkout */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Checkout de invitado banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-primary mb-1">¿Tenés cuenta?</h3>
              <p className="text-sm text-muted-foreground">Iniciá sesión para pagar más rápido y usar tus direcciones guardadas.</p>
            </div>
            <Link href="/profile" className="px-6 py-2 bg-background border border-border rounded-full text-sm font-medium hover:border-primary transition-colors whitespace-nowrap">
              Usar mi Perfil
            </Link>
          </div>

          {/* Sección Datos de Envío */}
          <div className={`bg-card rounded-2xl border ${isShippingComplete ? 'border-green-500/50' : 'border-border'} p-6 shadow-sm transition-all duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${isShippingComplete ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                  {isShippingComplete ? <Check className="w-4 h-4" /> : '1'}
                </span>
                Datos de Envío
              </h2>
              {isShippingComplete && (
                <button onClick={() => setIsShippingComplete(false)} className="text-sm text-primary font-medium hover:underline">
                  Editar
                </button>
              )}
            </div>

            {!isShippingComplete ? (
              <form onSubmit={handleConfirmShipping} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre *</label>
                    <input required type="text" name="nombre" value={shippingData.nombre} onChange={handleShippingChange} className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Apellido *</label>
                    <input required type="text" name="apellido" value={shippingData.apellido} onChange={handleShippingChange} className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Dirección *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input required type="text" name="direccion" value={shippingData.direccion} onChange={handleShippingChange} placeholder="Ej: San Martín 1234, Mar del Plata" className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <input type="tel" name="telefono" value={shippingData.telefono} onChange={handleShippingChange} className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full md:w-auto px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary-hover transition-colors">
                  Continuar a Pago
                </button>
              </form>
            ) : (
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="font-medium">{shippingData.nombre} {shippingData.apellido}</p>
                <p className="text-muted-foreground text-sm mt-1">{shippingData.direccion}</p>
                {shippingData.telefono && <p className="text-muted-foreground text-sm">{shippingData.telefono}</p>}
              </div>
            )}
          </div>

          {/* Sección Pago */}
          <div className={`bg-card rounded-2xl border border-border p-6 shadow-sm transition-all duration-300 ${!isShippingComplete ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${!isShippingComplete ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                2
              </span>
              Método de Pago
            </h2>
            
            {!isShippingComplete ? (
              <p className="text-sm text-muted-foreground">Completá los datos de envío primero para continuar.</p>
            ) : (
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-primary bg-primary/5 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-primary focus:ring-primary accent-primary" />
                    <span className="font-medium">Tarjeta de Crédito / Débito</span>
                  </div>
                  <CreditCard className="w-5 h-5 text-primary" />
                </label>
                
                {/* Mock Card form */}
                <div className="p-4 border border-border rounded-xl space-y-4 bg-background">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número de Tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vencimiento</label>
                      <input type="text" placeholder="MM/AA" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVC</label>
                      <input type="text" placeholder="123" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Tu carrito está vacío</p>
                <Link href="/catalog" className="text-primary hover:underline text-sm mt-2 inline-block">Volver a la tienda</Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-xl bg-muted shrink-0 border border-border flex items-center justify-center text-[10px] text-muted-foreground">IMG</div>
                      <div>
                        <h4 className="text-sm font-bold line-clamp-2">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cant: {item.quantity} {item.selectedVariant && `| ${item.selectedVariant}`}
                        </p>
                        <p className="font-medium text-primary mt-1">
                          ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border py-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${cartTotal.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío (Mar del Plata)</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-extrabold text-2xl text-primary">${cartTotal.toLocaleString("es-AR")}</span>
                  </div>
                </div>

                <button 
                  disabled={!isShippingComplete || items.length === 0}
                  onClick={handlePayment}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Pagar de forma segura
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center">
                  <CreditCard className="w-3 h-3 mr-1" />
                  Pagos procesados de forma segura
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
