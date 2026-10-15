import { createFileRoute, redirect } from "@tanstack/react-router";

// The page moved from /contact to /connect so the address matches the tab name.
// Old links keep working by forwarding to the new address.
export const Route = createFileRoute("/contact")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ to: "/connect", replace: true });
  },
  component: () => null,
});
