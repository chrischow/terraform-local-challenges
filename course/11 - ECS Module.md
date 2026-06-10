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
9. Run `terraform apply` and verify the ECS file is created
10. Run `terraform output` to check the outputs

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
