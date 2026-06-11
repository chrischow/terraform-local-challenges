include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

terraform {
  source = "../../../modules/rds"
}

inputs = {
  name        = "main"
  environment = local.env_vars.locals.environment
  vpc_id      = "stg-vpc-main"
}
