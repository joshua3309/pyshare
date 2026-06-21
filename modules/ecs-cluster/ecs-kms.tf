resource "aws_kms_key" "ecs_kms" {
  description             = "aws kms key for ecs"
  deletion_window_in_days = 7
}
