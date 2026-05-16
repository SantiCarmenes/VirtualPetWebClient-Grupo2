"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, MapPin, Package, LogOut,
  ChevronRight, X, Loader2, AlertCircle,
  ShoppingBag, Edit3
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import * as orderService from "@/lib/services/order.service";
import * as userService from "@/lib/services/user.service";
import type { Order, OrderStatus } from "@/lib/types";

type Tab = "datos" | "direcciones" | "pedidos";

// ── Helpers de badge ───────────────────────────────────────────────────

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   "Pedido recibido",
  CONFIRMED: "En preparación",
  SHIPPED:   "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ── Componente ─────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("datos");
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ── Tab Datos ─────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName]   = useState(user?.lastName ?? "");
  const [username, setUsername]   = useState(user?.username ?? "");
  const [editLoading, setEditLoading]  = useState(false);
  const [editError, setEditError]      = useState<string | null>(null);

  // Sincronizar campos cuando llega el user
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      await userService.updateMe({ firstName, lastName, username });
      await refreshUser();
      setEditModalOpen(false);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Tab Pedidos ────────────────────────────────────────────────────────
  const [orders, setOrders]               = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError]     = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch {
      setOrdersError("No se pudieron cargar tus pedidos.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Fetch lazy — solo cuando el usuario activa el tab
  useEffect(() => {
    if (activeTab !== "pedidos") return;
    fetchOrders();
  }, [activeTab, fetchOrders]);

  // ── Logout ─────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // ── Sidebar tab button ─────────────────────────────────────────────────
  const TabButton = ({
    id, icon: Icon, label,
  }: { id: Tab; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        activeTab === id
          ? "bg-primary/10 text-primary font-bold border border-primary/20"
          : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${activeTab === id ? "" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
        {label}
      </div>
      <ChevronRight className={`w-4 h-4 ${activeTab === id ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
    </button>
  );

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mt-4">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gestioná tus datos personales y tus pedidos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ── Sidebar ── */}
        <div className="md:col-span-1 space-y-2">
          {/* Avatar */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          <TabButton id="datos"      icon={User}    label="Datos Personales" />
          <TabButton id="direcciones" icon={MapPin}  label="Direcciones" />
          <TabButton id="pedidos"    icon={Package}  label="Mis Pedidos" />

          <div className="pt-4 mt-4 border-t border-border">
            <button
              id="profile-logout"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="md:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* ─ Tab: Datos Personales ─ */}
          {activeTab === "datos" && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Información Personal
                </h2>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              </div>

              {user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Nombre
                    </label>
                    <p className="font-semibold text-lg">{user.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Apellido
                    </label>
                    <p className="font-semibold text-lg">{user.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Usuario
                    </label>
                    <p className="font-semibold text-lg">@{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </label>
                    <p className="font-semibold text-lg">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rol
                    </label>
                    <p className="font-semibold text-lg capitalize">{user.role === "BACKOFFICE" ? "Administrador" : "Cliente"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay datos disponibles.</p>
              )}
            </div>
          )}

          {/* ─ Tab: Direcciones (estáticas, sin API) ─ */}
          {activeTab === "direcciones" && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                Direcciones Guardadas
              </h2>
              <p className="text-sm text-muted-foreground">
                Podés ingresar tu dirección al momento de realizar una compra en el checkout.
              </p>
            </div>
          )}

          {/* ─ Tab: Mis Pedidos ─ */}
          {activeTab === "pedidos" && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                Mis Pedidos
              </h2>

              {/* Loading: 3 skeletons */}
              {ordersLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-28 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              )}

              {/* Error */}
              {!ordersLoading && ordersError && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <p className="text-red-500 text-sm">{ordersError}</p>
                  <button
                    onClick={fetchOrders}
                    className="text-sm text-primary hover:underline"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Vacío */}
              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-40" />
                  <div>
                    <p className="font-bold text-lg">Todavía no realizaste pedidos</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      ¡Explorá el catálogo y encontrá lo que necesitás!
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary-hover transition-colors"
                  >
                    Ir al catálogo
                  </Link>
                </div>
              )}

              {/* Lista de pedidos */}
              {!ordersLoading && !ordersError && orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block border border-border bg-background/50 rounded-xl p-5 hover:border-primary/50 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block ${STATUS_BADGE_CLASS[order.status]}`}>
                            {STATUS_LABEL[order.status]}
                          </span>
                          <p className="font-bold text-lg group-hover:text-primary transition-colors">
                            #{order.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <span className="font-bold text-lg">
                          ${order.total.toLocaleString("es-AR")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80">
                        {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <div className="mt-4 flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("es-AR")}
                        </span>
                        <span className="text-primary font-medium group-hover:underline flex items-center">
                          Ver seguimiento <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Editar datos ── */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-bold text-lg">Editar Datos Personales</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              {editError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {editError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-firstname" className="text-sm font-medium">Nombre</label>
                  <input
                    id="edit-firstname"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-lastname" className="text-sm font-medium">Apellido</label>
                  <input
                    id="edit-lastname"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-username" className="text-sm font-medium">Nombre de usuario</label>
                <input
                  id="edit-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={editLoading}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
