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
