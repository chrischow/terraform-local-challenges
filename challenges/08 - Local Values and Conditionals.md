### Challenge: Local Values and Conditionals

#### Tasks
1. Create a boolean `isProduction` variable in `main.tf`
2. Use `locals` to compute an environment tag (`prod`/`dev` based on the boolean variable)
3. Append the computed environment tag to the content for the `foo` local_file resource
4. Run `terraform plan` with different variable values and verify content changes
5. Set `isProduction` to true and run `terraform apply`

#### Checks
- [ ] A `variable "isProduction"` of type `bool` exists in `main.tf`
- [ ] `locals` block computes an environment tag (`prod`/`dev`) based on the boolean variable
- [ ] The `foo` local_file resource content includes the environment tag
- [ ] `./infra/foo.txt` content includes "bar-prod"
- [ ] `terraform plan` shows no pending changes
