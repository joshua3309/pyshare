# ─── PaySphere — AWS ECS Fargate Task Definitions ─────────────────────────
#
# Each microservice runs as an independent ECS Fargate service.
# Each can be scaled independently, deployed independently, and rolled back independently.
#
# Auto-scaling: CPU > 70% → add tasks (min: 2, max: 10 per service)

# ─── ECS Cluster ──────────────────────────────────────────────────────────
resource "aws_ecs_cluster" "paysphere" {
  name = "paysphere-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ─── Task Execution Role (shared by all services) ────────────────────────
resource "aws_iam_role" "ecs_task_execution" {
  name = "paysphere-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ─── CloudWatch Log Group ────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "paysphere" {
  name              = "/paysphere"
  retention_in_days = 30
}

# ─── Service Definitions ─────────────────────────────────────────────────
# Each service is defined as a separate ECS task definition + ECS service.
# This allows independent deployment and scaling.

locals {
  service_configs = {
    auth = {
      port = 4001, cpu = 256, memory = 512, min = 2, max = 6
      env = { JWT_ACCESS_SECRET = "${aws_secretsmanager_secret.jwt_secrets.arn}:JWT_ACCESS_SECRET" }
    }
    user = {
      port = 4002, cpu = 256, memory = 512, min = 2, max = 4
    }
    payment = {
      port = 4003, cpu = 512, memory = 1024, min = 2, max = 10
      env = { STRIPE_SECRET_KEY = "${aws_secretsmanager_secret.stripe.arn}:STRIPE_SECRET_KEY" }
    }
    transaction = {
      port = 4004, cpu = 256, memory = 512, min = 2, max = 4
    }
    wallet = {
      port = 4005, cpu = 256, memory = 512, min = 2, max = 6
    }
    notification = {
      port = 4006, cpu = 256, memory = 512, min = 1, max = 3
    }
    billing = {
      port = 4007, cpu = 256, memory = 512, min = 1, max = 3
    }
    # Frontend services
    web = {
      port = 3000, cpu = 256, memory = 512, min = 2, max = 4
    }
    admin = {
      port = 3001, cpu = 256, memory = 512, min = 1, max = 2
    }
  }
}

# ─── Task Definitions ────────────────────────────────────────────────────
resource "aws_ecs_task_definition" "services" {
  for_each = local.service_configs

  family                   = "paysphere-${each.key}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = each.value.cpu
  memory                   = each.value.memory
  execution_role_arn        = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name  = each.key
      image = "${aws_ecr_repository.services[each.key].repository_url}:latest"

      portMappings = [{
        containerPort = each.value.port
        protocol      = "tcp"
      }]

      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "SERVICE_NAME", value = "${each.key}-service" },
        { name = "PORT", value = tostring(each.value.port) },
        { name = "DATABASE_URL", value = "postgresql://paysphere:${random_password.db_password.result}@${aws_db_proxy.paysphere_proxy.endpoint}:5432/paysphere?schema=public" },
        { name = "JWT_ACCESS_SECRET", value = var.jwt_access_secret },
        { name = "JWT_REFRESH_SECRET", value = var.jwt_refresh_secret },
        { name = "JWT_SERVICE_SECRET", value = var.jwt_service_secret },
        { name = "SERVICE_AUTH_URL", value = "http://paysphere-alb.internal:4001" },
        { name = "SERVICE_USER_URL", value = "http://paysphere-alb.internal:4002" },
        { name = "SERVICE_PAYMENT_URL", value = "http://paysphere-alb.internal:4003" },
        { name = "SERVICE_TRANSACTION_URL", value = "http://paysphere-alb.internal:4004" },
        { name = "SERVICE_WALLET_URL", value = "http://paysphere-alb.internal:4005" },
        { name = "SERVICE_NOTIFICATION_URL", value = "http://paysphere-alb.internal:4006" },
        { name = "SERVICE_BILLING_URL", value = "http://paysphere-alb.internal:4007" },
      ]

      secrets = each.value.env != null ? [
        for k, v in each.value.env : {
          name      = k
          valueFrom = v
        }
      ] : []

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/paysphere/${each.key}"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command = ["CMD-SHELL", "wget -q --spider http://localhost:${each.value.port}/health || exit 1"]
        interval = 30
        timeout  = 5
        retries  = 3
      }
    }
  ])

  tags = { Service = each.key }
}

# ─── ECS Services ────────────────────────────────────────────────────────
resource "aws_ecs_service" "services" {
  for_each = local.service_configs

  name            = "paysphere-${each.key}"
  cluster         = aws_ecs_cluster.paysphere.id
  task_definition = aws_ecs_task_definition.services[each.key].arn
  desired_count   = each.value.min
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.services[each.key].arn
    container_name   = each.key
    container_port   = each.value.port
  }

  # Enable rolling deployments
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }

  # Ignore task definition changes in plan (managed by CI/CD)
  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  tags = { Service = each.key }
}

# ─── Auto Scaling ────────────────────────────────────────────────────────
resource "aws_appautoscaling_target" "services" {
  for_each = local.service_configs

  max_capacity       = each.value.max
  min_capacity       = each.value.min
  resource_id        = "service/${aws_ecs_cluster.paysphere.name}/${aws_ecs_service.services[each.key].name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  for_each = local.service_configs

  name               = "paysphere-${each.key}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.services[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.services[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.services[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# ─── ECR Repositories ────────────────────────────────────────────────────
resource "aws_ecr_repository" "services" {
  for_each = local.service_configs

  name                 = "paysphere/${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
