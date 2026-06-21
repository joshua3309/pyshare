resource "aws_route_table" "private" {
  count  = length(var.private_subnet_cidrs)
  vpc_id = aws_vpc.main.id

  dynamic "route" {
    for_each = var.nat_gateway_count > 0 ? [1] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.main[count.index % var.nat_gateway_count].id
    }
  }

  tags = merge(local.common_tags, {
    Name        = "${var.env}-${var.project}-private-rt-${count.index + 1}"
    Tier        = "private"
    Environment = var.env
  })
}

resource "aws_route_table_association" "private" {
  count          = length(var.private_subnet_cidrs)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# DB Private Route Tables (one per subnet — isolated)
resource "aws_route_table" "db_private" {
  count  = length(var.db_private_subnet_cidrs)
  vpc_id = aws_vpc.main.id

  # No internet route

  tags = merge(local.common_tags, {
    Name        = "${var.env}-${var.project}-db-private-rt-${count.index + 1}"
    Tier        = "db-private"
    Environment = var.env
  })
}

resource "aws_route_table_association" "db_private" {
  count          = length(var.db_private_subnet_cidrs)
  subnet_id      = aws_subnet.db_private[count.index].id
  route_table_id = aws_route_table.db_private[count.index].id
}