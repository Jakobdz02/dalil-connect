export type PaymentMethodType =
  | "cib"
  | "dahabia"
  | "paypal"
  | "visa"
  | "mastercard";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  lastFour?: string;
  email?: string;
  accountNumber?: string;
  isDefault: boolean;
  createdAt: Date;
  expiryDate?: string;
}

export interface PaymentState {
  methods: PaymentMethod[];
  defaultMethodId: string | null;
}
