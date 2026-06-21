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
    posts = {
      arn        = aws_lb_target_group.posts.arn
      arn_suffix = aws_lb_target_group.posts.arn_suffix
      name       = aws_lb_target_group.posts.name
    }

    threads = {
      arn        = aws_lb_target_group.threads.arn
      arn_suffix = aws_lb_target_group.threads.arn_suffix
      name       = aws_lb_target_group.threads.name
    }

    users = {
      arn        = aws_lb_target_group.users.arn
      arn_suffix = aws_lb_target_group.users.arn_suffix
      name       = aws_lb_target_group.users.name
    }
  }
}