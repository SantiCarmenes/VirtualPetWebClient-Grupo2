"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/lib/types";
import * as authService from "@/lib/services/auth.service";
import { getMe } from "@/lib/services/user.service";

// ─── Tipos del contexto ───────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Contexto ────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Intenta cargar el usuario actual desde GET /users/me.
   * fetchApi ya maneja el refresh automático de token.
   */
  const loadUser = useCallback(async () => {
    const hasToken =
      typeof window !== "undefined" &&
      (!!localStorage.getItem("accessToken") || !!localStorage.getItem("refreshToken"));

    if (!hasToken) {
      setIsLoading(false);
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Al montar el Provider → intentar restaurar sesión
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /** Inicia sesión y carga el perfil del usuario. */
  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const me = await getMe();
    setUser(me);
  };

  /** Registra un nuevo usuario y carga su perfil. */
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    await authService.register(firstName, lastName, email, password);
    const me = await getMe();
    setUser(me);
  };

  /**
   * Cierra la sesión.
   * Llama al servicio (POST /auth/logout + limpia localStorage)
   * y resetea el estado local.
   */
  const logout = async () => {
    if (user) localStorage.removeItem(`firulais_chat_${user.id}`);
    await authService.logout();
    setUser(null);
  };

  /**
   * Recarga los datos del usuario desde la API.
   * Útil después de PATCH /users/me.
   */
  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
