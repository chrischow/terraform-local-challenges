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
9. Run `terraform apply` and verify the RDS file is created
10. Run `terraform output` to check the outputs

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
