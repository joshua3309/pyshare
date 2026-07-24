resource "aws_ecs_cluster" "main" {
  name = "${var.env}-${var.project}-cluster"

  dynamic "service_connect_defaults" {
    for_each = var.enable_service_connect ? [1] : []

    content {
      namespace = aws_service_discovery_http_namespace.paysphere.arn
    }
  }

  configuration {
    execute_command_configuration {
      kms_key_id = aws_kms_key.ecs_kms.arn
      logging    = "OVERRIDE"

      log_configuration {
        cloud_watch_encryption_enabled = true
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs_cloudwatch.name
      }
    }
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {Environment = var.env}

}

