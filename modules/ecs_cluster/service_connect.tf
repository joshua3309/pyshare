resource "aws_service_discovery_http_namespace" "paysphere" {
  name        = "paysphere"
  description = "Service Connect namespace"

  tags = var.tags
}