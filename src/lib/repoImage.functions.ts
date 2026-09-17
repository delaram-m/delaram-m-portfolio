import { createServerFn } from "@tanstack/react-start";

type RepoMedia = { url: string; kind: "image" | "pdf" } | null;

function parseRepo(repoUrl: string) {
  try {
    const u = new URL(repoUrl);
    if (!u.hostname.endsWith("github.com")) return null;
    const [owner, repo] = u.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

const MEDIA_RE = /\.(png|jpe?g|gif|webp|svg|pdf)(\?[^\s)"']*)?$/i;

function extractFirstMedia(markdown: string): string | null {
  // Markdown images, then HTML <img src>, then plain links to media files.
  const patterns = [
    /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)/g,
    /<img[^>]+src=["']([^"']+)["']/gi,
    /\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)/g,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(markdown))) {
      const raw = m[1];
      if (!raw) continue;
      if (raw.startsWith("#")) continue;
      if (re === patterns[2] && !MEDIA_RE.test(raw)) continue;
      return raw;
    }
  }
  return null;
}

export const getRepoReadmeMedia = createServerFn({ method: "GET" })
  .inputValidator((data: { repoUrl: string }) => data)
  .handler(async ({ data }): Promise<RepoMedia> => {
    const parsed = parseRepo(data.repoUrl);
    if (!parsed) return null;
    const { owner, repo } = parsed;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3.raw",
      "User-Agent": "portfolio-site",
    };
    const token = process.env["GITHUB_API_KEY"];
    if (token && token.startsWith("gh")) headers["Authorization"] = `Bearer ${token}`;

    let markdown: string | null = null;
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (res.ok) markdown = await res.text();
    } catch {
      markdown = null;
    }

    // Fallback when the API is unavailable or rate-limited: read the raw README directly.
    if (!markdown) {
      const candidates = ["main", "master"].flatMap((branch) =>
        ["README.md", "readme.md", "README.MD"].map(
          (name) => `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`,
        ),
      );
      for (const candidate of candidates) {
        try {
          const raw = await fetch(candidate);
          if (raw.ok) {
            markdown = await raw.text();
            break;
          }
        } catch {
          // try the next candidate
        }
      }
    }

    if (!markdown) return null;

    const found = extractFirstMedia(markdown);
    if (!found) return null;

    // Resolve relative paths against the repo's default branch raw content.
    let url = found;
    if (!/^https?:\/\//i.test(url)) {
      const meta = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-site" },
      });
      const branch = meta.ok ? ((await meta.json()) as { default_branch?: string }).default_branch ?? "main" : "main";
      url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${url.replace(/^\.?\//, "")}`;
    } else if (url.includes("github.com") && url.includes("/blob/")) {
      url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }

    return { url, kind: /\.pdf(\?|$)/i.test(url) ? "pdf" : "image" };
  });
