import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="relative flex h-12 items-center justify-center md:h-auto md:justify-center md:rounded-2xl md:border md:border-border md:bg-space-elevated/90 md:px-4 md:py-3 md:shadow-lg md:shadow-black/30 md:backdrop-blur-xl">
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                        active ? "w-4" : "w-0 group-hover:w-4 group-hover:opacity-80"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-space-elevated/90 text-foreground shadow-lg shadow-black/30 backdrop-blur-xl md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl border border-border bg-space-elevated/95 p-2 shadow-xl shadow-black/30 backdrop-blur-xl md:hidden">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === item.to
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
