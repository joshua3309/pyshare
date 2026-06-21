terraform {
  backend "s3" {
    bucket         = "microservice-security-web-waf"
    dynamodb_table = "microservice-security-web-waf"
    encrypt        = true
    key            = "prod.tfstate"
    region         = "us-east-1"
  }
}