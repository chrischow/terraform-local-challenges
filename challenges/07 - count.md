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
