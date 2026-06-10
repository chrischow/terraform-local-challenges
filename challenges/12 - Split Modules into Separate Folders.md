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
