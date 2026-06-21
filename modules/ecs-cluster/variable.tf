variable "tags" {
  type    = map(string)
  default = {}
}

variable "capacity_provider_name" {
  description = "ECS Capacity Provider Name"
  type        = string
}