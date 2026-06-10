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
