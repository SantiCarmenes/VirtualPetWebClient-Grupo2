"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import * as authService from "@/lib/services/auth.service";

// ─── Login ───────────────────────────────────────────────────────────────────

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  submit: (email: string, password: string) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const { login }   = useAuth();
  const { syncCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const submit = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      await syncCart();
      window.location.replace("/catalog");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión. Verificá tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, submit };
}

// ─── Register ────────────────────────────────────────────────────────────────

interface UseRegisterReturn {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  submit: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  const { register }  = useAuth();
  const { syncCart }  = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (firstName: string, lastName: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await register(firstName, lastName, email, password);
      await syncCart();
      setIsSuccess(true);
      setTimeout(() => window.location.replace("/catalog"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al intentar registrarte.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, isSuccess, submit };
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

interface UseForgotPasswordReturn {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  submit: (email: string) => Promise<void>;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, isSuccess, submit };
}

// ─── Reset Password ──────────────────────────────────────────────────────────

interface UseResetPasswordReturn {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  submit: (token: string, newPassword: string, confirm: string) => Promise<void>;
}

export function useResetPassword(): UseResetPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (token: string, newPassword: string, confirm: string) => {
    setError(null);
    if (newPassword !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      setError("El enlace de recuperación es inválido.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
      setTimeout(() => window.location.replace("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "El enlace es inválido o ya expiró.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, isSuccess, submit };
}
