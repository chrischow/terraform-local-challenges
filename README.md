# Terraform/Terragrunt Challenge Series

## Learning Goals

- Learn Terraform and Terragrunt basic syntax and commands.
- Practice Terraform workflows (init, plan, apply, destroy) without cloud credentials.
- Understand how modules, variables, outputs, and locals work.
- See how Terragrunt adds DRY configuration, state management, and multi-environment support.

## Design Philosophy

- **No cloud required.** Everything uses `local_file` as the "resource" so learners can run `terraform apply` instantly.
- **Loosely inspired by AWS.** Resource names _resemble_ real AWS resources (`s3_bucket_config`, `ec2_instance_metadata`, `iam_role_policy`). File contents describe basic properties of those services. This builds familiarity with common cloud resource patterns without needing an actual AWS account.
- **Builds incrementally.** Each challenge introduces one or two new concepts. Learners always start from the previous challenge's solution.
- **Self-grading via an AI agent.** After the learner finishes a challenge, they invoke a Pi extension (or use a Pi session) that inspects the working directory, parses the `.tf` files and `.tfstate`, and provides structured feedback / a pass/fail grade.

## Challenge Instructions

1. Make all changes in the `./infra` folder.
1. Commit changes after completing each challenge (e.g. `feat: challenge 01`).
1. Ignore the files created by Terraform (e.g. `*.txt` from `local_file` resources, `.terraform/`, `.terraform.tfstate`, `.terraform.tfstate.backup`, `*.tfplan`). They are generated artifacts, not part of the curriculum.