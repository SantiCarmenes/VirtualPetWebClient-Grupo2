"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin, Receipt } from "lucide-react";
import { Order, OrderStatus } from "@/lib/mock-data";

const STATUS_STEPS: { id: OrderStatus; label: string; icon: React.ElementType }[] = [
  { id: 'RECIBIDO', label: 'Pedido Recibido', icon: Receipt },
  { id: 'PREPARANDO', label: 'En Preparación', icon: Package },
  { id: 'EN_CAMINO', label: 'En Camino', icon: Truck },
  { id: 'ENTREGADO', label: 'Entregado', icon: CheckCircle2 },
];

export function OrderTrackingClient({ order }: { order: Order }) {
  const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mi perfil
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Seguimiento de Pedido</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="font-mono font-medium bg-muted px-2 py-0.5 rounded text-foreground">#{order.id}</span>
            <span>•</span>
            <span>{new Date(order.date).toLocaleDateString('es-AR')}</span>
          </p>
        </div>
        
        {order.status !== 'ENTREGADO' && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-primary/20">
            <Clock className="w-4 h-4" />
            Llega el {new Date(order.estimatedDelivery).toLocaleDateString('es-AR')}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8">Estado del envío</h2>
            
            <div className="relative">
              {/* Línea de progreso (fondo) */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-muted rounded-full"></div>
              
              {/* Línea de progreso (activa) */}
              <div 
                className="absolute left-6 top-8 w-1 bg-primary rounded-full transition-all duration-1000"
                style={{ height: `${currentStepIndex * 33.33}%` }}
              ></div>

              <div className="space-y-12 relative">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex gap-6 items-start">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 transition-colors duration-500 ${
                        isCompleted ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground border-2 border-background'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="pt-2">
                        <h3 className={`font-bold text-lg ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </h3>
                        {isCurrent && step.id === 'EN_CAMINO' && (
                          <p className="text-sm text-muted-foreground mt-1">El repartidor está en camino a tu domicilio.</p>
                        )}
                        {isCurrent && step.id === 'ENTREGADO' && (
                          <p className="text-sm text-green-600 font-medium mt-1">El paquete fue entregado con éxito.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del Pedido */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              Dirección de Entrega
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4">Resumen de Compra</h3>
            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 pr-4">{item.quantity}x {item.productName}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center font-bold">
              <span>Total</span>
              <span className="text-primary text-lg">${order.total.toLocaleString("es-AR")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
