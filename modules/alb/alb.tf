resource "aws_lb" "this" {
  name               = local.alb_name
  internal           = false # tfsec:ignore:AWS005
  load_balancer_type = "application"
  security_groups    = [var.lb_sg]
  subnets            = var.lb_subnets
  enable_http2       = true
  ip_address_type    = "dualstack"
  enable_deletion_protection = var.env == "prod"

  access_logs {
    enabled = var.logs_enabled
    bucket  = aws_s3_bucket.logs[0].id
    prefix  = var.logs_prefix
  }

  tags = local.common_tags
}

resource "aws_lb_listener" "default_80" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      status_code = "HTTP_301"
      protocol    = "HTTPS"
      port        = 443
    }
  }
}

resource "aws_lb_listener" "default_app_443" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = var.lb_ssl_policy
  certificate_arn   = data.aws_acm_certificate.issued.arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Access denied"
      status_code  = "403"
    }
  }
}
