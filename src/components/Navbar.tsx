"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/context/CartContext";
import { CartSlideOver } from "./CartSlideOver";

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Virtual Pet
              </span>
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
            
            <Link href="/login" className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted">
              <User className="w-5 h-5" />
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <ThemeToggle />
            
            <button className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
      <CartSlideOver />
    </>
  );
}
