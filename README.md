# MDR Tech (formerly Cloud Resume Challenge)

Live: https://www.mdrtech.ca  
Repo: https://github.com/Khadren/mdrtech  

---

## Overview

Set out to work on the Cloud Resume Challenge, found time to pick it back up, and it eventually evolved into my personal portfolio site.

Originally this started as a way to demonstrate practical cloud architecture and infrastructure automation. Over time it has become both a portfolio and a sandbox for experimenting with AWS infrastructure, CI/CD workflows, and frontend tooling.

Documentation initially fell to the wayside since this was a personal project, but this repository is now being expanded to properly document the architecture and implementation.

The goal of the project is to keep the system simple but production-like:

- infrastructure defined as code
- automated deployments
- secure access patterns
- observable services

---

# Why This Project Exists

This project is primarily a learning and experimentation environment.

It demonstrates practical experience with:

- AWS architecture
- Infrastructure as Code
- CI/CD pipelines
- Secure cloud authentication
- Frontend performance optimization

---

# Architecture

## High-level

- **Frontend:** React (Vite), React Router
- **Hosting / CDN:** S3, CloudFront, Route 53, ACM
- **Backend:** API Gateway (HTTP API), Lambda, DynamoDB
- **CI/CD:** GitHub Actions (OIDC)
- **IaC:** Terraform

---

## Detailed

More detailed documentation can be found in:

- [Frontend](./frontend/README.md)
- [Infra / Backend](./infra/README.md)

---

## Diagram

```
User
 │
 ▼
CloudFront (CDN)
 │
 ├── S3 (React frontend)
 │
 └── API Gateway
      │
      ▼
    Lambda
      │
      ▼
   DynamoDB
```

CloudFront acts as the entry point for both static content and API traffic.

---

# Repository Structure

```
mdrtech/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   │
│   ├── public/
│   └── package.json
│
├── infra/
│   ├── backend/
│   ├── frontend/
│   └── global/
│
├── docs/
│   └── architecture.md
│
└── README.md
```

### frontend

Contains the React application and UI components.

### infra

Terraform infrastructure organized into logical stacks.

| Folder | Purpose |
|------|------|
| global | Shared resources (Route53, ACM certificates) |
| frontend | CloudFront distribution and S3 hosting |
| backend | API Gateway, Lambda functions, DynamoDB |

---

## Design Decisions

CloudFront was chosen over Amplify or Netlify to provide full control of caching policies, security headers, and infrastructure automation through Terraform.

DynamoDB was used instead of a relational database since the visitor counter requires simple key/value lookups and benefits from DynamoDB's serverless scaling model.

Terraform was chosen as the IaC tool to keep infrastructure definitions version controlled and reproducible across environments.

---
# Future Improvements

Planned additions:

- Contact form using SES
- Expanded infrastructure diagrams
