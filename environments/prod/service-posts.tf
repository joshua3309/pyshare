module "posts_task" {
  source = "../../modules/task-definition"

  family       = "${var.environment}-posts"
  container_name = "posts"
  image        = var.posts_container_image

  cpu          = "1024"
  memory       = "2048"

  container_port = 3000

  requires_compatibilities = ["EC2"]

  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_common_arn

  environment_variables = var.posts_env_vars
  secrets               = var.posts_secrets

  tags = var.tags
}


module "posts_service" {
  source = "../../modules/ecs-service"

  service_name = "${var.environment}-posts"

  cluster_id = module.ecs_cluster.cluster_id

  task_definition_arn = module.posts_task.task_definition_arn

  desired_count = 4

  launch_type = "EC2"

  subnets = module.vpc.app_private_subnets

  security_group_id = module.sg.ecs_sg_id

  target_group_arn = module.alb.posts_target_group_arn

  container_name = "posts"
  container_port = 3000

  tags = var.tags
}