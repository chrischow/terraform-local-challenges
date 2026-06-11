module "ecs" {
  source           = "../../../modules/ecs"
  name             = "web"
  environment      = "prod"
  rds_cluster_id  = "prod-rds-cluster-db"
  vpc_id          = "prod-vpc-main"
}
