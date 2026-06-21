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
  type = string
}

variable "memory" {
  type = string
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
  type    = map(string)
  default = {}
}

variable "secrets" {
  type    = any
  default = []
}

variable "tags" {
  type    = map(string)
  default = {}
}