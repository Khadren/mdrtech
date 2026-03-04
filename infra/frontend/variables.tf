############################################
# Core Project Configuration
############################################

variable "project_name" {
  description = "Short name used for tagging and resource naming."
  type        = string
}

variable "region" {
  description = "Primary AWS region for frontend resources."
  type        = string
}

############################################
# Domain Configuration
############################################

variable "domain_name" {
  description = "Root domain name (e.g. mdrtech.ca)."
  type        = string
}

variable "hosted_zone_name" {
  description = "Route53 hosted zone name (must end with a dot, e.g. mdrtech.ca.)."
  type        = string
}

############################################
# GitHub OIDC Deployment
############################################

variable "github_org" {
  description = "GitHub organization name."
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name."
  type        = string
}

variable "github_branch" {
  description = "GitHub branch name."
  type        = string
}

############################################
# Backend API Integration
############################################

variable "api_gateway_domain" {
  description = "API Gateway execute-api domain (no https://, no trailing slash)."
  type        = string
}