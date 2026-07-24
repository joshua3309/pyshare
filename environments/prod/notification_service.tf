module "notification_task" {
  source = "../../modules/taskdefinition"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  family         = "${var.env}-${var.project}-notification"
  container_name = "notification"
  image          = var.notification_image

  cpu    = 512
  memory = 1024

  container_port = 4006

  requires_compatibilities = ["FARGATE"]

  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_common_arn
  log_group_name     = module.cloudwatch.ecs_log_group_name

  environment_variables = local.notification_env


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


module "notification_service" {
  source = "../../modules/ecs_service"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  service_name = "${var.env}-notification"

  cluster_id   = module.ecs_cluster.cluster_id
  cluster_name = module.ecs_cluster.cluster_name

  task_definition_arn = module.notification_task.task_definition_arn

  desired_count = var.desired_counts["notification"]

  subnets = module.network.private_subnets

  security_group_id = module.security.ecs_sg_id

  target_group_arn = module.alb.target_groups.notification.arn

  capacity_provider_name = "FARGATE"

  enable_service_connect = true

  service_connect_namespace = module.ecs_cluster.service_connect_namespace_arn

  service_connect_dns_name = "notification"

  service_connect_discovery_name = "notification"

  service_connect_port = 4006

  container_name = "notification"
  container_port = 4006

  enable_autoscaling = true

  min_capacity = 1
  max_capacity = 6

  cpu_target    = 70
  memory_target = 70


  tags = var.tags
}
