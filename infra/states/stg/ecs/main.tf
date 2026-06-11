module "ecs" {
  source           = "../../../modules/ecs"
  name             = "web"
  environment      = "stg"
  rds_cluster_id  = "stg-rds-cluster-db"
  vpc_id          = "stg-vpc-main"
}
