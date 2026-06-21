variable "bucket_name" {
  type        = string
  description = "state bucket name for the environment"
}
variable "table_name" {
  type   = string 
  description = "dynamo lock table name"
}