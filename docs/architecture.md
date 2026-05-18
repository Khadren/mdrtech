# Architecture

Deeper architectural notes for [mdrtech.ca](https://www.mdrtech.ca). The top-level [README](../README.md) has the high-level pitch; this document covers how the pieces actually fit together and the reasoning behind the choices.

---

## Overview

The site is a serverless, fully managed AWS deployment of a small React single-page application with one lightweight HTTP API (visit notifier). Every piece is defined as Terraform and deployed through GitHub Actions using OIDC — there are no long-lived AWS credentials anywhere in the repo or in CI.

The system has three logical tiers:

1. **Edge / CDN** — CloudFront fronts both static content and API traffic, terminating TLS, applying response-header policies, and stamping requests with viewer-geo headers for the API path.
2. **Static site** — A React/Vite build served from a private S3 bucket. CloudFront reaches it via Origin Access Control (OAC).
3. **Dynamic API** — API Gateway (HTTP API) → Lambda → SNS for visit notifications. No persistent storage in the request path.

```
┌─────────────────┐
│     Browser     │
└────────┬────────┘
         │ HTTPS (TLS via ACM)
         ▼
┌─────────────────────────────────────────────┐
│              CloudFront (CDN)                │
│  + Response Headers Policy (HSTS, X-Frame…) │
│  + CloudFront-Viewer-* headers on /api/*    │
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
                        │   visit-notify     │
                        └────────┬───────────┘
                                 │ Publish
                                 ▼
                        ┌────────────────────┐
                        │   SNS (visits)     │
                        │   → email          │
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

### API call (visit notification)

1. On app mount, `Layout` fires a single `POST /api/visit` — fire-and-forget, no body, no identifiers, no client storage.
2. CloudFront forwards `/api/*` to the API Gateway origin using the `Managed-AllViewerAndCloudFrontHeaders-2022-06` origin request policy, which stamps the request with `CloudFront-Viewer-Country`, `CloudFront-Viewer-City`, `CloudFront-Viewer-Country-Region`, `CloudFront-Viewer-Time-Zone`, and related geo headers.
3. API Gateway invokes the Lambda function.
4. Lambda reads the viewer headers, formats a short message ("New visit to mdrtech.ca · Location: …"), and publishes to the dedicated `visits` SNS topic.
5. SNS delivers the notification by email.
6. Lambda returns `{ ok: true }`. The client ignores the response.

Data minimization is the point of this design. There is no DynamoDB, no per-visitor record anywhere, no IP address in any application data path, no cookies or localStorage on the visitor's device, and no third-party scripts. API Gateway access logs intentionally omit the source IP and retain for 3 days. The site exposes a privacy notice in the footer modal describing exactly this.

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

- **API Gateway HTTP API**: cheaper and simpler than REST API; CORS handled by the gateway, logs to CloudWatch. Access log format intentionally omits source IP.
- **Lambda**: Node.js handler, packaged from `infra/backend/build/`. IAM role scoped to `sns:Publish` on the visits topic only — no DynamoDB, no S3, no broader perms.
- **SNS topics**:
  - `mdrtech-visits` — visit notifications, with an email subscription.
  - `mdrtech-alerts` — operational alarms, with the same email subscription. Kept separate so visit pings never get mistaken for incidents.
- **CloudWatch alarms** on Lambda errors, throttles, p95 duration, and API Gateway 5XX responses. All set `treat_missing_data = "notBreaching"` so quiet periods stay OK instead of cycling through INSUFFICIENT_DATA.
- **CloudWatch dashboard** with Lambda, API Gateway, and SNS publish metrics.
- **Log groups** with 3-day retention.

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

### Why SNS-only instead of a database-backed counter

The site previously persisted unique-visitor records and an aggregate count in DynamoDB. That was a tidy demonstration of a serverless key/value pattern, but it meant the site was storing a persistent identifier (a `localStorage` UUID) on every visitor's device and an IP-derived record in API Gateway access logs. Both qualify as personal data under GDPR, UK GDPR, CCPA, and PIPEDA. The dedup table also pulled the design into ePrivacy / PECR consent territory because of the device-side identifier.

Replacing the database with an SNS publish removes everything that needs to be stored or consented to. The site no longer keeps any per-visitor record, the visitor's device gets nothing written to it, and the only personal data leaving the request scope is an approximate location inside an email I receive. That is a fairer trade for a personal portfolio than a stat in a footer.

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
- IAM scoped per service to specific resources (Lambda has `sns:Publish` on exactly one topic, no `*`).
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

_Last updated: 2026-05-17._
