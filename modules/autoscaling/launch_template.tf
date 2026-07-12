resource "aws_launch_template" "ecs" {
  name_prefix   = "${var.env}-${var.project}-ecs-"
  image_id      = var.ecs_optimized_ami
  instance_type = var.instance_type

  iam_instance_profile {
    name = var.iam_instance_profile_name
  }


  key_name = var.key.name
  depends_on = [aws_key_pair.terraform]

  network_interfaces {
    associate_public_ip_address = false
    security_groups = [var.security_group_id]
  }

  user_data = base64encode(<<-EOT
  #!/bin/bash
  echo ECS_CLUSTER=${var.cluster_name} >> /etc/ecs/ecs.config
  EOT
  )

  lifecycle {
    create_before_destroy = true
  }
}