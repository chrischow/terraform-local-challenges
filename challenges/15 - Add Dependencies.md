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
