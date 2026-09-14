import { type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StarBackground } from "./StarBackground";
import { SparkleCursor } from "./SparkleCursor";

export function CosmicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="cosmic relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <StarBackground />
      <SparkleCursor />
      <Header />
      <main className="relative z-10 flex-1 pt-28">{children}</main>
      <Footer />
    </div>
  );
}
