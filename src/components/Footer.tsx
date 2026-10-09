import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-space-elevated/80 py-10 text-center backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="inline-flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
          © 2026 Delaram Moradi · Built with
          <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-label="love" />
          in Lovable.
        </p>
      </div>
    </footer>
  );
}
