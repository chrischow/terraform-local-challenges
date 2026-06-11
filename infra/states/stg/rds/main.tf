module "rds" {
  source      = "../../../modules/rds"
  name        = "db"
  environment = "stg"
  vpc_id      = "stg-vpc-main"
}
