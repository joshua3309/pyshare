variable "ecs_optimized_ami" {
  description = "ecs ecs optimized AMI ID" 
  type        = string
  default     = "ami-02c8d3a4a8d981199"
}
variable "instance_type" {
  description = "ec2 instance type for ECS CLUSTER"
  type        = string
  default     = "t3.medium"
}

variable "key" {
  description  = ""
  default      = {
    "name"     = "terraform"
    "pub"      = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDdEffxqS3RQQMR0YyQLKWnAQEEc1ThySJWYUhLf7mhXMcgE9dpkAAV6dtNyhrobYHAD2sOh52EG95j6BnjEJXln5Td1053H8se9T2vTxyrnjNmCs0EHyPg5FCIH32YLVZ2iU/iiWaom+1+pf418ouO1HO+lbOi0jwjmUQ+zLxbYxOs1vGCtN3bzzF6tqOPgjOCX7dNr5IySCreshVZbka7IdQFDbHaoqC2HvXJ371asw7W3CbOF9Frn59orCaRneZduKo5LF7EOtx/8QkCRrueNZOAa/RakqlKbb4KfmwAbcAV9JqcWDc63wETv71+oXWLK+rlcJ3jF338hCNLGBkjY54+wMzQWaqdpvRKxOPd2KjcpaCVqZQ2D0L9pUMSbX7UtCBNM5Iczgp2kquVHWgCONrvPC+dKxxPbRVKV05hk3FfZ3qDtTHTL5HDTu1tdGJXYbWhrrcJxmnqQ3cZ92fdxy3CQ6fsr/Kwg6EoKnKwNu6gm9xqQDg809j/gO98+0M= joshua@gbriel-DESKTOP-UV4ETAU"
  }
}

variable "aws_iam_instance_profile_name" {
  type     = string
  description = ""
}

variable "security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the ECS Auto Scaling Group"
  type        = list(string)
}

variable "asg_max_size" {
  type    = number
  default = 5
}

variable "ecs_cluster_name" {
  description = "ECS cluster name"
  type        = string
}

