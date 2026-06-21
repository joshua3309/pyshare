locals {
  common_tags = {
    Environment = "dev"
    ManageBy    = "pre-init"
    Project     = "var.project"
  }
}