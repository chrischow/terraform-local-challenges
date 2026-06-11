# Terraform/Terragrunt Challenge Series

## Learning Goals

- Learn Terraform and Terragrunt basic syntax and commands.
- Practice Terraform workflows (init, plan, apply, destroy) without cloud credentials.
- Understand how modules, variables, outputs, and locals work.
- See how Terragrunt adds DRY configuration, state management, and multi-environment support.

## Design Philosophy

- **No cloud required.** Everything uses `local_file` as the "resource" so you can run `terraform` commands without fear of affecting any cloud resources.
- **Builds incrementally.** Each challenge introduces one or two new concepts. You'll always start from the previous challenge's solution.
- **(Optional) AI grading.** If you have set up [Pi](https://pi.dev/), after you're done with a challenge, start a new `pi` session in the root of this repo, and ask the agent to `grade` your work. You have to specify the challenge number. For example: `I have completed challenge 12. Please grade it.`

## General Guidance
1. **Just exercises.** This repo contains no explanations of the concepts. These are already available in the [Terraform](https://developer.hashicorp.com/terraform/language) and [Terragrunt](https://docs.terragrunt.com/getting-started/quick-start/) docs.
2. **Learn as you go.** Consult the docs as you encounter a new concept in the tasks. The advice to "just read the docs" doesn't help you pay attention to specific things that you will use.
3. **Write the code yourself.** If you're learning these for the first time, **do not** ask AI to write the code for you. This helps force active learning and builds muscle memory.

## Challenge Instructions

1. Make all changes in the `./infra` folder.
2. Commit changes after completing each challenge (e.g. `feat: challenge 01`).
3. Ignore the files created by Terraform (e.g. `*.txt` from `local_file` resources, `.terraform/`, `.terraform.tfstate`, `.terraform.tfstate.backup`, `*.tfplan`). They are generated artifacts, not part of the curriculum.
4. If you're stuck at a challenge, you may reference the appropriate commit in the `feat/solution` branch.