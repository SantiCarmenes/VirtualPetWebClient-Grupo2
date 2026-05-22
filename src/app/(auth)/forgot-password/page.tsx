"use client";

import Link from "next/link";
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/useAuthForms";

export default function ForgotPasswordPage() {
  const { isLoading, error, isSuccess, submit } = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(email);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al login
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">¿Olvidaste tu contraseña?</h1>
            <p className="text-muted-foreground">Ingresá tu email y te enviaremos un enlace para recuperarla.</p>
          </div>

          {isSuccess ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">
                Si el email está registrado, recibirás un enlace de recuperación en los próximos minutos. Revisá también la carpeta de spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
