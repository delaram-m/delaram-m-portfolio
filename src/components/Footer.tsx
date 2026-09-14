export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-space-elevated/80 py-10 text-center backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {year} Delaram Moradi. Built with Lovable.
        </p>
      </div>
    </footer>
  );
}
