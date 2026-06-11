module "rds" {
  source      = "../../../modules/rds"
  name        = "db"
  environment = "prod"
  vpc_id      = "prod-vpc-main"
}
