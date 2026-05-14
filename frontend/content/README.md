# Content

Posts and projects live as individual markdown files in this folder. Adding new content is "create a file, write it, push it". No more JS edits needed.

```
content/
  posts/
    2026-03-03-why-i-started-this-blog.md
    2026-01-24-building-this-site.md
  projects/
    mdrtech-portfolio-site.md
    aws-transfer-as2-architecture.md
```

## Workflow

```sh
# new post - date-prefixed filename keeps the folder sorted
$EDITOR content/posts/2026-05-12-some-clever-title.md

# new project - just a slug, no date
$EDITOR content/projects/nasuni-cleanup.md

git add . && git commit -m "post: some clever title"
git push   # GitHub Actions deploys
```

Vite picks the files up at build time via `import.meta.glob`. No imports to update, no array to edit.

## Filename conventions

**Posts** - `YYYY-MM-DD-slug.md`. The date is the publication date, shown on cards and detail pages. Date prefix is stripped to form the URL: `2026-03-03-foo.md` → `/posts/foo`.

**Projects** - `slug.md`. Projects are without date. Filename is the URL slug.

Set a different filename by, setting the slug explicitly in frontmatter (`slug: my-explicit-slug`)

## Frontmatter

Every file opens with a YAML block between two `---` lines.

### Posts

```yaml
---
title: "Post title in quotes"
summary: "One-line description shown on the index and as the meta description."
status: published
---
```

### Projects

```yaml
---
title: "Project title in quotes"
summary: "One-line description shown on cards and as the meta description."
status: published
featured: true
---
```

### Field reference

| Field | Where | Required | Notes |
|-------|-------|----------|-------|
| `title` | both | yes | Shown on cards and detail pages. |
| `summary` | both | recommended | Shown on cards and used as the SEO description. |
| `slug` | both | optional | Falls back to filename (after date prefix on posts) if omitted. |
| `status` | both | optional | `published` (default) or `draft`. |
| `date` | both | optional | Overrides filename date (posts only - projects don't use it). |
| `featured` | projects | optional | `true` to pin to Home page and the sidebar rail. |
| `tags` | both | optional | Flat array: `[aws, terraform]`. |
| `cover` | both | optional | Path to a hero image, e.g. `/images/projects/foo.webp`. |

## Featured projects

Add `featured: true` to any project you want featured on the Home page and the right-rail. Multiple projects can be featured at once.

```yaml
featured: true
```

Remove the line (or set to `false`) to drop from being featured. This is to "bump" a project as there's no date-based recency on projects.

If nothing is currently marked featured, Home falls back to showing an alphabetical project list so the page never goes empty.

## Drafts

Set `status: draft` to hide a file in production. Drafts will still render in `npm run dev`, so you can go over it locally and commit without going live.

```yaml
status: draft
```

Flip it to `published` (or remove the line) when you want to post it.

## Markdown features

Standard CommonMark + GFM (tables, strikethrough, task lists, autolinks). Raw HTML works too `rehype-raw` is enabled so you can drop the occasional `<small>` or `<span class="…">` when you need it.

ASCII diagrams should be wrapped in ``` code fences so markdown doesn't collapse the indentation.
