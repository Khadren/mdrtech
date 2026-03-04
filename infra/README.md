# Infrastructure & Backend

All infrastructure is provisioned and managed using **Terraform**.

Major resources provisioned include:

- S3 static site bucket
- CloudFront distribution
- CloudFront Origin Access Control (OAC)
- Route53 DNS records
- ACM TLS certificate
- API Gateway (HTTP API)
- Lambda functions
- DynamoDB tables
- IAM roles and policies
- CloudWatch alarms
- CloudFront logging bucket

---

# CI/CD

Deployment is automated through **GitHub Actions using OIDC federation with AWS**.

Pipeline steps:

1. Build the frontend using Vite
2. Assume an AWS IAM role via OIDC
3. Upload build artifacts to S3
4. Invalidate CloudFront cache

This avoids storing static AWS credentials in the repository.

---

# Security

Several baseline security controls are implemented.

## Infrastructure

- S3 Block Public Access
- CloudFront Origin Access Control (OAC)
- TLS enforced using ACM certificates
- IAM roles scoped to least privilege where practical

## Deployment

- GitHub OIDC federation for AWS authentication
- No static AWS credentials stored in the repository
- Secret scanning enabled via Gitleaks

## Web Security Headers

Configured through a **CloudFront Response Headers Policy**.

Headers include:

- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

---

# Observability

The stack includes basic monitoring and logging.

## Logging

- CloudFront access logs
- Lambda logs via CloudWatch
- API Gateway logs

## Monitoring

CloudWatch alarms for:

- Lambda errors
- API Gateway 5XX responses

---

# Visitor Counter

The visitor counter demonstrates a minimal backend architecture.

## Flow

1. Browser generates a unique visitor ID stored in `localStorage`
2. Client sends visitor ID to `/api/visit`
3. Lambda:
   - checks if visitor ID already exists
   - increments the counter for new visitors
4. DynamoDB stores:
   - visitor records
   - total visit count

---

## Terraform Variables

Terraform variables are provided through local `.tfvars` files or environment variables.

Example:

cp example.tfvars terraform.tfvars

Edit the file with environment-specific values before running Terraform.