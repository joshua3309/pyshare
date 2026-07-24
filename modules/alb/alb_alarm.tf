resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.env}-${var.project}-microservices-alb-5xx"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  tags                = local.common_tags
  region = var.region

  threshold           = var.alb_5xx_threshold
  datapoints_to_alarm = "1"
  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
  }
  treat_missing_data = "notBreaching"
  alarm_actions = [var.alarm_sns_topic_arn]
}
resource "aws_cloudwatch_metric_alarm" "target_5xx" {
  alarm_name          = "${var.env}-${var.project}-microservices-target-5xx"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = var.target_5xx_threshold
  datapoints_to_alarm = "1"
  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
  }
  treat_missing_data = "notBreaching"
  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "admin_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-admin-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.admin.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "web_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-web-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.web.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "user_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-user-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.user.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "auth_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-auth-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.auth.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "payment_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-payment-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.payment.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "transaction_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-transaction-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.transaction.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "wallet_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-wallet-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.wallet.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "billing_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-billing-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.billing.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "notification_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-notification-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.notification.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "web_high_response_time" {
  alarm_name          = "${var.env}-${var.project}web-high-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 2
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.web.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}


resource "aws_cloudwatch_metric_alarm" "auth_high_response_time" {
  alarm_name          = "${var.env}-${var.project}auth-high-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 2
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.auth.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}


resource "aws_cloudwatch_metric_alarm" "user_high_response_time" {
  alarm_name          = "${var.env}-${var.project}user-high-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 2
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.user.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "rejected_connections" {
  alarm_name          = "${var.env}-${var.project}-rejected-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "RejectedConnectionCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  datapoints_to_alarm = 1

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}