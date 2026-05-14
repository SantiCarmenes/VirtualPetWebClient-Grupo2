"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula registro exitoso y cambio a estado de éxito local
    setIsRegistered(true);
    // Redirige al login después de 2 segundos
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  if (isRegistered) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4 animate-in zoom-in duration-500">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">¡Cuenta creada!</h1>
          <p className="text-muted-foreground mb-4">Te registraste con éxito. Redirigiendo a Iniciar Sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Iniciar Sesión
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">Sumate a la comunidad de Virtual Pet</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Tu nombre" 
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Apellido</label>
                <input 
                  type="text" 
                  placeholder="Tu apellido" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="ejemplo@correo.com" 
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 transition-all mt-6"
            >
              Registrarme
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
              Ingresá acá
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
