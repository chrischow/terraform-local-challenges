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
