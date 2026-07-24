# Security Groups

resource "aws_security_group" "ecs" {
  name        = "ecs"
  description = "Allow traffic from ALB to ECS tasks"
  vpc_id      = var.vpc_id
  
  tags = merge(local.common_tags, {
    Name        = "${var.env}-${var.project}-ecs-sg"
    Tier        = "private"
    Environment = var.env
  })
}

resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb" {
  for_each = {
    for p in var.container_ports : tostring(p) => p
  }

  security_group_id            = aws_security_group.ecs.id
  referenced_security_group_id = aws_security_group.alb.id

  ip_protocol = "tcp"

  from_port = each.value
  to_port   = each.value

  tags = merge(local.common_tags, {
    Name = "${var.env}-${var.project}-ecs-${each.value}"
  })
}

resource "aws_security_group_rule" "ecs_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  security_group_id = aws_security_group.ecs.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_vpc_security_group_egress_rule" "ecs_outbound" {
  security_group_id = aws_security_group.ecs.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
  
  tags = merge(local.common_tags, {
    Name        = "${var.env}-${var.project}-ecs-sg-egress"
    Tier        = "private"
    Environment = var.env
  })
}

 