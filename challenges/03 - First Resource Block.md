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
