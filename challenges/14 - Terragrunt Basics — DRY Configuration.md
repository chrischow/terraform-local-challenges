### Challenge: Terragrunt Basics — DRY Configuration

This challenge teaches Terragrunt's core DRY pattern: define provider configuration once and reuse it across environments.

#### Tasks
1. Create a root `root.hcl` in `./infra/states` with a `generate` block for the provider configuration. This will be shared across all services. See the example below.
2. Provision the staging environment:
   1. Create a `./infra/states/stg/env.hcl` file with a `locals` block defining `environment = "stg"`.
   2. For each service subfolder under `./infra/states/stg/`:
      1. Create a `terragrunt.hcl`. See the example below for the content of each of these config files.
      2. For services that require dependencies (i.e. RDS and ECS), hard code the dependency IDs first (e.g. `vpc_id="..."`, `rds_cluster_id="..."`)
      3. Remove all other files.
   3. Apply changes to staging from inside the `./infra/states/stg` directory:
      1. Run `terragrunt run --all plan` to inspect the changes
      2. Run `terragrunt run --all apply` to apply the changes
3. Provision the prod environment:
   1. Delete `./infra/states/prod`
   2. Copy `./infra/states/stg` to a new directory `./infra/states/prod`
   3. Update the `environment` local variable in `./infra/states/prod/env.hcl` file
   4. Apply changes to prod from inside the `./infra/states/prod` directory:
      1. Run `terragrunt run --all plan` to inspect the changes
      2. Run `terragrunt run --all apply` to apply the changes

> Note: You may need to use the `--parallelism 1` flag if the various modules fail to concurrently pull the provider from your machine's cache.

#### Checks
- [ ] `./infra/states/root.hcl` exists with a `generate` block for the provider configuration
- [ ] Each service folder has a `terragrunt.hcl` file
- [ ] Each `terragrunt.hcl` includes the root config via `find_in_parent_folders("root.hcl")`
- [ ] Each `terragrunt.hcl` references the `env.hcl` local variable for the environment name
- [ ] `terragrunt run --all plan` runs successfully in both staging and prod
- [ ] `./infra/` contains only `states` and `modules` directories

#### Examples
For the root `./infra/states/root.hcl`:

```hcl
generate "provider" {
  path      = "providers.tf"
  if_exists = "overwrite"
  contents = <<EOF
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.9.0"
    }
  }
}
EOF
}
```

For the VPC module in `./infra/states/stg/vpc/terragrunt.hcl`:

```hcl
include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

terraform {
  source = "../../../modules/vpc"
}

inputs = {
  name        = "main"
  environment = local.env_vars.locals.environment
  cidr_block  = "10.0.0.0/16"
}
```
