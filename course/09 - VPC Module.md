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
11. Run `terraform apply` and verify the VPC file is created
12. Run `terraform output` to check the outputs

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
