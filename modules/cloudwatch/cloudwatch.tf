resource "aws_cloudwatch_log_group" "nodejs" {
  name = local.app_name_full
  retention_in_days = 90

}

resource "aws_cloudwatch_log_metric_filter" "auth_error" {
  name           = "${local.app_name_full}-auth-error"
  pattern        = "[AUTH_ERROR]"
  log_group_name = aws_cloudwatch_log_group.nodejs.name

  metric_transformation {
    name      = "${local.app_name_full}-auth-error"
    namespace = "ApplicationLogs"
    value     = "1"
    unit      = "Count"
  }
}

resource "aws_cloudwatch_log_metric_filter" "validation_error" {
  name           = "${local.app_name_full}-validation-error"
  pattern        = "[VALIDATION_ERROR]"
  log_group_name = aws_cloudwatch_log_group.nodejs.name

  metric_transformation {
    name      = "${local.app_name_full}-validation-error"
    namespace = "ApplicationLogs"
    value     = "1"
    unit      = "Count"
  }
}

resource "aws_cloudwatch_log_metric_filter" "not_found" {
  name           = "${local.app_name_full}-not-found"
  pattern        = "[NOT_FOUND]"
  log_group_name = aws_cloudwatch_log_group.nodejs.name

  metric_transformation {
    name      = "${local.app_name_full}-not-found"
    namespace = "ApplicationLogs"
    value     = "1"
    unit      = "Count"
  }
}

resource "aws_cloudwatch_log_metric_filter" "server_error" {
  name           = "${local.app_name_full}-server-error"
  pattern        = "[SERVER_ERROR]"
  log_group_name = aws_cloudwatch_log_group.nodejs.name

  metric_transformation {
    name      = "${local.app_name_full}-server-error"
    namespace = "ApplicationLogs"
    value     = "1"
    unit      = "Count"
  }
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.env}-${var.project}"
  retention_in_days = 30

  tags = var.tags
}