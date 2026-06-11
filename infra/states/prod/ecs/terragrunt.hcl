include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

terraform {
  source = "../../../modules/ecs"
}

inputs = {
  name            = "main"
  environment     = local.env_vars.locals.environment
  rds_cluster_id  = "prod-rds-cluster-main"
  vpc_id          = "prod-vpc-main"
}
