import { useEffect, useState, useCallback } from "react";
import type { PaymentMethod } from "@/types/payment";

const STORAGE_KEY = "dalil_payment_methods";

const initialMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "cib",
    label: "CIB Card",
    lastFour: "4521",
    isDefault: true,
    createdAt: new Date(),
    expiryDate: "08/27",
  },
  {
    id: "2",
    type: "dahabia",
    label: "Dahabia",
    accountNumber: "****  ****  ****  3847",
    isDefault: false,
    createdAt: new Date(),
  },
];

function load(): PaymentMethod[] {
  if (typeof window === "undefined") return initialMethods;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialMethods;
    const parsed = JSON.parse(raw) as PaymentMethod[];
    return parsed.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
  } catch {
    return initialMethods;
  }
}

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMethods(load());
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: PaymentMethod[]) => {
    setMethods(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const addMethod = useCallback(
    (method: PaymentMethod) => {
      const next = method.isDefault
        ? [...methods.map((m) => ({ ...m, isDefault: false })), method]
        : [...methods, method];
      persist(next);
    },
    [methods, persist],
  );

  const removeMethod = useCallback(
    (id: string) => {
      const target = methods.find((m) => m.id === id);
      if (!target || target.isDefault) return;
      persist(methods.filter((m) => m.id !== id));
    },
    [methods, persist],
  );

  const setDefault = useCallback(
    (id: string) => {
      persist(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    },
    [methods, persist],
  );

  const defaultMethod = methods.find((m) => m.isDefault) ?? null;

  return { methods, defaultMethod, addMethod, removeMethod, setDefault, isLoading };
}
