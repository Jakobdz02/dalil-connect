import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useI18n, type Lang } from "@/lib/i18n";

interface Props {
  variant?: "icon" | "compact";
}

export function LanguageSwitcher({ variant = "icon" }: Props) {
  const { lang, setLang, t } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={t("nav.language")}
      >
        {variant === "icon" ? (
          <>
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{current.code}</span>
          </>
        ) : (
          <>
            <span>{current.flag}</span>
            <span className="text-xs">{current.native}</span>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>{l.flag}</span>
              <span>{l.native}</span>
            </span>
            {l.code === lang && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
