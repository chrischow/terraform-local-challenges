include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

terraform {
  source = "../../../modules/ecs"
}

dependency "vpc" {
  config_path = "../vpc"

  mock_outputs = {
    vpc_id = "mock-vpc-id"
  }
}

dependency "rds" {
  config_path = "../rds"

  mock_outputs = {
    rds_cluster_id = "mock-rds-cluster-id"
  }
}

inputs = {
  name            = "main"
  environment     = local.env_vars.locals.environment
  rds_cluster_id  = dependency.rds.outputs.rds_cluster_id
  vpc_id          = dependency.vpc.outputs.vpc_id
}
