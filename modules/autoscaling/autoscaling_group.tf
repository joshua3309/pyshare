resource "aws_autoscaling_group" "ecs" {
  name                = "${var.env}-${var.project}-ecs-asg"
  desired_capacity    = length(var.private_subnet_ids)
  min_size            = length(var.private_subnet_ids)
  max_size            = var.asg_max_size
  vpc_zone_identifier = var.private_subnet_ids
  protect_from_scale_in =true

  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = ""
    propagate_at_launch = true
  }
  tag {
    key                 = "Environment"
    value               = var.env
    propagate_at_launch = true
  }

}