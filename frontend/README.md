# Frontend

This directory contains the React frontend for the MDR Tech site.

The application is built with **React and Vite** and delivered as static assets through **S3 and CloudFront**.

The frontend acts primarily as a static portfolio site, with a small API integration used to record visitor counts.

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
│ │ ├── VisitorCounter.jsx
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
| `VisitorCounter` | Displays visitor count from backend API |
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

# Visitor Counter

The site includes a small visitor counter powered by the backend API.

### Flow

1. The browser generates a unique visitor ID stored in `localStorage`
2. The frontend sends the ID to the `/api/visit` endpoint
3. Lambda validates and increments the visitor count
4. DynamoDB stores visitor and counter data
5. The API returns the current count to the frontend

Example request:
`
POST /api/visit
{
"visitorId": "uuid"
}
`

The response returns the updated count which is displayed in the UI.

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
- Lazy visitor counter API call to avoid blocking initial render

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
