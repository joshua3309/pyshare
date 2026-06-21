data "aws_acm_certificate" "issued" {
  domain      = var.domain
  statuses    = ["ISSUED"]
  most_recent = true
}