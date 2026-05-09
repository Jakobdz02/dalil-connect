import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-2xl",
};

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: Size;
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full overflow-hidden bg-primary/10 text-primary font-semibold select-none",
        sizes[size],
        className,
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}
