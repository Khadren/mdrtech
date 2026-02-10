export const projects = [
  {
    slug: "cloud-resume-challenge",
    title: "Cloud Resume Challenge",
    date: "2026-01-28",
    summary: "Serverless resume site using React, S3, CloudFront, and GitHub Actions with OIDC.",
    content: `
### Overview
Started as the Cloud Resume Challenge based on the bootcamp from https://www.exampro.co/
Due to time constraints/overextending myself, morphed into personal website

### Architecture
- React (Vite)
- S3 + CloudFront
- GitHub Actions with OIDC
- Lambda + DynamoDB (visitor counter)

### Key Decisions
- OIDC over static credentials
- Private S3 origin with CloudFront OAC
    `
  },
  {
    slug: "MECM-enterprise-deployment",
    title: "Enterprise MECM Deployment",
    date: "2025-12-15",
    summary: "Designed and deployed MECM infrastructure supporting ~3,000 endpoints.",
    content: `
### Overview
Recently had to build out MECM for a client, wanted to document the process here

### Scope
- Primary site + remote DP
- SQL sizing and licensing
- AD integration

### Outcomes
- Stable client deployment
- Documented runbooks
    `
  }
];
