locals {
  common_tags = {
    Environment = var.env
    Project     = var.project
    ManagedBy   = "Terraform"
  }
}