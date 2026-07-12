variable "family" {
  type = string
}

variable "container_name" {
  type = string
}

variable "image" {
  type = string
}

variable "container_port" {
  type = number
}

variable "cpu" {
  type = number
}

variable "memory" {
  type = number
}

variable "requires_compatibilities" {
  type = list(string)
}

variable "execution_role_arn" {
  type = string
}

variable "task_role_arn" {
  type = string
}

variable "environment_variables" {
  description = "Non-sensitive environment variables"
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = "Secrets Manager ARNs"
  type        = map(string)
  default     = {}
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "log_group_name" {
  description = "CloudWatch Log Group name"
  type        = string
}