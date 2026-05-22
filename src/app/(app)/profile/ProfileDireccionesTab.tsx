"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import * as addressService from "@/lib/services/address.service";
import type { Address } from "@/lib/types";

interface AddressFormState {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressFormState = {
  street: "",
  city: "",
  province: "",
  postalCode: "",
  isDefault: false,
};

export function ProfileDireccionesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setAddresses(await addressService.getAddresses());
    } catch {
      setError("No se pudieron cargar las direcciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      street: addr.street,
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const payload = {
        street: form.street,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode || undefined,
        isDefault: form.isDefault,
      };
      if (editingId) {
        await addressService.updateAddress(editingId, payload);
        setSuccessMsg("Dirección actualizada.");
      } else {
        await addressService.createAddress(payload);
        setSuccessMsg("Dirección guardada.");
      }
      closeForm();
      await load();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar la dirección.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await addressService.deleteAddress(id);
      await load();
    } catch {
      setError("No se pudo eliminar la dirección.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      await addressService.updateAddress(addr.id, { isDefault: true });
      await load();
    } catch {
      setError("No se pudo cambiar la dirección principal.");
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Direcciones Guardadas
        </h2>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva dirección
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm p-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 border border-border rounded-2xl p-5 bg-muted/30 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-base">
              {editingId ? "Editar dirección" : "Nueva dirección"}
            </h3>
            <button type="button" onClick={closeForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Calle y número *</label>
              <input
                type="text"
                placeholder="Ej: San Martín 1234, Piso 2"
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Ciudad *</label>
              <input
                type="text"
                placeholder="Ej: Mar del Plata"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Provincia *</label>
              <input
                type="text"
                placeholder="Ej: Buenos Aires"
                value={form.province}
                onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Código postal</label>
              <input
                type="text"
                placeholder="Ej: 7600"
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
              className="accent-primary w-4 h-4"
            />
            Marcar como dirección principal
          </label>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all disabled:opacity-60"
            >
              {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Guardar cambios" : "Agregar dirección"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2.5 border border-border text-sm font-semibold rounded-xl hover:bg-muted transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de direcciones */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Todavía no tenés direcciones guardadas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all ${
                addr.isDefault
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${addr.isDefault ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">{addr.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.city}, {addr.province}
                    {addr.postalCode ? ` (${addr.postalCode})` : ""}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-primary">
                      <Star className="w-3 h-3 fill-primary" />
                      Principal
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    title="Marcar como principal"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => openEdit(addr)}
                  title="Editar"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  title="Eliminar"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  {deletingId === addr.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
