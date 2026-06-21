resource "aws_lb_listener_rule" "home" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 1

  condition {
    path_pattern {
      values = ["/"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.threads.arn
  }
}

resource "aws_lb_listener_rule" "posts" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 10

  condition {
    path_pattern {
      values = ["/api/posts/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.posts.arn
  }
}

resource "aws_lb_listener_rule" "threads" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 11

  condition {
    path_pattern {
      values = ["/api/threads/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.threads.arn
  }
}

resource "aws_lb_listener_rule" "users" {
  listener_arn = aws_lb_listener.default_app_443.arn
  priority     = 12

  condition {
    path_pattern {
      values = ["/api/users/*"]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users.arn
  }
}