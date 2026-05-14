# Architecture

Deeper architectural notes for [mdrtech.ca](https://www.mdrtech.ca). The top-level [README](../README.md) has the high-level pitch; this document covers how the pieces actually fit together and the reasoning behind the choices.

---

## Overview

The site is a serverless, fully managed AWS deployment of a small React single-page application with one lightweight HTTP API (visitor counter). Every piece is defined as Terraform and deployed through GitHub Actions using OIDC — there are no long-lived AWS credentials anywhere in the repo or in CI.

The system has three logical tiers:

1. **Edge / CDN** — CloudFront fronts both static content and API traffic, terminating TLS and applying response-header policies.
2. **Static site** — A React/Vite build served from a private S3 bucket. CloudFront reaches it via Origin Access Control (OAC).
3. **Dynamic API** — API Gateway (HTTP API) → Lambda → DynamoDB for the visitor counter.

```
┌─────────────────┐
│     Browser     │
└────────┬────────┘
         │ HTTPS (TLS via ACM)
         ▼
┌─────────────────────────────────────────────┐
│              CloudFront (CDN)                │
│  + Response Headers Policy (HSTS, X-Frame…) │
└──────┬─────────────────────────┬────────────┘
       │                         │
       │ /*                      │ /api/*
       ▼                         ▼
┌──────────────┐        ┌────────────────────┐
│  S3 (private)│        │  API Gateway       │
│  React build │        │  HTTP API          │
└──────────────┘        └────────┬───────────┘
                                 │
                                 ▼
                        ┌────────────────────┐
                        │   Lambda           │
                        │   visit-counter    │
                        └────────┬───────────┘
                                 │
                                 ▼
                        ┌────────────────────┐
                        │   DynamoDB         │
                        │   visits + seen    │
                        └────────────────────┘
```

CloudFront is the single public entry point. Direct S3 access is blocked at the bucket level — visitors only reach the bucket via the OAC. Direct API Gateway URLs technically exist but the site issues requests to its own origin (`/api/...`), so the invoke URL stays out of the page source.

---

## Request flows

### Static page load

1. Browser requests `https://www.mdrtech.ca/`.
2. Route 53 resolves to the CloudFront distribution.
3. CloudFront serves `index.html` from the S3 origin (cached at the edge).
4. The React bundle hydrates and the React Router takes over client-side navigation. Subsequent route changes (`/projects`, `/posts/...`) are handled in-browser without further requests.
5. CloudFront's "default root object" + a custom error response for `403/404 → /index.html` keep deep-link reloads working (so refreshing on `/projects/foo` doesn't 404).

### API call (visitor counter)

1. On mount, `VisitorCounter` reads or generates a UUID in `localStorage`.
2. The component POSTs the UUID to `/api/visit` (same origin → CloudFront).
3. CloudFront forwards `/api/*` to the API Gateway origin.
4. API Gateway invokes the Lambda function.
5. Lambda checks the `seen` DynamoDB table for the UUID:
   - If new, it `PutItem`s the UUID and atomically `UpdateItem`s the counter in the `visits` table.
   - If seen, it just returns the current count.
6. Lambda returns the count as JSON. The component renders it.

The browser stores the UUID so re-visits from the same device aren't counted. This is a deliberately weak "unique visitor" definition — it's a fun stat, not analytics. There's no PII captured.

---

## Component reference

### Frontend (`frontend/`)

- **Framework**: React 18 + React Router v6, scaffolded with Vite.
- **Markdown**: `react-markdown` + `remark-gfm` + `rehype-raw` for post/project content rendering.
- **SEO**: `react-helmet-async` driving per-page title/description and Open Graph tags via the `SEO` component.
- **Content**: posts and projects currently live in `frontend/src/data/posts.js` and `projects.js` as object arrays (planned migration to per-file markdown — see `frontend/design-review.md`).
- **Dev proxy**: `vite.config.js` proxies `/api/*` to the API Gateway invoke URL so local `npm run dev` exercises the real backend. Override with `VITE_API_TARGET` in `.env.local`.

### Edge / CDN (`infra/frontend/`)

- **CloudFront distribution** with one origin (private S3) and a Response Headers Policy applying:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection`
  - `Referrer-Policy`
  - `Permissions-Policy`
- **TLS** via ACM certificate (`us-east-1`, as required by CloudFront).
- **OAC** restricts S3 access to the distribution only.
- **403/404 → /index.html (200)** error responses to support client-side routing.
- **CloudFront access logging** to a dedicated logging bucket.

### Backend / API (`infra/backend/`)

- **API Gateway HTTP API**: cheaper and simpler than REST API; CORS handled by the gateway, logs to CloudWatch.
- **Lambda**: Node.js handler, packaged from `infra/backend/build/`. IAM role scoped to `GetItem`/`UpdateItem` on the visits table and `PutItem` on the seen table — that's it.
- **DynamoDB tables**:
  - `mdrtech-site-visits` — a single counter item, hash key `pk` (string).
  - `mdrtech-visitor-seen` — one item per visitor UUID. Point-in-time recovery enabled.
  - Both tables use on-demand (PAY_PER_REQUEST) billing.
- **CloudWatch alarms** on Lambda errors and API Gateway 5XX responses.
- **Log groups** with 14-day retention.

### Global (`infra/global/`)

Shared resources that span the other stacks:

- Route 53 hosted zone records (`mdrtech.ca`, `www.mdrtech.ca`).
- ACM TLS certificate (in `us-east-1`, validated via DNS).

### State (`infra/state/`)

Terraform's own state backend: an S3 bucket with versioning + a DynamoDB lock table. Each of the other stacks (`frontend`, `backend`, `global`) keeps state here under a distinct key so they can be applied independently.

---

## Deployment pipeline

Everything ships through GitHub Actions. The active workflow is `.github/workflows/deploy-frontend.yml`. The infrastructure stacks are applied with Terraform locally for now (room to add a `deploy-infra.yml` later).

### Frontend deploy

On push to the deployment branch:

1. Checkout + Node setup.
2. `npm ci && npm run build` in `frontend/`.
3. Configure AWS credentials by assuming an IAM role via **GitHub OIDC**. No static AWS keys.
4. `aws s3 sync` the `dist/` directory to the static-site bucket.
5. `aws cloudfront create-invalidation` to flush the edge cache for the changed paths.

### Why OIDC

The alternative was long-lived `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` GitHub secrets. OIDC trades that for a per-job federated token, scoped to a specific repo and branch via the role's trust policy. It's the current best-practice pattern and the right thing to demo on a portfolio site.

---

## Design decisions

### Why CloudFront instead of Amplify or Netlify

Full control over caching policies, response-header policies, error responses, logging, and OAC. Amplify/Netlify abstract those away. The trade-off is more infrastructure to define — which is the whole point of the exercise.

### Why DynamoDB instead of RDS / Aurora

A relational database is overkill for two-key lookups. DynamoDB on-demand has no idle cost and scales to zero traffic, which matters for a portfolio site that mostly idles. The counter logic is naturally key/value.

### Why Terraform instead of CDK or CloudFormation

Terraform's state model and provider ecosystem are familiar territory and keep the work portable beyond AWS. CDK is great but would lock the project into a Node toolchain just for IaC, and CloudFormation is verbose to author.

### Why HTTP API (v2) instead of REST API (v1)

Cheaper, faster cold path, JWT auth built in, and CORS is a first-class config. The visitor counter doesn't need any v1-only feature.

### Why split infra into three Terraform stacks

`global` rarely changes (DNS, ACM). `frontend` changes when CDN behaviour changes. `backend` changes when the API changes. Keeping them separate means a typo in the backend Terraform can't ruin DNS, and Lambda deploys don't need to reload the CloudFront distribution into state.

---

## Security posture

Documented in `infra/README.md`; summary of what's in place:

- S3 Block Public Access on all buckets.
- CloudFront Origin Access Control (OAC) — bucket policy only allows the distribution.
- ACM-issued TLS with HSTS enforced via response-header policy.
- IAM scoped per service to specific resources (Lambda touches exactly two tables, no `*`).
- GitHub OIDC federation for CI, no static credentials.
- Gitleaks pre-commit scanning configured in `.gitleaks.toml`.
- CloudFront access logs + Lambda + API Gateway logs to CloudWatch with retention.

What's intentionally not done yet, because it's a portfolio site:

- WAF (cost vs. benefit on a low-traffic personal site).
- Multi-region failover (single-region in `ca-central-1` plus the CF distribution).
- Secrets Manager integration (no secrets in the running services).

---

## Future improvements

Pulled from the top-level README plus what's emerged from the review in `frontend/design-review.md`:

- Contact form backed by SES (or a small Lambda → SES handler).
- Sitemap and robots.txt generated at build time from the posts/projects data.
- WAF in front of CloudFront if the site picks up unwanted traffic.
- Expanded infrastructure diagrams (per-stack with resource-level callouts).
- A `deploy-infra.yml` workflow that runs `terraform plan` on PRs and `apply` on merge, gated by branch protection.

---

_Last updated: 2026-05-12._
