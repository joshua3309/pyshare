resource "aws_eip" "nat" {
  count    = var.nat_gateway_count
  domain   = "vpc"

  tags     = merge(local.common_tags, {
    Name   = "${var.env}-${var.project}-nat-eip-${count.index + 1}"
  })
}

resource "aws_nat_gateway" "main" {
  count         = var.nat_gateway_count
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(local.common_tags, {
    Name = "${var.env}-${var.project}-nat-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}