terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
      Stack     = "frontend"
    }
  }
}

provider "aws" {
  alias  = "use1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
      Stack     = "frontend"
    }
  }
}