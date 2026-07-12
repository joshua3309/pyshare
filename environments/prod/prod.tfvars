
# ──────────────────────────────────────────────
# VPC (adjust CIDR if needed for prod isolation)
# ──────────────────────────────────────────────
vpc_cidr = "10.0.0.0/16"

public_subnet_cidrs = [
  "10.0.101.0/24",
  "10.0.102.0/24"
]

private_subnet_cidrs = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]

db_private_subnet_cidrs = [
  "10.0.11.0/24",
  "10.0.12.0/24"
]

availability_zones = [
  "us-east-1a",
  "us-east-1b"
]

# ──────────────────────────────────────────────
# Container Images (use stable/prod tags)
# ──────────────────────────────────────────────
posts_image   = "nginx:latest"
threads_image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/comments:prod-v1.2.3"
users_image   = "123456789012.dkr.ecr.us-east-1.amazonaws.com/requests:prod-v1.2.3"

enable_deletion_protection = true

# ──────────────────────────────────────────────
# Task-level resources (higher – what cluster sees)
# ──────────────────────────────────────────────
# cpu    = "512"
# memory = "1024"


# ──────────────────────────────────────────────
posts_desired_count   = 1
threads_desired_count = 1
users_desired_count  = 1


# ──────────────────────────────────────────────
# EC2 / ASG (more conservative in prod)
# ──────────────────────────────────────────────
instance_type        = "t3.medium"             # bigger instance for more tasks per host
# ecs_optimized_ami    = "ami-0933f1385008d33c4" # ← replace with actual latest prod AMI
asg_max_size         = 5

# Optional: override if different in prod
app_port = 3000

account_id = "033481624720"
env        = "prod"
project    = "micro-service"
region     = "us-east-1"

tags = {
  Environment = "prod"
  Project     = "micro-service"
}

posts_env_vars = {
  NODE_ENV         = "production"
  PORT             = "3000"
  LOG_LEVEL        = "info"
  S3_BUCKET        = "prod-posts-bucket"
  REGISTRATION_OPEN = "true"
}

posts_secrets = {
  DATABASE_URL = "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/database_url-abc123"

  JWT_SECRET = "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/jwt_secret-def456"

  REDIS_PASSWORD = "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/redis_password-ghi789"

  OPENAI_API_KEY = "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/openai_api_key-jkl321"
}