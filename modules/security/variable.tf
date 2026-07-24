variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "container_ports" {
  type = list(number)

  default = [
    3000, # web
    3001, # admin
    4001, # auth
    4002, # user
    4003, # payment
    4004, # transaction
    4005, # wallet
    4006, # notification
    4007  # billing
  ]
}
