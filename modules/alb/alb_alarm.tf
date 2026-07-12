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

resource "aws_cloudwatch_metric_alarm" "posts_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-posts-unhealthy-hosts"
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
    TargetGroup  = aws_lb_target_group.posts.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "threads_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-posts-unhealthy-hosts"
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
    TargetGroup  = aws_lb_target_group.threads.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "users_unhealthy_hosts" {
  alarm_name          = "${var.env}-${var.project}-users-unhealthy-hosts"
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
    TargetGroup  = aws_lb_target_group.users.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "threads_high_response_time" {
  alarm_name          = "${var.env}-${var.project}threads-high-response-time"
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
    TargetGroup  = aws_lb_target_group.threads.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}


resource "aws_cloudwatch_metric_alarm" "posts_high_response_time" {
  alarm_name          = "${var.env}-${var.project}posts-high-response-time"
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
    TargetGroup  = aws_lb_target_group.posts.arn_suffix
  }

  treat_missing_data = "notBreaching"

  alarm_actions = [var.alarm_sns_topic_arn]
}


resource "aws_cloudwatch_metric_alarm" "users_high_response_time" {
  alarm_name          = "${var.env}-${var.project}users-high-response-time"
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
    TargetGroup  = aws_lb_target_group.users.arn_suffix
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