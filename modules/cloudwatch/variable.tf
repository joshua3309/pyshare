variable "app_name" {
  type = string
}

variable "alarm_sns_topic_name" {
}

variable "log_streams" {
  type    = list(string)
  default = null
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "alarm_sns_topic_arn" {
  type = string
}