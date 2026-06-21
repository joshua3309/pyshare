variable "service_name" {
  type = string
}

variable "cluster_id" {
  type = string
}

variable "task_definition_arn" {
  type = string
}

variable "desired_count" {
  type = number
}

variable "launch_type" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "target_group_arn" {
  type = string
}

variable "container_name" {
  type = string
}

variable "container_port" {
  type = number
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "capacity_provider_name" {
  type        = string
  description = "ECS capacity provider name from autoscaling module"
}