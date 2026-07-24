output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = aws_subnet.public[*].id
}

output "private_subnets" {
  value = aws_subnet.private[*].id
}

output "db_private_subnets" {
  value = aws_subnet.db_private[*].id
}

output "db_subnet_group_name" {
  value = aws_db_subnet_group.main.name
}

output "availability_zones" {
  value = var.availability_zones
}