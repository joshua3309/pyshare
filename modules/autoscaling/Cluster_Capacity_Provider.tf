
resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = var.cluster_name

  capacity_providers = [
    aws_ecs_capacity_provider.ec2.name
  ]

  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.ec2.name
    weight            = 1
    base              = 1
  }
}