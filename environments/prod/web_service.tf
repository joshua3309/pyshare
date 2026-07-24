module "web_task" {
  source = "../../modules/taskdefinition"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  family         = "${var.env}-${var.project}-web"
  container_name = "web"
  image = var.web_image

  cpu    = 512
  memory = 1024

  container_port = 3000

  requires_compatibilities = ["EC2"]

  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_common_arn
  log_group_name     = module.cloudwatch.ecs_log_group_name

  environment_variables = local.web_env


  container_secrets = [
    {
      name      = "DATABASE_URL"
      valueFrom = "${module.rds.db_credentials_secret_arn}:DATABASE_URL::"
    },
    {
      name      = "JWT_ACCESS_SECRET"
      valueFrom = "${module.rds.jwt_secrets_arn}:JWT_ACCESS_SECRET::"
    },
    {
      name      = "JWT_REFRESH_SECRET"
      valueFrom = "${module.rds.jwt_secrets_arn}:JWT_REFRESH_SECRET::"
    },
    {
      name      = "JWT_SERVICE_SECRET"
      valueFrom = "${module.rds.jwt_secrets_arn}:JWT_SERVICE_SECRET::"
    }
  ]

  tags = var.tags
}


module "web_service" {
  source = "../../modules/ecs_service"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  service_name = "${var.env}-web"

  cluster_id   = module.ecs_cluster.cluster_id
  cluster_name = module.ecs_cluster.cluster_name

  task_definition_arn = module.web_task.task_definition_arn

  desired_count = var.desired_counts["web"]

  subnets = module.network.private_subnets

  security_group_id = module.security.ecs_sg_id

  target_group_arn = module.alb.target_groups.web.arn

  capacity_provider_name = module.autoscaling.capacity_provider_name

  enable_service_connect = true

  service_connect_namespace = module.ecs_cluster.service_connect_namespace_arn

  service_connect_dns_name = "web"

  service_connect_discovery_name = "web"

  service_connect_port = 3000

  container_name = "web"
  container_port = 3000

  enable_autoscaling = true

  min_capacity = 1
  max_capacity = 6

  cpu_target    = 70
  memory_target = 70


  tags = var.tags
}