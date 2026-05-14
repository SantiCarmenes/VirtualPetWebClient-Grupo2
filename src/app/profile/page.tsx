"use client";

import { useState } from "react";
import Link from "next/link";
import { User, MapPin, CreditCard, Package, LogOut, ChevronRight, X } from "lucide-react";

type Tab = "datos" | "direcciones" | "pagos" | "pedidos";
type ModalType = "datos" | "direccion" | "pago" | null;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("datos");
  const [modalType, setModalType] = useState<ModalType>(null);

  // Helper para simular cierre de modal
  const closeModal = () => setModalType(null);
  const openModal = (type: ModalType) => setModalType(type);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mt-4">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">Gestioná tus datos personales, direcciones y métodos de pago.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {/* Menú Lateral */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab("datos")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeTab === "datos"
                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
              }`}
          >
            <div className="flex items-center gap-3">
              <User className={`w-5 h-5 ${activeTab === "datos" ? "" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
              Datos Personales
            </div>
            <ChevronRight className={`w-4 h-4 ${activeTab === "datos" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
          </button>

          <button
            onClick={() => setActiveTab("direcciones")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeTab === "direcciones"
                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
              }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${activeTab === "direcciones" ? "" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
              Direcciones
            </div>
            <ChevronRight className={`w-4 h-4 ${activeTab === "direcciones" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
          </button>

          <button
            onClick={() => setActiveTab("pagos")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeTab === "pagos"
                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
              }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${activeTab === "pagos" ? "" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
              Métodos de Pago
            </div>
            <ChevronRight className={`w-4 h-4 ${activeTab === "pagos" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
          </button>

          <button
            onClick={() => setActiveTab("pedidos")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeTab === "pedidos"
                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
              }`}
          >
            <div className="flex items-center gap-3">
              <Package className={`w-5 h-5 ${activeTab === "pedidos" ? "" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
              Mis Pedidos
            </div>
            <ChevronRight className={`w-4 h-4 ${activeTab === "pedidos" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
          </button>

          <div className="pt-4 mt-4 border-t border-border">
            <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </Link>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="md:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Tarjeta Datos Personales */}
          {activeTab === "datos" && (
            <div className="glass rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-6 relative">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Información Personal
                </h2>
                <button
                  onClick={() => openModal("datos")}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Editar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre Completo</label>
                  <p className="font-semibold text-foreground text-lg">Santi Cármenes</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                  <p className="font-semibold text-foreground text-lg">santi@virtualpet.com</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teléfono</label>
                  <p className="font-semibold text-foreground text-lg">+54 223 123-4567</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">DNI</label>
                  <p className="font-semibold text-foreground text-lg">35.xxx.xxx</p>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta Direcciones */}
          {activeTab === "direcciones" && (
            <div className="glass rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Direcciones Guardadas
                </h2>
                <button
                  onClick={() => openModal("direccion")}
                  className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  + Nueva
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                <div className="border-2 border-primary bg-primary/5 rounded-xl p-5 relative transition-all">
                  <span className="absolute top-4 right-4 text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">Principal</span>
                  <p className="font-bold text-lg mb-1 flex items-center gap-2">Casa</p>
                  <p className="text-sm text-foreground/80">San Martín 1234, Piso 2 Depto B</p>
                  <p className="text-sm text-muted-foreground mt-1">Mar del Plata, Buenos Aires</p>
                  <div className="mt-4 flex gap-3 text-sm font-medium">
                    <button className="text-primary hover:underline">Editar</button>
                    <button className="text-muted-foreground hover:text-red-500 transition-colors">Eliminar</button>
                  </div>
                </div>
                <div className="border border-border bg-background/50 rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer group">
                  <p className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Trabajo</p>
                  <p className="text-sm text-foreground/80">Av. Colón 4321, Oficina 12</p>
                  <p className="text-sm text-muted-foreground mt-1">Mar del Plata, Buenos Aires</p>
                  <div className="mt-4 flex gap-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-primary hover:underline">Editar</button>
                    <button className="text-muted-foreground hover:text-red-500 transition-colors">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta Métodos de Pago */}
          {activeTab === "pagos" && (
            <div className="glass rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Métodos de Pago
                </h2>
                <button
                  onClick={() => openModal("pago")}
                  className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  + Nuevo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                <div className="border-2 border-primary bg-primary/5 rounded-xl p-5 flex items-center gap-4 relative transition-all">
                  <span className="absolute top-4 right-4 text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">Principal</span>
                  <div className="w-14 h-10 bg-slate-800 rounded-md flex items-center justify-center shadow-inner">
                    <span className="text-white text-xs font-bold italic">VISA</span>
                  </div>
                  <div>
                    <p className="font-bold">Visa Crédito</p>
                    <p className="text-sm text-muted-foreground">Termina en •••• 4242</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta Mis Pedidos */}
          {activeTab === "pedidos" && (
            <div className="glass rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Mis Pedidos
                </h2>
              </div>

              <div className="space-y-4 relative">
                <Link href="/orders/ORD-12345" className="block border border-border bg-background/50 rounded-xl p-5 hover:border-primary/50 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md mb-2 inline-block">EN CAMINO</span>
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">Pedido #ORD-12345</p>
                    </div>
                    <span className="font-bold text-lg">$45.999</span>
                  </div>
                  <p className="text-sm text-foreground/80 line-clamp-1">1x Alimento Premium Perros Adultos 15kg</p>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Realizado el 12/05/2026</span>
                    <span className="text-primary font-medium group-hover:underline flex items-center">
                      Ver seguimiento <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>

                <Link href="/orders/ORD-12344" className="block border border-border bg-background/50 rounded-xl p-5 hover:border-primary/50 transition-all group opacity-75 hover:opacity-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold bg-muted text-muted-foreground px-2 py-1 rounded-md mb-2 inline-block">ENTREGADO</span>
                      <p className="font-bold text-lg group-hover:text-primary transition-colors">Pedido #ORD-12344</p>
                    </div>
                    <span className="font-bold text-lg">$13.400</span>
                  </div>
                  <p className="text-sm text-foreground/80 line-clamp-1">1x Collar Ajustable Reflectivo, 1x Shampoo Hipoalergénico...</p>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Realizado el 20/04/2026</span>
                    <span className="text-primary font-medium group-hover:underline flex items-center">
                      Ver recibo <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- MODALES --- */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-bold text-lg">
                {modalType === "datos" && "Editar Datos Personales"}
                {modalType === "direccion" && "Nueva Dirección"}
                {modalType === "pago" && "Nuevo Método de Pago"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">

              {/* Formulario Datos */}
              {modalType === "datos" && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre</label>
                      <input type="text" defaultValue="Santi" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Apellido</label>
                      <input type="text" defaultValue="Cármenes" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <input type="tel" defaultValue="+54 223 123-4567" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors mt-4">
                    Guardar Cambios
                  </button>
                </form>
              )}

              {/* Formulario Dirección */}
              {modalType === "direccion" && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre (ej: Casa, Trabajo)</label>
                    <input type="text" placeholder="Mi Casa" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Calle y Número</label>
                    <input type="text" placeholder="Av. Siempre Viva 742" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Piso/Depto</label>
                      <input type="text" placeholder="2B" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ciudad</label>
                      <input type="text" placeholder="Mar del Plata" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors mt-4">
                    Guardar Dirección
                  </button>
                </form>
              )}

              {/* Formulario Pago */}
              {modalType === "pago" && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número de Tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre en la tarjeta</label>
                    <input type="text" placeholder="Santi Cármenes" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vencimiento</label>
                      <input type="text" placeholder="MM/AA" maxLength={5} className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CCV</label>
                      <input type="text" placeholder="123" maxLength={4} className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none required" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors mt-4">
                    Guardar Tarjeta
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
