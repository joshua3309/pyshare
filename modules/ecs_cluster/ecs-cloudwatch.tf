resource "aws_cloudwatch_log_group" "ecs_cloudwatch" {
  name = "${var.env}-${var.project}-ecs_cloudwatch-log-group"
}