module "posts_task" {
  source = "../../modules/taskdefinition"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  family         = "${var.env}-${var.project}-posts"
  container_name = "posts"
  image          = var.posts_image

  cpu    = 512
  memory = 1024

  container_port = 3000

  requires_compatibilities = ["EC2"]

  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_common_arn
  log_group_name     = module.cloudwatch.ecs_log_group_name

  environment_variables = var.posts_env_vars
  secrets               = var.posts_secrets

  tags = var.tags
}


module "posts_service" {
  source = "../../modules/ecs_service"

  account_id = var.account_id
  env        = var.env
  project    = var.project
  region     = var.region

  service_name = "${var.env}-posts"

  cluster_id   = module.ecs_cluster.cluster_id
  cluster_name = module.ecs_cluster.cluster_name

  task_definition_arn = module.posts_task.task_definition_arn

  desired_count = var.posts_desired_count

  subnets = module.network.private_subnets

  security_group_id = module.security.ecs_sg_id

  target_group_arn = module.alb.target_groups.posts.arn

  capacity_provider_name = module.autoscaling.capacity_provider_name

  container_name = "posts"
  container_port = 3000

  enable_autoscaling = true

  min_capacity = 1
  max_capacity = 6

  cpu_target    = 70
  memory_target = 70


  tags = var.tags
}