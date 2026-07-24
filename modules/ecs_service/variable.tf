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

variable "cluster_name" {
  description = "ECS cluster name"
  type        = string
}

variable "capacity_provider_weight" {
  description = "Capacity provider weight"
  type        = number
  default     = 1
}

variable "capacity_provider_base" {
  description = "Base tasks placed on this provider"
  type        = number
  default     = 0
}

variable "enable_autoscaling" {
  description = "Enable ECS service autoscaling"
  type        = bool
  default     = false
}

variable "min_capacity" {
  description = "Minimum number of tasks"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of tasks"
  type        = number
  default     = 4
}

variable "cpu_target" {
  description = "Target CPU utilization percentage"
  type        = number
  default     = 70
}

variable "memory_target" {
  description = "Target Memory utilization percentage"
  type        = number
  default     = 75
}

variable "deployment_minimum_healthy_percent" {
  description = "Minimum healthy tasks during deployment"
  type        = number
  default     = 100
}

variable "deployment_maximum_percent" {
  description = "Maximum tasks allowed during deployment"
  type        = number
  default     = 200
}

variable "enable_service_connect" {

  type    = bool

  default = false

}

variable "service_connect_namespace" {

  type = string

  default = null

}

variable "service_connect_dns_name" {

  type = string

  default = null

}

variable "service_connect_discovery_name" {

  type = string

  default = null

}

variable "service_connect_port_name" {

  type = string

  default = "http"

}

variable "service_connect_port" {

  type = number

  default = null

}

variable "launch_type" {
  description = "Launch type of the ECS service"
  type        = string
  default     = "EC2"
}