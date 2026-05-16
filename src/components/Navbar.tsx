"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/context/CartContext";
import { CartSlideOver } from "./CartSlideOver";

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setIsLoggedIn(!!localStorage.getItem('refreshToken'));
      } catch {
        setIsLoggedIn(false);
      }
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  const handleUserClick = () => {
    router.push(isLoggedIn ? '/profile' : '/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-nav-light.png"
                alt="Virtual Pet"
                width={110}
                height={32}
                style={{ width: "auto", height: "32px" }}
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/logo-nav-dark.png"
                alt="Virtual Pet"
                width={110}
                height={32}
                style={{ width: "auto", height: "32px" }}
                className="object-contain hidden dark:block"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/catalog" className="text-foreground/80 hover:text-primary transition-colors">Catálogo</Link>
              <Link href="/promotions" className="text-foreground/80 hover:text-primary transition-colors">Promociones</Link>
              <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">Nosotros</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-9 pr-4 py-2 rounded-full border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm w-64 transition-all"
              />
            </div>

            <button
              onClick={handleUserClick}
              title={isLoggedIn ? 'Mi perfil' : 'Iniciar sesión'}
              className="w-11 h-11 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <ThemeToggle />
          </div>
        </div>
      </nav>
      <CartSlideOver />
    </>
  );
}
