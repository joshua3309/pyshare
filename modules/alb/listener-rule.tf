resource "aws_lb_listener_rule" "home" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 6

  condition {
    path_pattern {
      values = [
        "/",
        "/*"
      ]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

resource "aws_lb_listener_rule" "web" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 7

  condition {
    path_pattern {
      values = [
        "/",
        "/*"
      ]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

resource "aws_lb_listener_rule" "admin" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 5

  condition {
    path_pattern {
      values = [
        "/admin",
        "/admin/*"
      ]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin.arn
  }
}

resource "aws_lb_listener_rule" "auth" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 10

  condition {
    path_pattern {
      values = ["/api/auth/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.auth.arn
  }
}

resource "aws_lb_listener_rule" "payment" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 11

  condition {
    path_pattern {
      values = ["/api/payments/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.payment.arn
  }
}

resource "aws_lb_listener_rule" "user" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 12

  condition {
    path_pattern {
      values = ["/api/users/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.user.arn
  }
}

resource "aws_lb_listener_rule" "transaction" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 13

  condition {
    path_pattern {
      values = ["/api/transactions/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.transaction.arn
  }
}

resource "aws_lb_listener_rule" "wallet" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 14

  condition {
    path_pattern {
      values = ["/api/wallet/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.wallet.arn
  }
}

resource "aws_lb_listener_rule" "notification" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 15

  condition {
    path_pattern {
      values = ["/api/notifications/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.notification.arn
  }
}


resource "aws_lb_listener_rule" "billing" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 16

  condition {
    path_pattern {
      values = ["/api/billing/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.billing.arn
  }
}