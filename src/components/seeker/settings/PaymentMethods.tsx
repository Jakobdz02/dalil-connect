import { useState } from "react";
import {
  CreditCard,
  Landmark,
  Wallet,
  Trash2,
  Star,
  Plus,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import type { PaymentMethod, PaymentMethodType } from "@/types/payment";
import { AddPaymentModal } from "./AddPaymentModal";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

function MethodIcon({ type }: { type: PaymentMethodType }) {
  switch (type) {
    case "cib":
      return (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#1565C01a", color: "#1565C0" }}
        >
          <Landmark className="h-5 w-5" />
        </div>
      );
    case "dahabia":
      return (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#FFD54F33", color: "#B8860B" }}
        >
          <Wallet className="h-5 w-5" />
        </div>
      );
    case "paypal":
      return (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg font-bold italic"
          style={{ backgroundColor: "#0030871a", color: "#003087" }}
        >
          P
        </div>
      );
    case "visa":
      return (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-extrabold italic"
          style={{ backgroundColor: "#1A1F711a", color: "#1A1F71" }}
        >
          VISA
        </div>
      );
    case "mastercard":
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <span className="relative inline-flex">
            <span className="block h-4 w-4 rounded-full" style={{ backgroundColor: "#EB001B" }} />
            <span
              className="-ml-2 block h-4 w-4 rounded-full opacity-90"
              style={{ backgroundColor: "#F79E1B" }}
            />
          </span>
        </div>
      );
  }
}

function MethodCard({
  method,
  onDelete,
  onSetDefault,
}: {
  method: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  const { t } = useI18n();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const display = method.lastFour
    ? `**** **** **** ${method.lastFour}`
    : method.accountNumber ?? method.email ?? "";

  return (
    <div
      className={`group relative rounded-xl border bg-card p-4 transition-all hover:shadow-warm ${
        method.isDefault
          ? "border-accent shadow-warm"
          : "border-border hover:border-primary/50"
      }`}
    >
      {method.isDefault && (
        <div className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
          <Star className="h-3 w-3 fill-accent" />
          {t("payments.default")}
        </div>
      )}

      <div className="flex items-start gap-3">
        <MethodIcon type={method.type} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg leading-tight">{method.label}</div>
          <div className="mt-1 font-mono text-sm tracking-wider text-muted-foreground" dir="ltr">
            {display}
          </div>
          {method.expiryDate && (
            <div className="mt-1 text-xs text-muted-foreground">
              {t("payments.expires")} <span dir="ltr">{method.expiryDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {!method.isDefault && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSetDefault(method.id)}
            className="text-primary hover:bg-primary-soft"
          >
            {t("payments.setDefault")}
          </Button>
        )}
        {method.isDefault ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button size="sm" variant="ghost" disabled className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                    {t("payments.delete")}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t("payments.deleteBlocked")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirmOpen(true)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            {t("payments.delete")}
          </Button>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("payments.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("payments.deleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("payments.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(method.id);
                toast.success(t("payments.deleted"));
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("payments.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function PaymentMethods() {
  const { methods, addMethod, removeMethod, setDefault, isLoading } = usePaymentMethods();
  const [open, setOpen] = useState(false);

  return (
    <section dir="rtl" className="space-y-4">
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">طرق الدفع</h2>
          <p className="text-sm text-muted-foreground">إدارة وسائل الدفع الخاصة بك</p>
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          جاري التحميل…
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map((m) => (
            <MethodCard
              key={m.id}
              method={m}
              onDelete={removeMethod}
              onSetDefault={setDefault}
            />
          ))}
        </div>
      )}

      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full border-dashed border-primary/40 text-primary hover:bg-primary-soft"
      >
        <Plus className="h-4 w-4" />
        إضافة طريقة دفع جديدة
      </Button>

      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">مدفوعاتك محمية بالكامل</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            تشفير AES-256 · متوافق مع PCI-DSS
          </div>
        </div>
      </div>

      <AddPaymentModal open={open} onOpenChange={setOpen} onAdd={addMethod} />
    </section>
  );
}
