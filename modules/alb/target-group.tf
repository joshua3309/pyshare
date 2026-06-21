resource "aws_lb_target_group" "posts" {
  name        = "posts-tg"
  port        = var.port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "threads" {
  name        = "threads-tg"
  port        = var.port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_target_group" "users" {
  name        = "users-tg"
  port        = var.port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}