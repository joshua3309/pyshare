resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  assign_generated_ipv6_cidr_block = true

  tags = merge(local.common_tags, {
    Name        = "${var.env}-${var.project}-vpc"
  })
}