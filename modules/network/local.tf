locals {
  name_prefix = format("%s-%s", var.project, var.env)

  common_tags = {
    Env       = var.env
    ManageBy  = "terraform"
    Project   = var.project
  }
}