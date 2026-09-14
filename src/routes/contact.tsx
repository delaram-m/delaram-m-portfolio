import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Github } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Delaram Moradi" },
      { name: "description", content: "Get in touch with Delaram Moradi via social links and email." },
      { property: "og:title", content: "Contact — Delaram Moradi" },
      { property: "og:description", content: "Get in touch with Delaram Moradi via social links and email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const socialLinks = [
  {
    name: "LinkedIn",
    handle: "linkedin.com/in/yourprofile",
    href: "https://linkedin.com/in/yourprofile",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    handle: "github.com/yourusername",
    href: "https://github.com/yourusername",
    icon: Github,
  },
];

function ContactPage() {
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Contact
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
          Connection channels
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card/90 p-5 text-left transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="inline-flex rounded-xl bg-primary/15 p-3 text-primary transition-colors group-hover:bg-primary/25">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground">{link.name}</h2>
                  <p className="truncate text-sm text-muted-foreground">{link.handle}</p>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}
