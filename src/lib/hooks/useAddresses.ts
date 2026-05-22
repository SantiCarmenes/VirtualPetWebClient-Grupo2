"use client";

import { useEffect, useState } from "react";
import * as addressService from "@/lib/services/address.service";
import type { Address } from "@/lib/types";
export function useAddresses(isLoggedIn: boolean) {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    addressService.getAddresses().then((addrs) => {
      setSavedAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) ?? addrs[0];
      if (def) setSelectedAddressId(def.id);
    }).catch(() => {});
  }, [isLoggedIn]);

  const onSelectSaved = (addr: Address | null) => {
    setSelectedAddressId(addr?.id ?? null);
  };

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId) ?? null;

  return { savedAddresses, selectedAddressId, selectedAddress, onSelectSaved };
}
