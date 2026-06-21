module "sns_dev_alerts" {
  source = "../../modules/sns"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  topic_name = "microservice-prod-alerts"

  subscriptions = {
    sergii = {
      protocol = "email"
      endpoint = "chidiebere3322@gmail.com"
    },
  }
}

module "cloudwatch" {
  source = "../../modules/cloudwatch"

  account_id           = var.account_id
  env                  = var.env
  project              = var.project
  region               = var.region
  log_streams          = [""]
  app_name             = "microservice_app"
  alarm_sns_topic_name = "microservice-prod-alerts"
}

module "iam" {
  source = "../../modules/iam"

  account_id           = var.account_id
  env                  = var.env
  project              = var.project
  region               = var.region

  tags = {
  Environment = "prod"
  Project     = "microservice"
  ManagedBy   = "Terraform"
  }
}

module "network" {
  source = "../../modules/network"

  account_id           = var.account_id
  env                  = var.env
  project              = var.project
  region               = var.region

  nat_gateway_count    = 2
}

module "security" { 
  source = "../../modules/security"

  account_id           = var.account_id
  env                  = var.env
  project              = var.project
  region               = var.region

  vpc_id = module.network.vpc_id

}

module "alb" {
  source = "../../modules/alb"

  account_id           = var.account_id
  env                  = var.env
  project              = var.project
  region               = var.region

  
  alarm_sns_topic_name       = "microservice"
  ips_to_be_allowed          = [""]
  waf_rules_override_action  = "count"
  custom_waf_rules           = true
  waf_secret_header_value    = "some_secret"

  create_aliases = [
    {
      name = "api"
      zone = "downloadloadbriefly"
    }
  ]
  
  logs_expiration = 90
  logs_bucket     = "prod-lb-microservice-logs"
  logs_prefix     = "prod-microservice"
  logs_enabled    = true


  lb_ssl_policy = "ELBSecurityPolicy-2016-08"
  domain        = "downloadloadbriefly"

  lb_subnets    = module.network.public_subnets
  vpc_id        = module.network.vpc_id
  lb_sg         = module.security.alb_sg_id                             
  
}

