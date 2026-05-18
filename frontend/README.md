# Frontend

This directory contains the React frontend for the MDR Tech site.

The application is built with **React and Vite** and delivered as static assets through **S3 and CloudFront**.

The frontend acts primarily as a static portfolio site, with a small API integration used to send a visit notification to the site owner.

---

# Detailed

A look into design decisions:

- [Design](./frontend/design-notes.md)

---

# Stack

- React
- Vite
- React Router
- React Helmet Async (SEO metadata)

---

# Structure
```
frontend/
│
├── src/
│ ├── components/
│ │ ├── Header.jsx
│ │ ├── PrivacyModal.jsx
│ │ └── SEO.jsx
│ │
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── About.jsx
│ │ └── Projects.jsx
│ │
│ ├── assets/
│ │
│ ├── Layout.jsx
│ └── main.jsx
│
├── public/
│ ├── robots.txt
│ └── sitemap.xml
│
└── package.json
```
### components

Reusable UI components.

Examples:

| Component | Purpose |
|------|------|
| `Header` | Navigation and site branding |
| `PrivacyModal` | Footer-linked privacy notice describing exactly what the visit ping does |
| `SEO` | Injects page metadata for search engines and social previews |

---

### pages

Route-level page components.

Routing is handled by **React Router**.

Example pages:

- Home
- About
- Projects

---

### assets

Static resources such as images.

These are bundled and fingerprinted by Vite during the production build.

---

# Visit Notification

The site sends a small notification to the site owner when a page is loaded.

### Flow

1. On app mount, `Layout` fires a single `POST /api/visit` (fire-and-forget, no body)
2. CloudFront stamps the request with viewer geo headers and forwards it to API Gateway
3. Lambda reads the geo headers and publishes a short message to SNS
4. SNS emails the notification

No identifiers are stored on the visitor's device. No per-visitor records are stored anywhere. A privacy notice describing this is exposed in the footer modal.

Example request:
`
POST /api/visit
`

The response is an empty `{ ok: true }` and is ignored by the client.

---

# SEO

SEO metadata is injected using **react-helmet-async**.

Each page sets:

- page title
- description
- OpenGraph metadata
- Twitter card metadata

Example:
`
<SEO title="Home" description="Personal site for cloud and infrastructure projects" />
`
---

# Performance

Several optimizations are implemented:

- Static site generation via Vite build
- Hashed assets for long-term caching
- CloudFront CDN delivery
- Brotli and gzip compression
- Lazy visit-notification API call to avoid blocking initial render

---

# Scroll Position Fix

## Issue

Posts and Projects pages display additional recent content in sidebar sections. On mobile layouts these sections stack at the bottom of the page.

When a user clicked a post or project link from this area, React Router preserved the current scroll position. This could leave the user midway down the newly loaded page, making it appear as though navigation had not occurred.

## Solution

Implemented a scroll reset on route changes.

- Created ScrollToTop.jsx
- Uses useLocation() to detect route changes
- Calls window.scrollTo(0, 0) on navigation
- Mounted globally in Layout.jsx

## Result

Navigation now resets the viewport to the top of the page, ensuring post and project content is immediately visible after route changes.

---

# Production Build

To generate the production build:
`
npm run build
`
The output is written to:
`
frontend/dist
`
These assets are uploaded to the S3 site bucket during deployment.

---

# Deployment

Deployment is handled automatically through **GitHub Actions**.

Pipeline steps:

1. Install dependencies
2. Build the Vite application
3. Upload build output to S3
4. Invalidate CloudFront cache

The pipeline only runs when files under `frontend/` change.

---

# Future Improvements

Potential future enhancements:

- Blog / content pages
- Markdown content support
