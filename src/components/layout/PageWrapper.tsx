import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

export interface PageWrapperProps {
  children: ReactNode;
  showFooter?: boolean;
  fullWidth?: boolean;
}

export function PageWrapper({ children, showFooter = false, fullWidth = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        {fullWidth ? (
          children
        ) : (
          <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6")}>{children}</div>
        )}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
