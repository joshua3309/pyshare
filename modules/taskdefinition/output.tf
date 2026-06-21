output "task_definition_arn" {
  value = aws_ecs_task_definition.this.arn
}

output "family" {
  value = aws_ecs_task_definition.this.family
}