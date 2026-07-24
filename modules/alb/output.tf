output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "listener_443_arn" {
  value = aws_lb_listener.default_app_443.arn
}

output "arn_suffix" {
  value = aws_lb.this.arn_suffix
}

output "target_groups" {
  description = "Target groups by service"

  value = {
    user = {
      arn        = aws_lb_target_group.user.arn
      arn_suffix = aws_lb_target_group.user.arn_suffix
      name       = aws_lb_target_group.user.name
    }

    admin = {
      arn        = aws_lb_target_group.admin.arn
      arn_suffix = aws_lb_target_group.admin.arn_suffix
      name       = aws_lb_target_group.admin.name
    }

    web = {
      arn        = aws_lb_target_group.web.arn
      arn_suffix = aws_lb_target_group.web.arn_suffix
      name       = aws_lb_target_group.web.name
    }

    auth = {
      arn        = aws_lb_target_group.auth.arn
      arn_suffix = aws_lb_target_group.auth.arn_suffix
      name       = aws_lb_target_group.auth.name
    }

    payment = {
      arn        = aws_lb_target_group.payment.arn
      arn_suffix = aws_lb_target_group.payment.arn_suffix
      name       = aws_lb_target_group.payment.name
    }

    transaction = {
      arn        = aws_lb_target_group.transaction.arn
      arn_suffix = aws_lb_target_group.transaction.arn_suffix
      name       = aws_lb_target_group.transaction.name
    }

    wallet = {
      arn        = aws_lb_target_group.wallet.arn
      arn_suffix = aws_lb_target_group.wallet.arn_suffix
      name       = aws_lb_target_group.wallet.name
    }

    notification = {
      arn        = aws_lb_target_group.notification.arn
      arn_suffix = aws_lb_target_group.notification.arn_suffix
      name       = aws_lb_target_group.notification.name
    }

    billing = {
      arn        = aws_lb_target_group.billing.arn
      arn_suffix = aws_lb_target_group.billing.arn_suffix
      name       = aws_lb_target_group.billing.name
    }
  }
}

