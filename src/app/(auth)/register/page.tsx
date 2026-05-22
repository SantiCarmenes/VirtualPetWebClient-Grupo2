"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRegister } from "@/hooks/useAuthForms";

export default function RegisterPage() {
  const { isLoading, error, isSuccess, submit } = useRegister();

  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(firstName, lastName, email, password);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4 animate-in zoom-in duration-500">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">¡Cuenta creada!</h1>
          <p className="text-muted-foreground mb-4">Te registraste con éxito. Redirigiendo al catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 relative overflow-hidden mt-8 mb-8">
        <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Iniciar Sesión
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">Sumate a la comunidad de Virtual Pet</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="register-firstname" className="text-sm font-medium leading-none">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="register-firstname"
                    type="text"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="register-lastname" className="text-sm font-medium leading-none">Apellido</label>
                <input
                  id="register-lastname"
                  type="text"
                  placeholder="Tu apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium leading-none">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium leading-none">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Registrarme"}
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
