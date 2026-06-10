---
description: Run challenge tasks
argument-hint: "<challenge-file>"
---

Perform the Tasks in $1. Actions should be performed in the `./infra` folder. If you are ever required to perform any `terraform/terragrunt init`, `terraform/terragrunt destroy`, `terraform/terragrunt output`, folder creation/deletion/copying operations, or file deletion/copying operations, pause execution and tell me where you have paused so I can run those before asking you to continue.

## Specific Guidance:
- Do not run any of the Checks in the file. **ONLY** run the Tasks.
- Do not ask me to run `terraform init` unless explicitly instructed to in the Tasks.
- Assume that `terraform` and `terragrunt` are installed. Do not check their versions unless explicitly instructed to in the Tasks.