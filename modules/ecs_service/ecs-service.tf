resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_id
  task_definition = var.task_definition_arn

  desired_count = var.desired_count

  ordered_placement_strategy {
  type  = "spread"
  field = "attribute:ecs.availability-zone"
  }

  capacity_provider_strategy {
    capacity_provider = var.capacity_provider_name
    weight            = var.capacity_provider_weight
    base              = var.capacity_provider_base
  }

  network_configuration {
    subnets          = var.subnets
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.container_name
    container_port   = var.container_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_minimum_healthy_percent = var.deployment_minimum_healthy_percent
  deployment_maximum_percent         = var.deployment_maximum_percent

  tags = var.tags

}