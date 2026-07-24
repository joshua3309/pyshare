variable "vpc_cidr" {
  type = string
}

variable "db_private_subnet_cidrs" {
  description = "Database subnet CIDRs"
  type        = list(string)

  default = [
    # use the same defaults you want for development
    "10.0.21.0/24",
    "10.0.22.0/24"
  ]
}

variable "public_subnet_cidrs" {
  description = "Database subnet CIDRs"
  type        = list(string)

  default = [
    # use the same defaults you want for development
    "10.0.55.0/24",
    "10.0.66.0/24"
  ]
}

variable "private_subnet_cidrs" {
  description = "Database subnet CIDRs"
  type        = list(string)

  default = [
    # use the same defaults you want for development
    "10.0.13.0/24",
    "10.0.76.0/24"
  ]
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for supported resources (ALB, RDS, etc.)"
  type        = bool
  default     = false
}

variable "availability_zones" {
  description = "Availability Zones for the VPC"
  type        = list(string)

  default = [
    "us-east-1a",
    "us-east-1b"
  ]
}

variable "asg_max_size" {
  type    = number
  default = 2
}

variable "instance_type" {
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

variable "db_username" {
  type        = string
  description = "RDS username for database"
}

variable "db_password" {
  type        = string
  description = "RDS password for database"
}
variable "web_image" {
  description = "Docker image URI for the Web application"
  type        = string
}

variable "admin_image" {
  description = "Docker image URI for the Admin application"
  type        = string
}

variable "auth_image" {
  description = "Docker image URI for the Auth service"
  type        = string
}

variable "user_image" {
  description = "Docker image URI for the User service"
  type        = string
}

variable "payment_image" {
  description = "Docker image URI for the Payment service"
  type        = string
}

variable "transaction_image" {
  description = "Docker image URI for the Transaction service"
  type        = string
}

variable "wallet_image" {
  description = "Docker image URI for the Wallet service"
  type        = string
}

variable "notification_image" {
  description = "Docker image URI for the Notification service"
  type        = string
}

variable "billing_image" {
  description = "Docker image URI for the Billing service"
  type        = string
}


variable "tags" {
  description = "Common tags"
  type        = map(string)

  default = {
    Environment = "prod"
    Project     = "micro-service"
  }
}

variable "desired_counts" {
  description = "Desired ECS task count per service"

  type = map(number)

  default = {
    web          = 1
    admin        = 1
    auth         = 1
    user         = 1
    payment      = 1
    transaction  = 1
    wallet       = 1
    notification = 1
    billing      = 1
  }
}

