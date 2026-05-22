"use client";

import { User as UserIcon } from "lucide-react";

interface Props {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function CheckoutGuestForm({ name, email, onNameChange, onEmailChange }: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <UserIcon className="w-4 h-4" />
        </span>
        Tus datos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="guest-name" className="text-sm font-medium">
            Nombre completo *
          </label>
          <input
            id="guest-name"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="guest-email" className="text-sm font-medium">
            Email *
          </label>
          <input
            id="guest-email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
}
