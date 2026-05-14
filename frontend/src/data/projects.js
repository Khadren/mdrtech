import { parseFrontmatter } from "../lib/frontmatter";

// One .md file per project under content/projects/. Projects are
// atemporal — sorted alphabetically by title, with featured projects
// pinned to the top of the list.
const modules = import.meta.glob("../../content/projects/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const isDev = import.meta.env.DEV;

function slugFromPath(path) {
  // Allow a legacy YYYY-MM-DD- prefix to be stripped just in case; if you
  // don't use one, this is a no-op.
  const base = path.split("/").pop().replace(/\.md$/, "");
  return base.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function compareTitle(a, b) {
  return (a.title || "").localeCompare(b.title || "", undefined, {
    sensitivity: "base",
  });
}

export const projects = Object.entries(modules)
  .map(([path, raw]) => {
    const parsed = parseFrontmatter(raw);
    return {
      ...parsed,
      slug: parsed.slug || slugFromPath(path),
      featured: parsed.featured === true,
    };
  })
  .filter((p) => isDev || p.status !== "draft")
  .sort((a, b) => {
    // Featured first, then alphabetical within each group.
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return compareTitle(a, b);
  });
