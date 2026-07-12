variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "container_port" {
  description = "port the container listen on"
  type = number
  default = 3000
} 