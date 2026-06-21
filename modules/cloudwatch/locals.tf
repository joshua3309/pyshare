locals {
  name_prefix = format("%s-%s", var.project, var.env)
  app_name_full = "${var.env}-${var.project}-${var.app_name}"
 
  common_tags = {
    Env      = var.env
    ManageBy = "terraform"
    Project  = var.project
  }
}