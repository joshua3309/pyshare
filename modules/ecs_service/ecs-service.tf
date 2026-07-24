resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_id
  task_definition = var.task_definition_arn

  desired_count = var.desired_count

  dynamic "ordered_placement_strategy" {
    for_each = contains(["FARGATE", "FARGATE_SPOT"], upper(var.capacity_provider_name)) ? [] : [1]

    content {
      type  = "spread"
      field = "attribute:ecs.availability-zone"
    }
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

  dynamic "service_connect_configuration" {

  for_each = var.enable_service_connect ? [1] : []

  content {

    enabled = true

    namespace = var.service_connect_namespace

    service {

      port_name = var.service_connect_port_name

      discovery_name = var.service_connect_discovery_name

      dynamic "client_alias" {
        for_each = var.service_connect_dns_name != null ? [1] : []

        content {
          dns_name = var.service_connect_dns_name
          port     = var.service_connect_port
        }
      }    
    }
  }
}

  tags = var.tags

}