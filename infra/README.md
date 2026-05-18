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
- SNS topics (operational alerts and visit notifications)
- IAM roles and policies
- CloudWatch alarms and dashboard
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

# Visit Notifications

A small, low-overhead backend that sends an email when someone visits the
site, with an approximate location derived from CloudFront viewer headers.

## Flow

1. Browser fires a single `POST /api/visit` on page load. No body, no identifiers.
2. CloudFront forwards the request to API Gateway, stamping it with
   `CloudFront-Viewer-Country`, `CloudFront-Viewer-City`, and related
   geo headers via the `AllViewerAndCloudFrontHeaders` origin request policy.
3. Lambda reads the geo headers from the request and publishes a short
   notification message to a dedicated SNS topic.
4. SNS emails the notification.

## Data minimization

- No DynamoDB. No persistent visitor records anywhere.
- No IP addresses in any application data path.
- No identifiers stored on the visitor's device (no cookies, no localStorage).
- API Gateway access logs omit the source IP and retain for 3 days.
- Only country/region/city derived from CloudFront leaves the request scope,
  inside the notification email.

A privacy notice describing exactly this is exposed in the site footer.

---

## Terraform Variables

Terraform variables are provided through local `.tfvars` files or environment variables.

Example:
`
cp example.tfvars terraform.tfvars
`
Edit the file with environment-specific values before running Terraform.
