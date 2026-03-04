export const projects = [
  {
    slug: "mdrtech-portfolio-site",
    title: "MDR Tech Portfolio Site",
    date: "2026-03-04",
    summary:
      "Personal portfolio site built with React and deployed on AWS using Terraform and GitHub Actions.",
    content: `
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
  `
  }
  ,{
    slug: "aws-transfer-as2-architecture",
    title: "Redesigning an AWS Transfer AS2 Architecture",
    date: "2026-03-03",
    summary:
      "Documenting a redesign of a serverless AS2 file transfer system using AWS Transfer, S3, Lambda, and enterprise storage integration.",
    content: `
  ### Overview

  Originally I was working through the architecture for replacing a legacy managed file transfer platform with a cloud-native design using AWS Transfer for AS2 at Dentsu.

  The goal was to simplify partner file exchange while maintaining strong security and auditability.

  My current goal is to plan out that same infrastructure, re-calculate costs, document everything and if costs aren't too crazy commit to a short test.

  ### Architecture Goals

  - Replace legacy MFT platform
  - Maintain secure partner file exchange
  - Integrate with enterprise storage
  - Provide monitoring and alerting

  ### Planned Architecture

  Partner → AWS Transfer (AS2)
  → S3 landing buckets
  → Lambda processing
  → Enterprise storage integration

  Outbound and inbound file flows are separated to simplify routing and error handling.

  ### Key Design Considerations

  - Certificate and key management
  - File routing logic
  - Error handling and retries
  - Monitoring and alerting with CloudWatch
  - Integration with enterprise storage platforms

  ### Status

  Currently documenting the architecture and building a proof-of-concept environment.

  A detailed write-up of the design and implementation will be added once the project is complete.
  `
  }
];
