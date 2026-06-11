---
name: grade-work
description: Grading skill for the Terraform/Terragrunt challenge course. Use when the user requests grading for a specific challenge (e.g., "grade challenge 03" or "check my work on the Input Variables challenge"). Reads the relevant course document, extracts its checks, verifies the user's work, and reports structured pass/fail results.
---

# Grade Work Skill

Grades the user's work on a specific Terraform/Terragrunt challenge from the course. Only grade — do not fix, modify, or assist with the user's work.

## Usage

Run `grade-work <challenge_number>` where challenge number is `01` through `15`.

## Workflow

1. **Identify the challenge file.** Normalize the input: if the challenge number is a single digit (`1`–`9`), prepend `0` to get `01`–`09`. Then map to the corresponding file in `../../../challenges/`:
   - `01` → `01 - Environment Setup.md`
   - `02` → `02 - Setting up the Provider.md`
   - `03` → `03 - First Resource Block.md`
   - `04` → `04 - Input Variables.md`
   - `05` → `05 - Output Values.md`
   - `06` → `06 - for_each.md`
   - `07` → `07 - count.md`
   - `08` → `08 - Local Values and Conditionals.md`
   - `09` → `09 - VPC Module.md`
   - `10` → `10 - RDS Module.md`
   - `11` → `11 - ECS Module.md`
   - `12` → `12 - Split Modules into Separate Folders.md`
   - `13` → `13 - Multi-Environment Configuration.md`
   - `14` → `14 - Terragrunt Basics — DRY Configuration.md`
   - `15` → `15 - Add Dependencies.md`

2. **Read the challenge file** using `read` to get the challenge name and its list of checks.

3. **Extract the checks.** Parse the `#### Checks` section and enumerate each `- [ ]` item. Skip any example/gotcha blocks.

4. **Grade each check** by inspecting `./infra/` and running commands as needed:
   - Use `read` to inspect `.tf` files, `.tfvars`, `.hcl` files, and resource output files.
   - Use `get_tenv_version`, `get_tf_version`, `get_tg_version` for tool installation checks.
   - Use `run_terraform_init` when the check involves running `terraform init` - it downloads providers and initializes the backend.
   - Use `run_terraform_plan` when the check involves running `terraform plan` — it validates then plans in `./infra/` (or the relevant subdirectory).
   - Use `run_terraform_apply` when the check involves running `terraform apply` or checking outputs — it validates then applies.
   - For Terragrunt challenges (14–15), use `run_terragrunt_plan_all` to run `terragrunt run --all plan` in both `./infra/states/stg` and `./infra/states/prod`.

5. **Report results** using the output format below.

## Infrastructure Directory

- All user work is in `./infra/`.
- Early challenges (02–08) work from `./infra/` directly.
- Later challenges may nest deeper (`./infra/states/stg/`, `./infra/states/prod/`, etc.).
- Ignore generated artifacts: `*.txt` from `local_file`, `.terraform/`, `.terraform.tfstate`, `*.tfplan`.

## Output Format

```
## Challenge ## - <Name>

| # | Check | Result | Details |
|---|-------|--------|---------|
| 1 | <check description> | PASS / FAIL | <details> |
| 2 | <check description> | PASS / FAIL | <details> |
| ... | | | |

### Overall: <PASSED / FAILED>

<Summary of what was graded, what passed, what failed, and any tips for improvement if failed>
```
