module "vpc" {
  source      = "../../../modules/vpc"
  name        = "main"
  environment = "stg"
  cidr_block  = "10.0.0.0/16"
}
