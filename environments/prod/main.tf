terraform {
  backend "s3" {
    bucket         = "terraform-state-033481624720"
    dynamodb_table = "microservice-security-web-waf"
    encrypt        = true
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
  }
}