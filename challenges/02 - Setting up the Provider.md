### Challenge: Setting up the Provider

#### Tasks
1. Create a `providers.tf` with the `hashicorp/local` provider block
2. Run `terraform init` to download the provider
3. Run `terraform plan` to verify the provider is configured

#### Checks
- [ ] `providers.tf` exists with a valid `required_providers` block for `hashicorp/local`
- [ ] `terraform plan` runs without errors and shows "No changes. Your infrastructure matches the configuration."
