import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Compass className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl">
                DALIL <span className="text-accent text-lg">دليل</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/60 max-w-xs">
              Connecting Algeria, one guide at a time.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Find a Guide", to: "/guides" },
              { label: "Become a Guide", to: "/signup" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", to: "/" },
              { label: "Contact", to: "/" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Privacy", to: "/" },
              { label: "Terms", to: "/" },
            ]}
          />
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">© 2024 DALIL. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin-login"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Admin
            </Link>
            <div className="inline-flex items-center rounded-full border border-white/20 text-xs overflow-hidden">
              <button className="px-3 py-1.5 bg-white/10 text-white" type="button">
                EN
              </button>
              <button className="px-3 py-1.5 text-white/70 hover:text-white" type="button">
                عربي
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-lg mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-white/70">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to as "/guides"} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
