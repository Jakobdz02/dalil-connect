import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function LoadingSpinner({
  size = "md",
  className,
  fullPage,
}: {
  size?: Size;
  className?: string;
  fullPage?: boolean;
}) {
  const spinner = (
    <Loader2 className={cn("animate-spin text-primary", sizes[size], className)} />
  );
  if (fullPage) {
    return <div className="flex items-center justify-center w-full py-24">{spinner}</div>;
  }
  return spinner;
}
