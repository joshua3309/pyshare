variable "vpc_cidr" {
  type = string
}



variable "min_capacity" {
  type    = number
  default = 1
}

variable "max_capacity" {
  type    = number
  default = 5
}

variable "cpu_target" {
  type    = number
  default = 70
}

variable "memory_target" {
  type    = number
  default = 75
}


variable "posts_image" {}

variable "posts_env_vars" {
  type = map(string)
}

variable "posts_secrets" {
  type = map(string)
}

variable "tags" {
  description = "Common tags"
  type        = map(string)

  default = {
    Environment = "prod"
    Project     = "micro-service"
  }
}

variable "posts_container_image" {
  type    = string
  default = "nginx:latest"
}

variable "threads_image" {
  type    = string
  default = "nginx:latest"
}

variable "users_image" {
  type    = string
  default = "nginx:latest"
}

variable "posts_desired_count" {
  type = number
  default = 1
}

variable "threads_desired_count" {
  type = number
  default = 1
}

variable "users_desired_count" {
  type = number
  default = 1
}