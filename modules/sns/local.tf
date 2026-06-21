locals {
  name_prefix = "${var.env}-${var.project}"

  common_tags = {
    Env       = var.env
    ManagedBy = "terraform"
    Project   = var.project
  }
}