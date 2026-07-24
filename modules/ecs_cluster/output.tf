output "cluster_id" {
  value = aws_ecs_cluster.main.id
}

output "cluster_arn" {
  value = aws_ecs_cluster.main.arn
}

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.ecs_cloudwatch.name
}

output "service_connect_namespace_arn" {
  description = "Cloud Map HTTP namespace ARN"
  value       = aws_service_discovery_http_namespace.paysphere.arn
}

output "service_connect_namespace_name" {
  value = aws_service_discovery_http_namespace.paysphere.name
}