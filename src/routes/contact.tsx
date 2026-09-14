import { createFileRoute } from "@tanstack/react-router";
import { Mail, Linkedin, Github, Globe, Twitter, Instagram } from "lucide-react";

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
    name: "Email",
    handle: "your.email@example.com",
    href: "mailto:your.email@example.com",
    icon: Mail,
  },
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
  {
    name: "Website",
    handle: "yourwebsite.com",
    href: "https://yourwebsite.com",
    icon: Globe,
  },
  {
    name: "Twitter / X",
    handle: "@yourhandle",
    href: "https://twitter.com/yourhandle",
    icon: Twitter,
  },
  {
    name: "Instagram",
    handle: "@yourhandle",
    href: "https://instagram.com/yourhandle",
    icon: Instagram,
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
          Reach out through any of the channels below. Links are placeholders until real profiles are added.
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
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-5 text-left backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
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

        <div className="mt-16 rounded-2xl border border-dashed border-border bg-card/40 p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground">Prefer a message?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            A contact form can be added later. For now, email is the best way to start a conversation.
          </p>
          <a
            href="mailto:your.email@example.com"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Send an email
          </a>
        </div>
      </div>
    </div>
  );
}
