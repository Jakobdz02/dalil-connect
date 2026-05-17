import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Landmark, CreditCard, Wallet, ArrowRight } from "lucide-react";
import type { PaymentMethod, PaymentMethodType } from "@/types/payment";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (method: PaymentMethod) => void;
}

const TYPE_OPTIONS: {
  type: PaymentMethodType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { type: "cib", label: "CIB", icon: <Landmark className="h-7 w-7" />, color: "#1565C0" },
  { type: "dahabia", label: "داهبية", icon: <Wallet className="h-7 w-7" />, color: "#FFD54F" },
  { type: "paypal", label: "PayPal", icon: <span className="font-bold text-2xl italic">P</span>, color: "#003087" },
  { type: "visa", label: "VISA", icon: <span className="font-extrabold italic">VISA</span>, color: "#1A1F71" },
  { type: "mastercard", label: "MC", icon: <CreditCard className="h-7 w-7" />, color: "#EB001B" },
];

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function AddPaymentModal({ open, onOpenChange, onAdd }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<PaymentMethodType | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const reset = () => {
    setStep(1);
    setType(null);
    setCardNumber("");
    setHolder("");
    setExpiry("");
    setCvv("");
    setAccountNumber("");
    setPhone("");
    setEmail("");
    setIsDefault(false);
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const isCard = type === "cib" || type === "visa" || type === "mastercard";
  const labelMap: Record<PaymentMethodType, string> = {
    cib: "CIB Card",
    dahabia: "Dahabia",
    paypal: "PayPal",
    visa: "Visa",
    mastercard: "Mastercard",
  };

  const submit = () => {
    if (!type) return;

    if (isCard) {
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length !== 16) return toast.error("رقم البطاقة يجب أن يكون 16 رقمًا");
      if (!holder.trim()) return toast.error("أدخل اسم حامل البطاقة");
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return toast.error("تاريخ الانتهاء غير صحيح");
      if (!/^\d{3,4}$/.test(cvv)) return toast.error("رمز CVV غير صحيح");
      onAdd({
        id: crypto.randomUUID(),
        type,
        label: labelMap[type],
        lastFour: digits.slice(-4),
        expiryDate: expiry,
        isDefault,
        createdAt: new Date(),
      });
    } else if (type === "dahabia") {
      const digits = accountNumber.replace(/\s/g, "");
      if (digits.length !== 16) return toast.error("رقم الحساب يجب أن يكون 16 رقمًا");
      if (!phone.trim()) return toast.error("أدخل رقم الهاتف");
      onAdd({
        id: crypto.randomUUID(),
        type,
        label: labelMap[type],
        accountNumber: `****  ****  ****  ${digits.slice(-4)}`,
        isDefault,
        createdAt: new Date(),
      });
    } else if (type === "paypal") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("بريد إلكتروني غير صالح");
      onAdd({
        id: crypto.randomUUID(),
        type,
        label: labelMap[type],
        email,
        isDefault,
        createdAt: new Date(),
      });
    }

    toast.success("تمت إضافة طريقة الدفع بنجاح");
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {step === 1 ? "اختر طريقة الدفع" : "أدخل البيانات"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {step === 1 ? "حدد الوسيلة التي تريد إضافتها" : labelMap[type!]}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid grid-cols-3 gap-3 py-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  setType(opt.type);
                  setStep(2);
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-warm"
              >
                <span style={{ color: opt.color }}>{opt.icon}</span>
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && isCard && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>رقم البطاقة</Label>
              <Input
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>اسم حامل البطاقة</Label>
              <Input value={holder} onChange={(e) => setHolder(e.target.value)} maxLength={60} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>تاريخ الانتهاء</Label>
                <Input
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && type === "dahabia" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>رقم الحساب (16 رقم)</Label>
              <Input
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>رقم الهاتف المرتبط</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213 __ ___ __ __"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {step === 2 && type === "paypal" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>البريد الإلكتروني لـ PayPal</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex items-center gap-2 py-2">
            <Checkbox
              id="default"
              checked={isDefault}
              onCheckedChange={(c) => setIsDefault(!!c)}
            />
            <Label htmlFor="default" className="cursor-pointer text-sm font-normal">
              تعيين كطريقة افتراضية
            </Label>
          </div>
        )}

        <DialogFooter className="flex-row-reverse gap-2 sm:justify-start">
          {step === 2 && (
            <>
              <Button onClick={submit} className="gap-1">
                {type === "paypal" ? "ربط الحساب" : "إضافة"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button variant="ghost" onClick={() => setStep(1)}>
                رجوع
              </Button>
            </>
          )}
          <Button variant="outline" onClick={close}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
