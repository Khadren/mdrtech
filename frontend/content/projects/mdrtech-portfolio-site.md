---
title: "MDR Tech Portfolio Site"
slug: mdrtech-portfolio-site
summary: "Personal portfolio site built with React and deployed on AWS using Terraform and GitHub Actions."
status: published
featured: true
---

### Overview

Originally started as an attempt at the Cloud Resume Challenge, but quickly evolved into my personal portfolio site and a place to experiment with infrastructure.

The goal was to build something simple but structured like a real production system.

### Architecture

Frontend
- React (Vite)
- React Router
- Static assets hosted in S3

Infrastructure
- CloudFront CDN
- Route53 DNS
- ACM TLS certificates

Backend
- API Gateway
- Lambda
- DynamoDB

### Infrastructure as Code

All infrastructure is provisioned with Terraform.

The project includes:

- CloudFront distributions
- S3 hosting buckets
- IAM roles and policies
- DynamoDB tables
- Lambda functions
- CloudWatch alarms

### CI/CD

Deployment is handled through GitHub Actions using OIDC authentication with AWS.

Pipeline steps:

1. Build frontend with Vite
2. Assume AWS role via OIDC
3. Upload artifacts to S3
4. Invalidate CloudFront cache

### Why this project exists

This site acts as both my portfolio and a sandbox for experimenting with infrastructure, automation, and frontend tooling.
