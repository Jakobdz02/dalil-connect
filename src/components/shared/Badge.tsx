import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "approved"
  | "rejected"
  | "default";

const variants: Record<Variant, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-primary-soft text-primary",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-muted text-muted-foreground",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  default: "bg-muted text-foreground",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wider",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
