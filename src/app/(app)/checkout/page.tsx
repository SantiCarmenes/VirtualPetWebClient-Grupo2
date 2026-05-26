"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import * as shippingService from "@/lib/services/shipping.service";
import * as paymentService from "@/lib/services/payment.service";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { useCheckout } from "@/hooks/useCheckout";
import type { ShippingMethod, PaymentMethodOption, PaymentMethod } from "@/lib/types";
import { CheckoutConfirmation } from "./CheckoutConfirmation";
import { CheckoutGuestForm } from "./CheckoutGuestForm";
import { CheckoutAddressForm } from "./CheckoutAddressForm";
import type { AddressFields } from "./CheckoutAddressForm";
import { CheckoutShippingMethods } from "./CheckoutShippingMethods";
import { CheckoutPaymentMethods } from "./CheckoutPaymentMethods";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal } = useCart();
  const { user } = useAuth();
  const {
    submitOrder,
    submitGuestOrder,
    isLoading,
    error,
    confirmedOrder,
    priceChanges,
    confirmPriceChanges,
    dismissPriceChanges,
  } = useCheckout();

  const isGuest = !user;

  const { savedAddresses, selectedAddressId, selectedAddress, onSelectSaved } = useAddresses(!!user);

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethodOption[]>([]);
  const [methodsLoading, setMethodsLoading]   = useState(true);
  const [methodsError, setMethodsError]       = useState<string | null>(null);

  const [selectedMethodId, setSelectedMethodId]       = useState<string | null>(null);
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<PaymentMethod | null>(null);

  const [guestName, setGuestName]   = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [address, setAddress] = useState<AddressFields>({
    street: "", city: "", province: "", zipCode: "", country: "Argentina",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const loadMethods = async () => {
    setMethodsLoading(true);
    setMethodsError(null);
    try {
      const [shipping, payment] = await Promise.all([
        shippingService.getShippingMethods(),
        paymentService.getPaymentMethods(),
      ]);
      setShippingMethods(shipping);
      setPaymentMethods(payment);
      if (shipping.length === 1) setSelectedMethodId(shipping[0].id);
      if (payment.length > 0) setSelectedPaymentCode(payment[0].code);
    } catch {
      setMethodsError("No se pudieron cargar los métodos de envío y pago.");
    } finally {
      setMethodsLoading(false);
    }
  };

  useEffect(() => { loadMethods(); }, []);

  useEffect(() => {
    if (!methodsLoading && items.length === 0 && !confirmedOrder) {
      router.push("/catalog");
    }
  }, [items, methodsLoading, confirmedOrder, router]);

  useEffect(() => {
    if (selectedAddress) {
      setAddress({
        street: selectedAddress.street,
        city: selectedAddress.city,
        province: selectedAddress.province,
        zipCode: selectedAddress.postalCode,
        country: "Argentina",
      });
    } else if (selectedAddressId === null && savedAddresses.length > 0) {
      setAddress({ street: "", city: "", province: "", zipCode: "", country: "Argentina" });
    }
  }, [selectedAddress, selectedAddressId, savedAddresses.length]);

  const selectedShippingMethod = shippingMethods.find((m) => m.id === selectedMethodId);
  const shippingCost      = Number(selectedShippingMethod?.basePrice ?? 0);
  const totalWithShipping = cartTotal + shippingCost;

  const handleAddressChange = (field: keyof AddressFields, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaymentCode) {
      setValidationError("Seleccioná un método de pago.");
      return;
    }
    if (!address.street || !address.city || !address.province) {
      setValidationError("Completá la dirección de envío.");
      return;
    }
    if (isGuest && (!guestName.trim() || !guestEmail.trim())) {
      setValidationError("Ingresá tu nombre y email para continuar.");
      return;
    }
    setValidationError(null);

    const shippingAddress = {
      street: address.street,
      city: address.city,
      province: address.province,
      zipCode: address.zipCode || undefined,
      country: address.country,
    };

    if (isGuest) {
      await submitGuestOrder({
        customerEmail: guestEmail.trim(),
        customerName: guestName.trim(),
        shippingAddress,
        shippingMethodId: selectedMethodId ?? undefined,
        paymentMethodCode: selectedPaymentCode,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });
    } else {
      await submitOrder({
        customerEmail: user.email,
        customerName: `${user.firstName} ${user.lastName}`,
        shippingAddress,
        shippingMethodId: selectedMethodId ?? undefined,
        paymentMethodCode: selectedPaymentCode,
      });
    }
  };

  if (confirmedOrder) {
    return <CheckoutConfirmation order={confirmedOrder} paymentMethod={selectedPaymentCode} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in">
      <div className="mb-8">
        <Link
          href="/catalog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight mt-4">Checkout</h1>
        {isGuest && (
          <p className="text-sm text-muted-foreground mt-1">
            Comprando como invitado ·{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        )}
      </div>

      <form onSubmit={handleConfirmOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isGuest && (
              <CheckoutGuestForm
                name={guestName}
                email={guestEmail}
                onNameChange={setGuestName}
                onEmailChange={setGuestEmail}
              />
            )}

            <CheckoutAddressForm
              user={user}
              address={address}
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onChange={handleAddressChange}
              onSelectSaved={onSelectSaved}
            />

            <CheckoutShippingMethods
              methods={shippingMethods}
              loading={methodsLoading}
              error={methodsError}
              selectedId={selectedMethodId}
              onSelect={setSelectedMethodId}
              onRetry={loadMethods}
            />

            <CheckoutPaymentMethods
              methods={paymentMethods}
              loading={methodsLoading}
              selectedCode={selectedPaymentCode}
              onSelect={setSelectedPaymentCode}
            />
          </div>

          <div className="lg:col-span-1">
            <CheckoutOrderSummary
              items={items}
              cartTotal={cartTotal}
              selectedShippingMethod={selectedShippingMethod}
              shippingCost={shippingCost}
              totalWithShipping={totalWithShipping}
              selectedPaymentCode={selectedPaymentCode}
              isSubmitting={isLoading}
              methodsLoading={methodsLoading}
              submitError={validationError ?? error}
            />
          </div>
        </div>
      </form>

      {priceChanges && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold">Precios actualizados</h2>
              <p className="text-sm text-gray-500 mt-1">
                Estos productos cambiaron de precio desde que los agregaste al carrito.
              </p>
            </div>
            <ul className="space-y-2">
              {priceChanges.map((change) => (
                <li
                  key={change.variantId}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                >
                  <span className="font-medium text-gray-800">{change.name}</span>
                  <span className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-gray-400 line-through">
                      ${change.oldPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={
                        change.newPrice > change.oldPrice
                          ? "font-semibold text-red-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      ${change.newPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600">
              ¿Confirmás el pedido con los precios actualizados?
            </p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={dismissPriceChanges}
                className="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPriceChanges}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? "Procesando…" : "Confirmar nuevos precios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
