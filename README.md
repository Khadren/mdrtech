# MDR Tech (formerly Cloud Resume Challenge) 

Live: https://www.mdrtech.ca 
Repo: https://github.com/Khadren/mdrtech 

## Overview 

Set out to work on the Cloud Resume Challenge, found time to pick it back up and now is a personal portfolio site. Documentation fell to wayside as was a personal project. Working to correct that now. 

## Architecture 
### High-level 

- Frontend: React (Vite), React Router 
- Hosting/CDN: S3, CloudFront, Route 53, ACM 
- Backend: API Gateway, HTTP API, Lambda, DynamoDB 
- CI/CD: GitHub Actions (OIDC) 
- IaC: Terraform ### Detailed 
- [Frontend](./frontend/README.md) 
- [Infra/Backend](./infra/README.md) 

### Diagram