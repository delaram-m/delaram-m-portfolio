import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { getRepoReadmeMedia } from "@/lib/repoImage.functions";
import { SkillFilter } from "@/components/SkillFilter";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Delaram Moradi" },
      { name: "description", content: "Portfolio of projects and creative work by Delaram Moradi." },
      { property: "og:title", content: "Projects — Delaram Moradi" },
      { property: "og:description", content: "Portfolio of projects and creative work by Delaram Moradi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  skills: string[];
  title: string;
  description: string;
  repoUrl: string;
};

const projects: Project[] = [
  {
    skills: ["Database", "SQL", "Python"],
    title: "Library Database",
    description: "Design and implementation of a relational database for a public library's catalogue and circulation data ",
    repoUrl: "https://github.com/Delaram-M/library-database",
  },
  {
    skills: ["Data Querying", "Data Analysis", "SQL"],
    title: "Digital Media Store Analysis",
    description:
      "Addressing key business questions regarding a media store's sales covering revenue, customer spending, and employee performance ",
    repoUrl: "https://github.com/Delaram-M/digital-media-store-analysis",
  },
  {
    skills: ["Data Visualization", "Data Analysis", "Power BI"],
    title: "Coffee Vending Machine Sales Report",
    description: "Addressing key business questions covering product performance, refill timing, and marketing campaign focus areas",
    repoUrl: "https://github.com/Delaram-M/coffee-vending-machine-sales-report",
  },
  {
    skills: ["Data Analysis", "Data Visualization", "Excel"],
    title: "Video Game Sales Analysis",
    description: "Addressing key business questions covering sales tier classification, genre efficiency, and regional sales correlations",
    repoUrl: "https://github.com/Delaram-M/video-game-sales-analysis",
  },
  {
    skills: ["Data Science", "Machine Learning", "Python"],
    title: "Precipitation Forecasting Using Climate Data",
    description:
      "Preprocessed, visualized, and trained models on climate data and evaluated model's performance in collaboration with team members",
    repoUrl: "",
  },
];

function ProjectsPage() {
  const allSkills = useMemo(() => [...new Set(projects.flatMap((p) => p.skills))], []);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(allSkills));

  const toggleSkill = (skill: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const setAllSkills = (selectAll: boolean) => {
    setSelected(selectAll ? new Set(allSkills) : new Set());
  };


  const visibleProjects = projects.filter((p) => p.skills.some((s) => selected.has(s)));

  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Projects</h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">Highlight of my technical projects</p>
        </header>

        <SkillFilter skills={allSkills} selected={selected} onToggle={toggleSkill} onSetAll={setAllSkills} />

        <div className="space-y-10">
          {visibleProjects.map((project) => (
            <ProjectPlaceholder
              key={project.title}
              {...project}
              reverse={projects.indexOf(project) % 2 === 1}
            />
          ))}
          {visibleProjects.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No projects match the selected skills. Turn a skill back on to see projects.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectPlaceholder({
  skills,
  title,
  description,
  repoUrl = "https://github.com/yourusername",
  reverse = false,
  showRepoLink = true,
  imageAlt = "",
}: {
  skills: string[];
  title: string;
  description: string;
  repoUrl?: string;
  reverse?: boolean;
  showRepoLink?: boolean;
  imageAlt?: string;
}) {
  const isRealRepo = repoUrl.includes("github.com/") && !repoUrl.includes("yourusername");
  const fetchMedia = useServerFn(getRepoReadmeMedia);
  const { data: media, isFetched } = useQuery({
    queryKey: ["repo-readme-media", repoUrl],
    queryFn: () => fetchMedia({ data: { repoUrl } }),
    enabled: isRealRepo,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
  const imageUrl = media?.url;
  const repoPath = isRealRepo
    ? repoUrl
        .replace(/^https?:\/\/(www\.)?github\.com\//, "")
        .replace(/\.git$/, "")
        .replace(/\/+$/, "")
    : "";
  const repoPreviewUrl =
    isFetched && !imageUrl && repoPath ? `https://opengraph.githubassets.com/1/${repoPath}` : null;

  return (
    <article
      className={`group grid overflow-hidden rounded-2xl border border-border bg-card/90 transition-all hover:border-horizon/60 hover:shadow-lg hover:shadow-horizon/10 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div className="flex min-h-60 items-center justify-center bg-gradient-to-br from-horizon/25 via-primary/15 to-nebula/20 md:min-h-72">
        {imageUrl && media?.kind === "pdf" ? (
          <iframe
            src={`${imageUrl}#view=FitH&toolbar=0`}
            title={imageAlt || `${title} document preview`}
            className="h-72 w-full"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || `${title} preview from repository README`}
            className="max-h-72 w-full object-contain p-4"
            loading="lazy"
          />
        ) : repoPreviewUrl ? (
          <img
            src={repoPreviewUrl}
            alt={`${title} GitHub repository preview`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <FolderOpen
            className="h-10 w-10 text-muted-foreground/50 transition-colors group-hover:text-primary/70"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-9">
        <div className="mb-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <p
              key={skill}
              className="w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary"
            >
              {skill}
            </p>
          ))}
        </div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {showRepoLink && repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-horizon transition-colors hover:text-horizon/70"
          >
            Repository
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
