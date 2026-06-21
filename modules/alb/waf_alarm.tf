resource "aws_cloudwatch_metric_alarm" "waf_potential_attack" {
  alarm_name          = "${local.name_prefix}-WAF-potential-attack"
  alarm_description   = "This alarm is triggered when there is a high volume of requests to be blocked by WAF for some reason - it can signify a potential attack"
  namespace   = "AWS/WAFV2"
  #  metric_name         = "CountedRequests"
  metric_name = "BlockedRequests"
  statistic   = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = 5
  datapoints_to_alarm = 1
  evaluation_periods  = 1
  period      = 300
  dimensions = {
    Region = var.region
    WebACL = aws_wafv2_web_acl.aws_managed_webacl.name
    Rule   = "ALL"
  }
  alarm_actions = [data.aws_sns_topic.alarm_topic.arn]
  tags          = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "waf_rate_subdomain" {
  for_each = { for rule in var.rate_subdomain_rules : rule.name => rule }
  alarm_name          = format("%s-%s", local.name_prefix, each.key)
  namespace           = "AWS/WAFV2"
  #  metric_name         = "CountedRequests"
  metric_name         = "BlockedRequests"
  statistic           = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = each.value.limit
  datapoints_to_alarm = 1
  evaluation_periods  = 1
  period              = 60
  treat_missing_data  = "notBreaching"
  dimensions = {
    Region = var.region
    WebACL = aws_wafv2_web_acl.aws_managed_webacl.name
    Rule   = each.key
  }
  alarm_actions = [data.aws_sns_topic.alarm_topic.arn]
  tags          = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "waf-rate-url" {
  count = length(var.rate_url_rules)

  alarm_name = format("%s-%s",
    local.name_prefix,
    var.rate_url_rules[count.index].name
  )

  namespace           = "AWS/WAFV2"
#  metric_name         = "CountedRequests"
  metric_name         = "BlockedRequests"
  statistic           = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = var.rate_url_rules[count.index].limit
  datapoints_to_alarm = 1
  evaluation_periods  = 1
  period              = 60
  treat_missing_data  = "notBreaching"

  dimensions = {
    Region = var.region
    WebACL = aws_wafv2_web_acl.aws_managed_webacl.name
    Rule   = var.rate_url_rules[count.index].name
  }
  alarm_actions = [data.aws_sns_topic.alarm_topic.arn]
  tags          = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "waf_managed-rules" {
  for_each = { for rule in var.managed_rules : rule.name => rule }
  alarm_name          = format("%s-%s", local.name_prefix, each.key)
  namespace           = "AWS/WAFV2"
  #  metric_name         = "CountedRequests"
  metric_name         = "BlockedRequests"
  statistic           = "Sum"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = each.value.limit
  datapoints_to_alarm = 1
  evaluation_periods  = 1
  period              = 60
  treat_missing_data  = "notBreaching"
  dimensions = {
    Region = var.region
    WebACL = aws_wafv2_web_acl.aws_managed_webacl.name
    Rule   = each.key
  }
  alarm_actions = [data.aws_sns_topic.alarm_topic.arn]
  tags          = local.common_tags
}