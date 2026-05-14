import { PageWrapper } from "@/components/layout/PageWrapper";
import { PaymentMethods } from "@/components/seeker/settings/PaymentMethods";
import { User, Bell, ShieldCheck } from "lucide-react";

export default function SeekerProfile() {
  return (
    <PageWrapper>
      <div dir="rtl" className="mx-auto max-w-3xl space-y-10 py-10">
        <header>
          <h1 className="font-display text-4xl text-primary">إعدادات الحساب</h1>
          <p className="mt-1 text-muted-foreground">
            إدارة معلوماتك الشخصية وطرق الدفع والأمان
          </p>
        </header>

        {/* Personal info */}
        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">المعلومات الشخصية</h2>
              <p className="text-sm text-muted-foreground">
                الاسم، البريد الإلكتروني، رقم الهاتف
              </p>
            </div>
          </header>
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            قريبًا — ستتمكن من تحديث معلوماتك الشخصية من هنا.
          </div>
        </section>

        {/* Payment methods */}
        <PaymentMethods />

        {/* Security */}
        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">الأمان</h2>
              <p className="text-sm text-muted-foreground">كلمة المرور والمصادقة الثنائية</p>
            </div>
          </header>
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            قريبًا — إعدادات الأمان وكلمة المرور.
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">الإشعارات</h2>
              <p className="text-sm text-muted-foreground">تفضيلات البريد والإشعارات الفورية</p>
            </div>
          </header>
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            قريبًا — إدارة تفضيلات الإشعارات.
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
