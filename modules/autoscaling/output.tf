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