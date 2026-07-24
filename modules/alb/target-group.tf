resource "aws_lb_target_group" "web" {
  name        = "web-tg"
  port        = var.web_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "admin" {
  name        = "admin-tg"
  port        = var.admin_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/admin"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "auth" {
  name        = "auth-tg"
  port        = var.auth_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "user" {
  name        = "user-tg"
  port        = var.user_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "payment" {
  name        = "payment-tg"
  port        = var.payment_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "transaction" {
  name        = "transaction-tg"
  port        = var.transaction_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "wallet" {
  name        = "wallet-tg"
  port        = var.wallet_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "notification" {
  name        = "notification-tg"
  port        = var.notification_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "billing" {
  name        = "billing-tg"
  port        = var.billing_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}