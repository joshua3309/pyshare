output "execution_role_arn" {
  description = "ARN of the ECS Execution Role (used by all services)"
  value       = aws_iam_role.execution_role.arn
}

output "task_role_common_arn" {
  description = "ARN of the common Task Role (optional)"
  value       = aws_iam_role.task_role_common.arn
}

output "instance_profile_name" {
  value = aws_iam_instance_profile.ecs.name
}