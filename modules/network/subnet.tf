resource "aws_subnet" "public" {
  count                    = length(var.public_subnet_cidrs)

  vpc_id                   = aws_vpc.main.id
  cidr_block               = var.public_subnet_cidrs[count.index]
  availability_zone        = var.availability_zones[count.index % length(var.availability_zones)]
  map_public_ip_on_launch  = true 

  tags          = merge (local.common_tags, {
    Name        = "${var.env}-${var.project}-public-${count.index + 1}"
    Tier        = "public"
    Environment = var.env
  })
}

resource "aws_subnet" "private" {
  count                    = length(var.private_subnet_cidrs)

  vpc_id                   = aws_vpc.main.id
  cidr_block               = var.private_subnet_cidrs[count.index]
  availability_zone        = var.availability_zones[count.index % length(var.availability_zones)]
  map_public_ip_on_launch  = true 

  tags          = merge (local.common_tags, {
    Name        = "${var.env}-${var.project}-private-${count.index + 1}"
    Tier        = "private"
    Environment = var.env
  })
}

resource "aws_subnet" "db_private" {
  count                    = length(var.db_private_subnet_cidrs)

  vpc_id                   = aws_vpc.main.id
  cidr_block               = var.db_private_subnet_cidrs[count.index]
  availability_zone        = var.availability_zones[count.index % length(var.availability_zones)]
  map_public_ip_on_launch  = true 

  tags          = merge (local.common_tags, {
    Name        = "${var.env}-${var.project}-db_private-${count.index + 1}"
    Tier        = "db_private"
    Environment = var.env
  })
}