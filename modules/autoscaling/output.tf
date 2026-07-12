output "asg_name" {
  description = "Name of the ECS Auto Scaling Group"
  value       = aws_autoscaling_group.ecs.name
}

output "asg_arn" {
  description = "ARN of the ECS Auto Scaling Group"
  value       = aws_autoscaling_group.ecs.arn
}

output "asg_id" {
  description = "ID of the ECS Auto Scaling Group"
  value       = aws_autoscaling_group.ecs.id
}

output "capacity_provider_name" {
  description = "ECS Capacity Provider name"
  value       = aws_ecs_capacity_provider.ec2.name
}