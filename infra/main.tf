module "vpc" {
  source      = "./modules/vpc"
  name        = "main"
  environment = "stg"
  cidr_block  = "10.0.0.0/16"
}

module "rds" {
  source      = "./modules/rds"
  name        = "db"
  environment = "stg"
  vpc_id      = module.vpc.vpc_id
}

module "ecs" {
  source           = "./modules/ecs"
  name             = "web"
  environment      = "stg"
  rds_cluster_id  = module.rds.rds_cluster_id
  vpc_id          = module.vpc.vpc_id
}
