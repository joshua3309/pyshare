resource "aws_cloudwatch_metric_alarm" "auth-error" {
  alarm_name                = "${local.app_name_full}-auth-error"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = 1
  metric_name               = "${local.app_name_full}-auth-error"
  namespace                 = "ApplicationLogs"
  period                    = 300
  statistic                 = "Sum"
  threshold                 = 10
  treat_missing_data        = "notBreaching"
  insufficient_data_actions = []
  alarm_description         = "Triggers when authentication errors exceed threshold"
  alarm_actions             = [data.aws_sns_topic.alarm_topic.arn]
}

resource "aws_cloudwatch_metric_alarm" "validation-error" {
  alarm_name                = "${local.app_name_full}-validation-error"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = 1
  metric_name               = "${local.app_name_full}-validation-error"
  namespace                 = "ApplicationLogs"
  period                    = 300
  statistic                 = "Sum"
  threshold                 = 10
  treat_missing_data        = "notBreaching"
  insufficient_data_actions = []
  alarm_description         = "Triggers when authentication errors exceed threshold"
  alarm_actions             = [data.aws_sns_topic.alarm_topic.arn]
}

resource "aws_cloudwatch_metric_alarm" "not-found" {
  alarm_name                = "${local.app_name_full}-not-found"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = 1
  metric_name               = "${local.app_name_full}-not-found"
  namespace                 = "ApplicationLogs"
  period                    = 300
  statistic                 = "Sum"
  treat_missing_data        = "notBreaching"
  threshold                 = 10
  insufficient_data_actions = []
  alarm_description         = "Triggers when authentication errors exceed threshold"
  alarm_actions             = [data.aws_sns_topic.alarm_topic.arn]
}

resource "aws_cloudwatch_metric_alarm" "server-error" {
  alarm_name                = "${local.app_name_full}-server-error"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = 1
  metric_name               = "${local.app_name_full}-server-error"
  namespace                 = "ApplicationLogs"
  period                    = 300
  statistic                 = "Sum"
  threshold                 = 10
  treat_missing_data        = "notBreaching"
  insufficient_data_actions = []
  alarm_description         = "Triggers when authentication errors exceed threshold"
  alarm_actions             = [data.aws_sns_topic.alarm_topic.arn]
}