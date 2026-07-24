output "alb_sg_id" {
  description = "Security Group ID for the ALB"
  value       = aws_security_group.alb.id
}

output "ecs_sg_id" {
  description = "Security Group ID for ECS tasks"
  value       = aws_security_group.ecs.id
}

output "alb_security_group_id" {
  description = "Alias for alb_sg_id"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "Alias for ecs_sg_id"
  value       = aws_security_group.ecs.id
}

output "rds_security_group_id" {
  description = "Alias for rds_sg_id"
  value       = aws_security_group.rds.id
}

