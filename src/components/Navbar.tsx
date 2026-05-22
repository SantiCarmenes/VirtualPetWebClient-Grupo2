"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Search, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartSlideOver } from "./CartSlideOver";

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/catalog?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Iniciales del usuario para el avatar
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : null;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-background border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo + Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-nav-light.png"
                alt="Virtual Pet"
                width={0}
                height={0}
                sizes="220px"
                style={{ height: "32px", width: "auto" }}
                className="dark:hidden"
                priority
              />
              <Image
                src="/logo-nav-dark.png"
                alt="Virtual Pet"
                width={0}
                height={0}
                sizes="220px"
                style={{ height: "32px", width: "auto" }}
                className="hidden dark:block"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/catalog" className="text-foreground/80 hover:text-primary transition-colors">
                Catálogo
              </Link>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            {/* Buscador */}
            <div className="hidden md:flex relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer"
                onClick={handleSearch}
              />
              <input
                id="navbar-search"
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 pr-4 py-2 rounded-full border border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm w-64 transition-all"
              />
            </div>

            {/* Usuario */}
            {isLoading ? (
              <Link href="/profile" className="w-9 h-9 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Avatar con iniciales → link a /profile */}
                <Link
                  href="/profile"
                  title={`${user.firstName} ${user.lastName}`}
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  {initials}
                </Link>
                {/* Botón logout */}
                <button
                  id="navbar-logout"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="w-9 h-9 flex items-center justify-center text-foreground/60 hover:text-red-500 transition-colors rounded-full hover:bg-muted"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                title="Iniciar sesión"
                className="w-11 h-11 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-muted"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}

            {/* Carrito */}
            <button
              id="navbar-cart"
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
