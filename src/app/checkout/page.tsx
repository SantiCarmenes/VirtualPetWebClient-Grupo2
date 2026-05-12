import Link from "next/link";
import { ArrowLeft, ShieldCheck, MapPin, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <p className="text-sm text-muted-foreground">Iniciá sesión para pagar más rápido y sumar puntos.</p>
            </div>
            <Link href="/login" className="px-6 py-2 bg-background border border-border rounded-full text-sm font-medium hover:border-primary transition-colors whitespace-nowrap">
              Iniciar Sesión
            </Link>
          </div>

          {/* Sección Datos de Envío */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">1</span>
              Datos de Envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Apellido</label>
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Ej: San Martín 1234, Mar del Plata" className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <input type="tel" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Sección Pago */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm opacity-50 pointer-events-none">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-3 text-sm">2</span>
              Método de Pago
            </h2>
            <p className="text-sm text-muted-foreground">Completá los datos de envío primero para continuar.</p>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-muted shrink-0 border border-border"></div>
                <div>
                  <h4 className="text-sm font-bold line-clamp-2">Alimento Premium Perros Adultos 15kg</h4>
                  <p className="text-sm text-muted-foreground mt-1">Cant: 1</p>
                  <p className="font-medium text-primary mt-1">$45.999</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-muted shrink-0 border border-border"></div>
                <div>
                  <h4 className="text-sm font-bold line-clamp-2">Juguete Rascador Gato Torre</h4>
                  <p className="text-sm text-muted-foreground mt-1">Cant: 1</p>
                  <p className="font-medium text-primary mt-1">$32.500</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">$78.499</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío (Mar del Plata)</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-extrabold text-2xl text-primary">$78.499</span>
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Pagar de forma segura
            </button>
            <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center">
              <CreditCard className="w-3 h-3 mr-1" />
              Pagos procesados de forma segura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
