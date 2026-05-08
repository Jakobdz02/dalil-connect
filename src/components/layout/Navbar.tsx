import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { HOME_FOR_ROLE } from "@/lib/auth-redirect";

export function Navbar() {
  const { user, signOut } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl text-primary leading-none">
            DALIL <span className="text-accent text-lg align-middle">دليل</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/guides"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            Browse guides
          </Link>

          {user && role ? (
            <>
              <Link
                to={HOME_FOR_ROLE[role] as "/dashboard"}
                className="text-sm text-foreground hover:text-primary transition-colors px-2 py-1"
              >
                My space
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-foreground hover:text-primary transition-colors px-2 py-1"
              >
                Log in
              </Link>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
