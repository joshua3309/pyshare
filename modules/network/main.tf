terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.45.0"
    }
  }
}

provider "aws" {
  default_tags {
    tags = local.common_tags
  }
  region = var.region
}