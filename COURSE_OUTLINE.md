# Terraform/Terragrunt Challenge Series

## Learning Goals

- Learn Terraform and Terragrunt basic syntax and commands.
- Practice Terraform workflows (init, plan, apply, destroy) without cloud credentials.
- Understand how modules, variables, outputs, and locals work.
- See how Terragrunt adds DRY configuration, state management, and multi-environment support.

## Design Philosophy

- **No cloud required.** Everything uses `local_file` as the "resource" so learners can run `terraform apply` instantly.
- **Loosely inspired by AWS.** Resource names _resemble_ real AWS resources (`s3_bucket_config`, `ec2_instance_metadata`, `iam_role_policy`). File contents describe basic properties of those services. This builds familiarity with common cloud resource patterns without needing an actual AWS account.
- **Builds incrementally.** Each challenge introduces one or two new concepts. Learners always start from the previous challenge's solution.
- **Self-grading via an AI agent.** After the learner finishes a challenge, they invoke a Pi extension (or use a Pi session) that inspects the working directory, parses the `.tf` files and `.tfstate`, and provides structured feedback / a pass/fail grade.

## Challenge Instructions

1. Make all changes in the `./infra` folder.
1. Commit changes after completing each challenge (e.g. `feat: challenge 01`).
1. Ignore the files created by Terraform (e.g. `*.txt` from `local_file` resources, `.terraform/`, `.terraform.tfstate`, `.terraform.tfstate.backup`, `*.tfplan`). They are generated artifacts, not part of the curriculum.

### Challenge: Environment Setup

#### Tasks
1. Install tenv
2. Use tenv to install Terraform
3. Use tenv to install terragrunt

#### Checks
- [ ] tenv is installed (`tenv version` works)
- [ ] Terraform is installed (`terraform version` works)
- [ ] Terragrunt is installed (`terragrunt --version` works)

### Challenge: Setting up the Provider

#### Tasks
1. Create a `providers.tf` with the `hashicorp/local` provider block
2. Run `terraform init` to download the provider
3. Run `terraform plan` to verify the provider is configured

#### Checks
- [ ] `providers.tf` exists with a valid `required_providers` block for `hashicorp/local`
- [ ] `terraform plan` runs without errors and shows "No changes. Your infrastructure matches the configuration."

### Challenge: First Resource Block

#### Tasks
1. Create a `main.tf` to house the resource
2. Add a `resource "local_file" "foo"` block
3. Set `filename = "foo.txt"` and content to `"bar"`
4. Run `terraform plan` and inspect the change
5. Run `terraform apply` and verify the file is created
6. Run `terraform plan` again to verify that there are no changes

#### Checks
- [ ] `main.tf` exists and contains a `resource "local_file" "foo"` block
- [ ] `./infra/foo.txt` exists and its content includes "bar"
- [ ] `terraform plan` shows no pending changes

### Challenge: Input Variables

#### Tasks
1. Create `variable` blocks for `filename` and `content` in `main.tf`
2. Create a `terraform.tfvars` file and specify the same filename and content there
3. Use `var.*` references in the `local_file` resource
4. Run `terraform plan` and verify no plan changes

#### Checks
- [ ] `variable` blocks for `filename` and `content` exist in `main.tf`
- [ ] `terraform.tfvars` exists with matching values
- [ ] `var.*` references are used in the `local_file` resource
- [ ] `terraform plan` shows no pending changes

### Challenge: Output Values

#### Tasks
1. Add `output` blocks for `filename` and `content`
2. Run `terraform output` to verify both are returned

#### Checks
- [ ] `output` blocks for `filename` and `content` exist in `main.tf`
- [ ] `terraform apply` returns the `filename` and `content` outputs

### Challenge: `for_each`

#### Tasks
1. Create a new `variable` in `main.tf` for the `map(string)` named `files`
2. Add a new `local_file` resource in `main.tf` using `for_each` with a variable, using the filename as the key and the content as the value
3. Add the parameters to `terraform.tfvars`
4. Inspect the changes with `terraform plan`
5. Run `terraform apply` and verify correct number of files are created

#### Checks
- [ ] A `variable "files"` of type `map(string)` exists in `main.tf`
- [ ] `local_file` resource uses `for_each = var.files`
- [ ] `terraform.tfvars` contains a `files` map with at least 2 entries
- [ ] The expected files were created on disk with correct content
- [ ] `terraform plan` shows no pending changes

### Challenge: `count`

#### Tasks
1. Create a new `variable` in `main.tf` for the count named `file_count`
2. Add a new `local_file` resource in `main.tf` using `count`
3. Add the parameters to `terraform.tfvars`
4. Inspect the changes with `terraform plan`
5. Run `terraform apply` and verify correct number of files are created

#### Checks
- [ ] A `variable "file_count"` of type `number` exists in `main.tf`
- [ ] `local_file` resource uses `count = var.file_count`
- [ ] `terraform.tfvars` contains a `file_count` with a positive integer value
- [ ] The expected number of files were created on disk
- [ ] `terraform plan` shows no pending changes

### Challenge: Local Values and Conditionals

#### Tasks
1. Create a boolean `isProduction` variable in `main.tf`
2. Use `locals` to compute an environment tag (`prod`/`dev` based on the boolean variable)
3. Append the computed environment tag to the content for the `foo` local_file resource
4. Run `terraform plan` with different variable values and verify content changes
5. Set `isProduction` to true and run `terraform apply`

#### Checks
- [ ] A `variable "isProduction"` of type `bool` exists in `main.tf`
- [ ] `locals` block computes an environment tag (`prod`/`dev`) based on the boolean variable
- [ ] The `foo` local_file resource content includes the environment tag
- [ ] `./infra/foo.txt` content includes "bar-prod"
- [ ] `terraform plan` shows no pending changes

### Challenge: VPC Module

#### Tasks
1. Remove all content from `./infra/main.tf`
2. Create a `./infra/modules/` folder
3. Create a `./infra/modules/vpc` folder
4. Add `main.tf`, `variables.tf`, and `outputs.tf` files to the `./infra/modules/vpc` folder
5. Variables:
   1. `environment`: A string, either `staging` or `prod`
   2. `name`: A string in snake-case so it can be used as a filename
   3. `cidr_block`: Self-explanatory
6. Resource:
   1. The filename should be `(environment)-vpc-(name).txt`
   2. The content should contain the `id` and `cidr_block`. See the example below.
7. Outputs:
   1. `vpc_id`: `(environment)-vpc-(name)`
   2. `cidr_block`: The CIDR block
8.  Add a `module` block in `./infra/main.tf` to instantiate a VPC module. Use `main` for the `name` and `stg` for the `environment`.
9.  Run `terraform init` to register the module
10. Run `terraform plan` to inspect the generated resource changes
11. Run `terraform apply` and verify that (a) the VPC file is created, and (b) the outputs contain `vpc_id` and `cidr_block`

#### Checks
- [ ] `./infra/modules/vpc/main.tf`, `./infra/modules/vpc/variables.tf`, and `./infra/modules/vpc/outputs.tf` exist
- [ ] `./infra/modules/vpc/variables.tf` defines `environment`, `name`, and `cidr_block` variables
- [ ] `./infra/modules/vpc/outputs.tf` defines `vpc_id` and `cidr_block` outputs
- [ ] The resource content contains both `id` and `cidr_block`
- [ ] `./infra/main.tf` contains a `module` block instantiating the VPC module with `name = "main"` and `environment = "stg"`
- [ ] `terraform apply` shows no pending changes, and returns `vpc_id` and `cidr_block` as outputs

#### Example

```
id: stg-vpc-main
cidr_block: 10.0.0.0/16
```


### Challenge: RDS Module

#### Tasks
1. Create a `./infra/modules/rds` folder
2. Add `main.tf`, `variables.tf`, and `outputs.tf` files to the `./infra/modules/rds` folder
3. Variables:
   1. `environment`: A string, either `staging` or `prod`
   2. `name`: A string in snake-case so it can be used as a filename
   3. `vpc_id`: The VPC ID string passed from the caller
4. Resource:
   1. The filename should be `(environment)-rds-cluster-(name).txt`
   2. The content should contain the `id` and `vpc_id`. See the example below.
5. Outputs:
   1. `rds_cluster_id`: The cluster ID, `(environment)-rds-cluster-(name)`
6. Add a `module` block in `./infra/main.tf` to instantiate an RDS module. Use `db` for the `name`, `stg` for the `environment`, and reference the VPC module's `vpc_id` output for `vpc_id`.
7. Run `terraform init` to register the module
8. Run `terraform plan` to inspect the generated resource changes
9. Run `terraform apply` and verify that (a) the RDS file is created, and (b) the outputs contain `rds_cluster_id`

#### Checks
- [ ] `./infra/modules/rds/main.tf`, `./infra/modules/rds/variables.tf`, and `./infra/modules/rds/outputs.tf` exist
- [ ] `./infra/modules/rds/variables.tf` defines `environment`, `name`, and `vpc_id` variables
- [ ] `./infra/modules/rds/outputs.tf` defines `rds_cluster_id` output
- [ ] The resource content contains both `id` and `vpc_id`
- [ ] `./infra/main.tf` contains a `module` block instantiating the RDS module with `name = "db"`, `environment = "stg"`, and `vpc_id` referencing the VPC module's output
- [ ] `terraform apply` shows no pending changes, and returns `rds_cluster_id` as an output

#### Example

```
id: stg-rds-cluster-db
vpc_id: stg-vpc-main
```

### Challenge: ECS Module

#### Tasks
1. Create a `./infra/modules/ecs` folder
2. Add `main.tf`, `variables.tf`, and `outputs.tf` files to the `./infra/modules/ecs` folder
3. Variables:
   1. `environment`: A string, either `staging` or `prod`
   2. `name`: A string in snake-case so it can be used as a filename
   3. `rds_cluster_id`: The RDS cluster ID string passed from the caller
   4. `vpc_id`: The VPC ID string passed from the caller
4. Resource:
   1. The filename should be `(environment)-ecs-(name).txt`
   2. The content should contain the `id`, `rds_cluster_id`, and `vpc_id`. See the example below.
5. Outputs:
   1. `ecs_id`: The ID, `(environment)-ecs-(name)`
6. Add a `module` block in `./infra/main.tf` to instantiate an ECS module. Use `web` for the `name`, `stg` for the `environment`, and reference the RDS module's `rds_cluster_id` output and the VPC module's `vpc_id` output.
7. Run `terraform init` to register the module
8. Run `terraform plan` to inspect the generated resource changes
9. Run `terraform apply` and verify that (a) the ECS file is created and (b) the outputs contain `ecs_id`

#### Checks
- [ ] `./infra/modules/ecs/main.tf`, `./infra/modules/ecs/variables.tf`, and `./infra/modules/ecs/outputs.tf` exist
- [ ] `./infra/modules/ecs/variables.tf` defines `environment`, `name`, `rds_cluster_id`, and `vpc_id` variables
- [ ] `./infra/modules/ecs/outputs.tf` defines `ecs_id` output
- [ ] The resource content contains `id`, `rds_cluster_id`, and `vpc_id`
- [ ] `./infra/main.tf` contains a `module` block instantiating the ECS module with `name = "web"`, `environment = "stg"`, and references to RDS and VPC module outputs
- [ ] `terraform apply` shows no pending changes, and returns `ecs_id` as an output

#### Example

```
id: stg-ecs-web
rds_cluster_id: stg-rds-cluster-db
vpc_id: stg-vpc-main
```

### Challenge: Split Modules into Separate Folders

At this point, all three modules (VPC, RDS, ECS) are instantiated in a single `./infra/main.tf`. In a real team, each service has its own lifecycle: the networking team manages VPC changes, the data team manages RDS changes, and the app team manages ECS changes. They should not need to coordinate or even see each other's Terraform state when making changes.

#### Tasks
1. Create separate directories under `./infra/` for each service: `./infra/vpc`, `./infra/rds`, and `./infra/ecs`
2. Each directory should contain:
   1. `providers.tf`: A copy of the current `./infra/providers.tf`
   2. `main.tf`: Houses the module block for the respective service
   3. `variables.tf`: To pass variables to the module
   4. `terraform.tfvars`: To set the parameters
3. Note that for RDS and ECS, the module has no way to access the VPC outputs, so you will have to hard-code the inputs. In reality, this would involve pulling the remote state for the dependencies. We won't do that here.
4. Update the respective module blocks' `source` by prepending 1 more `../`, since we are adding 2 layers of nesting
5. Delete `./infra/main.tf`
6. Run `terraform init` in each folder
7. Run `terraform plan` and `terraform apply` in each folder individually and verify the correct files are created.
8. Remove anything that is not `./infra/modules`, `./infra/vpc`, `./infra/rds`, or `./infra/ecs`

#### Checks

- [ ] Each service has its own directory: `./infra/vpc`, `./infra/rds`, `./infra/ecs`
- [ ] Each directory contains `providers.tf`, `main.tf`, `variables.tf`, and `terraform.tfvars`
- [ ] `terraform apply` shows no pending changes in `./infra/vpc`, `./infra/rds`, and `./infra/ecs`

#### Gotchas

- **Hard-coded dependency IDs:** Changing the VPC ID requires manually updating every dependent service's config. Fragile and error-prone.
- **`terraform init` per folder:** You have to run `terraform init/plan/apply` in *each* service folder.
- **No cross-service state commands:** You must run `terraform state list` or `terraform output` inside each folder individually.


### Challenge: Multi-Environment Configuration

The team is now moving into production, which means managing both a staging (`stg`) and production (`prod`) environment. The current setup has no concept of separate environments — all resources live in a single `./infra/` folder with no safety boundary between them. This challenge walks you through restructuring the configuration so each environment lives in its own folder, with shared variables consolidated to avoid duplication.

#### Tasks
1. Tear down all existing resources by running `terraform destroy` in each resource folder:
   1. `./infra/ecs`
   2. `./infra/rds`
   3. `./infra/vpc`
2. Create a new `./infra/states` folder
3. Create two new folders:
   1. `./infra/states/stg`
   2. `./infra/states/prod`
4. Move all of the resource folders (i.e. `vpc`, `rds`, `ecs`) into `./infra/states/stg`
5. Copy `./infra/states/stg` to a new folder `./infra/states/prod`
6. Change the `environment` variable in each prod service to `"prod"`
7. Update the `source` for all services' `main.tf` file to the correct filepath. 2 more `../` should be prepended since we are adding 2 layers of nesting.
8. Provision all resources in both staging and production:
   1. Run `terraform init` in each folder to register the modules
   2. Run `terraform plan` in each folder to inspect changes
   3. Run `terraform plan` in each folder to verify the configuration
9.  Remove any files or folders in `./infra` that is not `./infra/states` or `./infra/modules`

#### Checks
- [ ] `./infra/states/` contains only `stg` and `prod` folders (plus `modules`)
- [ ] Each environment folder (`stg` and `prod`) contains `vpc`, `rds`, and `ecs` subdirectories
- [ ] Each service's `main.tf` has the correct module `source` path
- [ ] `terraform plan` runs successfully in all service folders for both environments with no pending changes

#### Gotchas

- **Duplicated providers & backends:** There are 6 copies of the same provider block (3 services × 2 environments). Adding services and environments scales this linearly (e.g., 10 services × 5 environments = 50 configs). This is what Terragrunt's `generate` + `include` solves.
- **`terraform.tfvars` duplication:** Shared values like `cidr_block` are repeated across all 6 folders. Changing one requires editing every file.
- **`cp -r` carries stale state:** Copying `stg` to `prod` copies state files too. Verify prod state is clean before planning, or destroy first.
- **No auto dependency ordering:** You must still apply VPC → RDS → ECS in order within each environment.


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

### Challenge: Add Dependencies

In the previous challenge, RDS and ECS hard-coded dependency IDs (e.g., `vpc_id`, `rds_cluster_id`). Now you'll use Terragrunt's `dependency` blocks to automatically pull outputs from upstream services. This eliminates hard-coded values and keeps services loosely coupled.

#### Tasks
1. In `./infra/states/stg/rds/terragrunt.hcl`, add a `dependency` block that references the VPC service, and use `dependency.vpc.outputs.vpc_id` instead of the hard-coded value.
2. In `./infra/states/stg/ecs/terragrunt.hcl`, add `dependency` blocks for both VPC and RDS, and use `dependency.*.outputs.*` for the required inputs.
3. Run `terragrunt run --all plan` and `terragrunt run --all apply` in both staging and prod to verify everything still works.
4. Verify that destroying the VPC in staging triggers a cascading plan that shows RDS and ECS would also be destroyed.

#### Checks
- [ ] `./infra/states/stg/rds/terragrunt.hcl` contains a `dependency "vpc"` block
- [ ] `./infra/states/stg/ecs/terragrunt.hcl` contains `dependency` blocks for both VPC and RDS
- [ ] Dependency outputs are used as inputs (not hard-coded values)
- [ ] `terragrunt run --all plan` runs successfully in both staging and prod

#### Examples

For the RDS service (`./infra/states/stg/rds/terragrunt.hcl`), add a `dependency` block:

```hcl
# ...other blocks

dependency "vpc" {
  config_path = "../vpc"
}

inputs = {
  # ...other inputs
  vpc_id      = dependency.vpc.outputs.vpc_id
}
```
