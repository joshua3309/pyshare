variable "topic_name" {
  type        = string
  description = "sns topic name" 
}

variable "subscriptions" {
  description = "SNS topic subscriptions"

  type = map(object({
    protocol = string
    endpoint = string
  }))

  default = {}
}