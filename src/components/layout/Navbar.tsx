import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useProfile } from "@/hooks/useProfile";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRole } from "@/types";

type NavLink = { label: string; to: string };

export function Navbar() {
  const { user, signOut } = useAuth();
  const { role } = useRole();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const LINKS_BY_ROLE: Record<UserRole | "guest", NavLink[]> = {
    guest: [],
    seeker: [
      { label: t("nav.exploreMap"), to: "/map" },
      { label: t("nav.findGuide"), to: "/guides" },
      { label: t("nav.myBookings"), to: "/bookings" },
    ],
    guide: [
      { label: t("nav.exploreMap"), to: "/map" },
      { label: t("nav.findGuide"), to: "/guides" },
      { label: t("nav.bookings"), to: "/guide/bookings" },
    ],
    admin: [{ label: t("nav.adminPanel"), to: "/admin" }],
  };

  const links = LINKS_BY_ROLE[user && role ? role : "guest"];

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl text-primary leading-none">
            DALIL <span className="text-accent text-lg align-middle">دليل</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to as "/guides"}
              className="text-sm text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
            >
              {l.label}
            </Link>
          ))}

          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ms-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.name ?? user.email ?? "User"}
                  size="md"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">
                  {profile?.name ?? user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <UserIcon className="h-4 w-4 me-2" />
                  {t("nav.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 me-2" />
                  {t("nav.signout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 ms-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/login" })}
              >
                {t("nav.login")}
              </Button>
              <Button size="sm" onClick={() => navigate({ to: "/signup" })}>
                {t("nav.signup")}
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to as "/guides"}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground hover:bg-muted rounded-md px-3 py-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            <div className="px-3 py-1">
              <LanguageSwitcher variant="compact" />
            </div>
            <div className="border-t border-border my-2" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar
                    src={profile?.avatar_url}
                    name={profile?.name ?? user.email ?? "User"}
                    size="sm"
                  />
                  <span className="text-sm truncate">{profile?.name ?? user.email}</span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground hover:bg-muted rounded-md px-3 py-2"
                >
                  {t("nav.profile")}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-start text-sm text-foreground hover:bg-muted rounded-md px-3 py-2"
                >
                  {t("nav.signout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground hover:bg-muted rounded-md px-3 py-2"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-primary hover:bg-muted rounded-md px-3 py-2"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
