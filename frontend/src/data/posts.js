import { parseFrontmatter } from "../lib/frontmatter";

// Vite reads every .md file under content/posts/ as raw text at build time.
// Adding a new post is just: drop a new .md file into that folder and push.
const modules = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const isDev = import.meta.env.DEV;

function slugFromPath(path) {
  const base = path.split("/").pop().replace(/\.md$/, "");
  return base.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function dateFromPath(path) {
  const base = path.split("/").pop();
  const m = base.match(/^(\d{4}-\d{2}-\d{2})-/);
  return m ? m[1] : null;
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const parsed = parseFrontmatter(raw);
    return {
      ...parsed,
      // Frontmatter wins if explicitly set — otherwise filename is the source
      // of truth for both slug and date.
      slug: parsed.slug || slugFromPath(path),
      date: parsed.date || dateFromPath(path),
    };
  })
  .filter((p) => isDev || p.status !== "draft")
  .sort((a, b) => new Date(b.date) - new Date(a.date));
