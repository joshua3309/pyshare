# ─── PaySphere — AWS Application Load Balancer Configuration ──────────────
#
# This is a Terraform-style reference for the ALB setup.
# In production, use Terraform or CloudFormation to provision these resources.
#
# The ALB acts as the API gateway, routing requests to each microservice
# via path-based listener rules. Each service runs as an ECS service
# with its own target group.

# ─── ALB ─────────────────────────────────────────────────────────────────
resource "aws_lb" "paysphere_alb" {
  name               = "paysphere-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true
  enable_http2              = true

  tags = { Name = "paysphere-alb" }
}

# ─── HTTPS Listener (port 443) ────────────────────────────────────────────
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.paysphere_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.paysphere.arn

  default_action {
    type = "fixed-response"
    fixed_response {
      status_code = 404
      content_type = "application/json"
      message_body = '{"error":{"code":"NOT_FOUND","message":"Route not found"}}'
    }
  }
}

# ─── HTTP Listener (port 80) → redirect to HTTPS ─────────────────────────
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.paysphere_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ─── Target Groups (one per microservice) ────────────────────────────────
# Each target group health checks its service's /health endpoint.

locals {
  services = {
    auth         = { port = 4001, path = "/api/auth/*" }
    user         = { port = 4002, path = "/api/users/*" }
    payment      = { port = 4003, path = "/api/payments/*" }
    transaction  = { port = 4004, path = "/api/transactions/*" }
    wallet       = { port = 4005, path = "/api/wallet/*" }
    notification = { port = 4006, path = "/api/notifications/*" }
    billing      = { port = 4007, path = "/api/billing/*" }
  }

  # Frontend services — higher priority than API routes
  frontend_services = {
    admin = { port = 3001, path = "/admin/*" }
    web   = { port = 3000, path = "/*" }
  }
}

resource "aws_lb_target_group" "services" {
  for_each = local.services

  name        = "paysphere-${each.key}-tg"
  port        = each.value.port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.paysphere.id
  target_type = "ip"

  # Health check — ALB polls /health every 30s
  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
    path                = "/health"
  }

  stickiness {
    type            = "lb_cookie"
    duration        = 86400
    enabled         = false  # Stateless — no stickiness needed
  }

  tags = { Service = each.key }
}

# ─── Frontend Target Groups ──────────────────────────────────────────────
resource "aws_lb_target_group" "frontend" {
  for_each = local.frontend_services

  name        = "paysphere-${each.key}-tg"
  port        = each.value.port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.paysphere.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
    path                = each.key == "admin" ? "/admin" : "/"
  }

  stickiness {
    type            = "lb_cookie"
    duration        = 86400
    enabled         = false
  }

  tags = { Service = each.key }
}

# ─── Listener Rules (path-based routing) ─────────────────────────────────
# Priority order: admin (highest) → API services → web (lowest, default)
resource "aws_lb_listener_rule" "service_routing" {
  for_each = local.services

  listener_arn = aws_lb_listener.https.arn
  priority     = index(keys(local.services), each.key) + 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services[each.key].arn
  }

  condition {
    path_pattern {
      values = [each.value.path]
    }
  }
}

# ─── Frontend Listener Rules ─────────────────────────────────────────────
# Admin must have higher priority than web so /admin/* doesn't fall through to /*
resource "aws_lb_listener_rule" "admin_routing" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend["admin"].arn
  }

  condition {
    path_pattern {
      values = ["/admin/*", "/admin"]
    }
  }
}

resource "aws_lb_listener_rule" "web_routing" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend["web"].arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

# ─── Security Group for ALB ──────────────────────────────────────────────
resource "aws_security_group" "alb_sg" {
  name        = "paysphere-alb-sg"
  description = "Allow inbound HTTP/HTTPS to ALB"
  vpc_id      = aws_vpc.paysphere.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
