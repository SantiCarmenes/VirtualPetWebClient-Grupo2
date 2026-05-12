import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-20 lg:py-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px]">
            <path fill="#f97316" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.4C91.4,-33.7,98,-18.4,98.6,-3C99.2,12.4,93.8,27.8,84.4,41.2C75,54.6,61.6,66,46.9,74.5C32.2,83,16.1,88.6,0.3,88.1C-15.5,87.6,-31,81,-44.6,71.8C-58.2,62.6,-69.9,50.8,-77.8,37.1C-85.7,23.4,-89.8,7.8,-88.7,-7.4C-87.6,-22.6,-81.3,-37.4,-72.1,-49.4C-62.9,-61.4,-50.8,-70.6,-37.5,-77.9C-24.2,-85.2,-9.7,-90.6,2.8,-94.6C15.3,-98.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Envíos gratis en Mar del Plata
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
              Todo lo que tu mascota <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">necesita</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Virtual Pet nunca defraudará a su mascota. Descubrí el catálogo más completo de alimentos, accesorios y juguetes, 100% digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/catalog" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary rounded-full hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 transition-all group"
              >
                Ver Catálogo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/promotions" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-background border border-border rounded-full hover:bg-muted transition-all"
              >
                Ver Promociones
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Envío Rápido</h3>
              <p className="text-muted-foreground text-sm">Entregas en el día con nuestra flota propia en MDQ.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-secondary/20 transition-colors">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Compra Segura</h3>
              <p className="text-muted-foreground text-sm">Tus pagos y datos están protegidos en cada transacción.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Soporte 24/7</h3>
              <p className="text-muted-foreground text-sm">Estamos siempre disponibles para vos y tu mascota.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Categorías Destacadas</h2>
            <Link href="/catalog" className="text-primary hover:text-primary-hover font-medium flex items-center">
              Ver todas <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {['Alimentos', 'Juguetes', 'Accesorios', 'Higiene'].map((cat, i) => (
              <Link key={cat} href={`/catalog?category=${cat.toLowerCase()}`} className="group relative overflow-hidden rounded-2xl aspect-square bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 z-20 w-full">
                  <h3 className="text-white font-bold text-lg sm:text-xl group-hover:text-primary transition-colors">{cat}</h3>
                </div>
                {/* Placeholder block until we have actual images */}
                <div className="absolute inset-0 bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span className="text-muted-foreground/30 font-bold text-4xl">{i+1}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
