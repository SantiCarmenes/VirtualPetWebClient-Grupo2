import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Clock, Bone, Gamepad2, Scissors, Package } from "lucide-react";
import type { Category } from "@/lib/types";

const FALLBACK_ICONS: Record<string, React.ElementType> = {
  alimentos:  Bone,
  juguetes:   Gamepad2,
  accesorios: Package,
  higiene:    Scissors,
};

const features = [
  { Icon: Truck,       title: "Envío Rápido",  desc: "Entregas en el día con nuestra flota propia en MDQ." },
  { Icon: ShieldCheck, title: "Compra Segura", desc: "Tus pagos y datos están protegidos en cada transacción." },
  { Icon: Clock,       title: "Soporte 24/7",  desc: "Estamos siempre disponibles para vos y tu mascota." },
];

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalog/categories`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data: Category[] = await res.json();
    return data.filter((c) => c.active).slice(0, 8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-accent">
        <div className="container relative mx-auto px-4 py-16 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* texto */}
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground" />
                </span>
                Envío gratis en MDQ
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
                Todo lo que tu<br />
                mascota{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">necesita</span>
                  <span className="absolute left-0 bottom-1 w-full h-[10px] bg-secondary/40 rounded-sm -z-0" />
                </span>
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-[420px]">
                Descubrí el catálogo más completo de alimentos, accesorios y juguetes para tus mascotas. Con envío en el día en MDQ.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/catalog"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover hover:shadow-lg transition-all"
                >
                  Ver Catálogo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/promotions"
                  className="inline-flex items-center px-7 py-3.5 rounded-full border border-border bg-background font-semibold text-sm hover:bg-muted transition-all"
                >
                  Promociones
                </Link>
              </div>
            </div>

            {/* logo */}
            <div className="hidden lg:flex items-center justify-center lg:justify-end">
              <div className="animate-float relative w-80 h-80 md:w-[440px] md:h-[440px]">
                <Image src="/logo-light.png" alt="Virtual Pet" fill sizes="(max-width: 1024px) 0px, 440px" className="object-contain drop-shadow-2xl dark:hidden" priority />
                <Image src="/logo-darky.png" alt="Virtual Pet" fill sizes="(max-width: 1024px) 0px, 440px" className="object-contain hidden dark:block" priority />
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Explorá</p>
              <h2 className="text-3xl font-bold">Categorías</h2>
            </div>
            <Link href="/catalog" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {categories.map((cat) => {
                const FallbackIcon = FALLBACK_ICONS[cat.slug] ?? Package;
                return (
                  <Link
                    key={cat.id}
                    href={`/catalog?category=${cat.slug}`}
                    className="group relative overflow-hidden rounded-2xl aspect-square hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    {cat.imageUrl ? (
                      <>
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                        <span className="absolute bottom-4 left-0 right-0 text-center font-bold text-sm text-white tracking-wide">
                          {cat.name}
                        </span>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
                        <FallbackIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                        <span className="font-semibold text-sm">{cat.name}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Fallback estático si la API no responde */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[
                { name: "Alimentos",  slug: "alimentos",  img: "/alimentos.png" },
                { name: "Juguetes",   slug: "juguetes",   img: "/juguetes.png" },
                { name: "Accesorios", slug: "accesorios", img: "/accesorios.png" },
                { name: "Higiene",    slug: "higiene",    img: "/higienesalud.png" },
              ].map(({ name, slug, img }) => (
                <Link
                  key={slug}
                  href={`/catalog?category=${slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <Image src={img} alt={name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <span className="absolute bottom-4 left-0 right-0 text-center font-bold text-sm text-white tracking-wide">{name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="relative py-20 bg-muted">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Por qué elegirnos</p>
            <h2 className="text-3xl font-bold">Tu mascota merece lo mejor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border/60 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5 text-primary-foreground shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
