---
description: Run challenge tasks
argument-hint: "<challenge-file>"
---

Perform the Tasks in $1. Actions should be performed in the `./infra` folder.

## Specific Guidance:
- Do not run any of the Checks in the file. **ONLY** run the Tasks.
- Do not ask me to run `terraform init` unless explicitly instructed to in the Tasks.
- Assume that `terraform` and `terragrunt` are installed. Do not check their versions unless explicitly instructed to in the Tasks.
- If you are ever required to perform any of the actions listed below, PAUSE execution, and tell me what you need me to run manually before asking you to continue. DO NOT try find a workaround.
  - `terraform destroy`
  - `terragrunt destroy`
  - `terraform output`
  - `terragrunt output`
  - Folder creation, deletion, and/or copying operations
  - File deletion and/or copying operations