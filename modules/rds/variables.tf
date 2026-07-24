variable "engine" {
  type = string 
  default = "postgres" 
}

variable "engine_version" {
  type = string 
  default = "16" 
}

variable "instance_class" {
  type = string 
  default = "db.t3.medium" 
}

variable "allocated_storage" {
  type = number 
  default = 20 
}

variable "db_name" {
  type = string 
  default = "appdb" 
}

variable "db_username" {
  type = string 
}

variable "db_password" {
  type = string 
  sensitive = true 
}

variable "db_subnet_group_name" {
  description = "RDS subnet group name"
  type        = string
}

variable "service_name" {
  description = "RDS service name"
  type = string
}

variable "vpc_security_group_ids" {
  description = "Security groups attached to the RDS instance"
  type        = list(string)
}

variable "multi_az" {
  type    = bool
  default = true
}

variable "skip_final_snapshot" {
  type    = bool
  default = true
}

variable "deletion_protection" { 
  type    = bool
  default = false 
}

variable "tags" { 
  type = map(string) 
  default = {} 
}

variable "jwt_access_expiry" {
  type = string 
  default = "15m" 
}

variable "jwt_refresh_expiry" {
  type = string 
  default = "7d" 
}
