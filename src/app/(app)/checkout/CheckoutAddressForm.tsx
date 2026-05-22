"use client";

import { MapPin, Star } from "lucide-react";
import type { Address, User } from "@/lib/types";

export interface AddressFields {
  street: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
}

interface Props {
  user: User | null;
  address: AddressFields;
  savedAddresses: Address[];
  selectedAddressId: string | null;
  onChange: (field: keyof AddressFields, value: string) => void;
  onSelectSaved: (addr: Address | null) => void;
}

export function CheckoutAddressForm({
  user,
  address,
  savedAddresses,
  selectedAddressId,
  onChange,
  onSelectSaved,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <MapPin className="w-4 h-4" />
        </span>
        Dirección de envío
      </h2>

      {user && (
        <p className="text-sm text-muted-foreground mb-4">
          Pedido para{" "}
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>{" "}
          ({user.email})
        </p>
      )}

      {/* Selector de direcciones guardadas */}
      {savedAddresses.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-sm font-medium mb-2">Tus direcciones guardadas</p>

          {savedAddresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedAddressId === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <input
                type="radio"
                name="saved-address"
                className="mt-0.5 accent-primary"
                checked={selectedAddressId === addr.id}
                onChange={() => onSelectSaved(addr)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{addr.street}</p>
                <p className="text-xs text-muted-foreground">
                  {addr.city}, {addr.province}
                  {addr.postalCode ? ` (${addr.postalCode})` : ""}
                </p>
              </div>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
                  <Star className="w-3 h-3 fill-primary" />
                  Principal
                </span>
              )}
            </label>
          ))}

          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              selectedAddressId === null
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <input
              type="radio"
              name="saved-address"
              className="accent-primary"
              checked={selectedAddressId === null}
              onChange={() => onSelectSaved(null)}
            />
            <span className="text-sm font-medium">Ingresar otra dirección</span>
          </label>
        </div>
      )}

      {/* Formulario manual (siempre visible, pre-llenado si hay seleccionada) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="checkout-street" className="text-sm font-medium">
            Calle y número *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="checkout-street"
              type="text"
              placeholder="Ej: San Martín 1234, Piso 2"
              value={address.street}
              onChange={(e) => onChange("street", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="checkout-city" className="text-sm font-medium">Ciudad *</label>
          <input
            id="checkout-city"
            type="text"
            placeholder="Ej: Mar del Plata"
            value={address.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="checkout-province" className="text-sm font-medium">Provincia *</label>
          <input
            id="checkout-province"
            type="text"
            placeholder="Ej: Buenos Aires"
            value={address.province}
            onChange={(e) => onChange("province", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="checkout-zip" className="text-sm font-medium">Código postal</label>
          <input
            id="checkout-zip"
            type="text"
            placeholder="Ej: 7600"
            value={address.zipCode}
            onChange={(e) => onChange("zipCode", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="checkout-country" className="text-sm font-medium">País *</label>
          <input
            id="checkout-country"
            type="text"
            value={address.country}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
}
