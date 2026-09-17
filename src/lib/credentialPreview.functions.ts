import { createServerFn } from "@tanstack/react-start";

export type CredentialPreview = { url: string; kind: "image" | "pdf" } | null;

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;
const PDF_EXTENSION = /\.pdf(?:$|[?#])/i;

function isPublicWebUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();
    return (
      hostname !== "localhost" &&
      hostname !== "0.0.0.0" &&
      hostname !== "127.0.0.1" &&
      hostname !== "::1" &&
      !hostname.endsWith(".local") &&
      !/^10\./.test(hostname) &&
      !/^192\.168\./.test(hostname) &&
      !/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    );
  } catch {
    return false;
  }
}

function resolveCandidate(candidate: string, baseUrl: string) {
  try {
    const resolved = new URL(candidate.replace(/&amp;/g, "&"), baseUrl).toString();
    return isPublicWebUrl(resolved) ? resolved : null;
  } catch {
    return null;
  }
}

function extractPreviewFromHtml(html: string, pageUrl: string): CredentialPreview {
  const metadataPatterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ];

  for (const pattern of metadataPatterns) {
    const candidate = pattern.exec(html)?.[1];
    if (!candidate) continue;
    const url = resolveCandidate(candidate, pageUrl);
    if (url) return { url, kind: PDF_EXTENSION.test(url) ? "pdf" : "image" };
  }

  const linkedFile = /(?:href|src)=["']([^"']+\.(?:avif|gif|jpe?g|png|svg|webp|pdf)(?:[?#][^"']*)?)["']/i.exec(
    html,
  )?.[1];
  if (!linkedFile) return null;

  const url = resolveCandidate(linkedFile, pageUrl);
  return url ? { url, kind: PDF_EXTENSION.test(url) ? "pdf" : "image" } : null;
}

export const getCredentialPreview = createServerFn({ method: "GET" })
  .inputValidator((data: { link: string }) => data)
  .handler(async ({ data }): Promise<CredentialPreview> => {
    if (!isPublicWebUrl(data.link)) return null;

    if (PDF_EXTENSION.test(data.link)) return { url: data.link, kind: "pdf" };
    if (IMAGE_EXTENSIONS.test(data.link)) return { url: data.link, kind: "image" };

    try {
      const response = await fetch(data.link, {
        headers: { Accept: "text/html,application/pdf,image/*", "User-Agent": "portfolio-site" },
        redirect: "follow",
      });
      if (!response.ok || !isPublicWebUrl(response.url)) return null;

      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      if (contentType.includes("application/pdf")) return { url: response.url, kind: "pdf" };
      if (contentType.startsWith("image/")) return { url: response.url, kind: "image" };
      if (!contentType.includes("text/html")) return null;

      return extractPreviewFromHtml((await response.text()).slice(0, 1_000_000), response.url);
    } catch {
      return null;
    }
  });