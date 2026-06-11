/**
 * coach-ai-terraform Extension
 *
 * Provides custom tools for the Terraform/Terragrunt challenge series:
 * - get_tenv_version: Check if `tenv` is installed and report its version
 * - get_tf_version: Check if `terraform` is installed and report its version
 * - get_tg_version: Check if `terragrunt` is installed and report its version
 * - run_terraform_init: Run `terraform init`
 * - run_terraform_plan: Run `terraform validate` followed by `terraform plan`
 * - run_terraform_apply: Run `terraform validate` followed by `terraform apply -auto-approve`
 * - run_terragrunt_plan_all: Run `terragrunt run --all plan --parallelism 1`
 *
 * Usage:
 * 1. Save this file to .pi/extensions/coach-ai-terraform/index.ts (project-local)
 *    or ~/.pi/agent/extensions/coach-ai-terraform/index.ts (global)
 * 2. Restart pi or use /reload
 * 3. The LLM can now call these tools
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "get_tenv_version",
    label: "Get tenv Version",
    description:
      "Check if `tenv` is installed and report its version. " +
      "Runs `tenv version` to verify the installation and displays the output. " +
      "Use this to validate that tenv is correctly installed and available on the PATH.",
    promptSnippet:
      "Run tenv --version to verify tenv is installed and accessible",
    promptGuidelines: [
      "Use get_tenv_version to verify tenv installation before running tenv commands.",
    ],
    parameters: Type.Object({}),

    async execute(_toolCallId, _params, signal, _onUpdate, _ctx) {
      let stdout: string;
      let stderr: string;
      let exitCode: number;

      try {
        const result = await pi.exec("tenv", ["version"], { signal });
        stdout = result.stdout ?? "";
        stderr = result.stderr ?? "";
        exitCode = result.code ?? 0;
      } catch (err: any) {
        // Command not found or failed to execute
        const message = err.message ?? String(err);
        return {
          content: [
            {
              type: "text",
              text:
                "❌ `tenv` is not installed or not available on the PATH.\n\n" +
                `Error: ${message}`,
            },
          ],
          details: {
            installed: false,
            error: message,
          },
        };
      }

      const output = [stdout, stderr].filter(Boolean).join("\n").trim();

      if (exitCode !== 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `❌ \`tenv\` ran but exited with code ${exitCode}.\n\n` +
                `Output:\n${output || "(no output)"}`,
            },
          ],
          details: {
            installed: false,
            exitCode,
            output,
          },
        };
      }

      // Parse version from output (handles formats like "tenv 4.1.0" or "v4.1.0")
      const versionMatch = output.match(/(\d+\.\d+\.\d+[\w.-]*)/);

      return {
        content: [
          {
            type: "text",
            text:
              `✅ \`tenv\` is installed and available.\n\n` +
              `${output}\n` +
              (versionMatch
                ? `\nDetected version: \`${versionMatch[1]}\``
                : ""),
          },
        ],
        details: {
          installed: true,
          version: versionMatch?.[1] ?? null,
          fullOutput: output,
        },
      };
    },
  });

  pi.registerTool({
    name: "get_tf_version",
    label: "Get Terraform Version",
    description:
      "Check if \`terraform\` is installed and report its version. " +
      "Runs \`terraform version\` to verify the installation and displays the output. " +
      "Use this to validate that terraform is correctly installed and available on the PATH.",
    promptSnippet:
      "Run terraform --version to verify terraform is installed and accessible",
    promptGuidelines: [
      "Use get_tf_version to verify terraform installation before running terraform commands.",
    ],
    parameters: Type.Object({}),

    async execute(_toolCallId, _params, signal, _onUpdate, _ctx) {
      let stdout: string;
      let stderr: string;
      let exitCode: number;

      try {
        const result = await pi.exec("terraform", ["version"], { signal });
        stdout = result.stdout ?? "";
        stderr = result.stderr ?? "";
        exitCode = result.code ?? 0;
      } catch (err: any) {
        // Command not found or failed to execute
        const message = err.message ?? String(err);
        return {
          content: [
            {
              type: "text",
              text:
                "❌ \`terraform\` is not installed or not available on the PATH.\n\n" +
                `Error: ${message}`,
            },
          ],
          details: {
            installed: false,
            error: message,
          },
        };
      }

      const output = [stdout, stderr].filter(Boolean).join("\n").trim();

      if (exitCode !== 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `❌ \`terraform\` ran but exited with code ${exitCode}.\n\n` +
                `Output:\n${output || "(no output)"}`,
            },
          ],
          details: {
            installed: false,
            exitCode,
            output,
          },
        };
      }

      // Parse version from output (handles formats like "Terraform v1.9.0" or "1.9.0")
      const versionMatch = output.match(/(\d+\.\d+\.\d+[\w.-]*)/);

      return {
        content: [
          {
            type: "text",
            text:
              `✅ \`terraform\` is installed and available.\n\n` +
              `${output}\n` +
              (versionMatch
                ? `\nDetected version: \`${versionMatch[1]}\``
                : ""),
          },
        ],
        details: {
          installed: true,
          version: versionMatch?.[1] ?? null,
          fullOutput: output,
        },
      };
    },
  });

  pi.registerTool({
    name: "get_tg_version",
    label: "Get Terragrunt Version",
    description:
      "Check if \`terragrunt\` is installed and report its version. " +
      "Runs \`terragrunt --version\` to verify the installation and displays the output. " +
      "Use this to validate that terragrunt is correctly installed and available on the PATH.",
    promptSnippet:
      "Run terragrunt --version to verify terragrunt is installed and accessible",
    promptGuidelines: [
      "Use get_tg_version to verify terragrunt installation before running terragrunt commands.",
    ],
    parameters: Type.Object({}),

    async execute(_toolCallId, _params, signal, _onUpdate, _ctx) {
      let stdout: string;
      let stderr: string;
      let exitCode: number;

      try {
        const result = await pi.exec("terragrunt", ["--version"], { signal });
        stdout = result.stdout ?? "";
        stderr = result.stderr ?? "";
        exitCode = result.code ?? 0;
      } catch (err: any) {
        // Command not found or failed to execute
        const message = err.message ?? String(err);
        return {
          content: [
            {
              type: "text",
              text:
                "❌ \`terragrunt\` is not installed or not available on the PATH.\n\n" +
                `Error: ${message}`,
            },
          ],
          details: {
            installed: false,
            error: message,
          },
        };
      }

      const output = [stdout, stderr].filter(Boolean).join("\n").trim();

      if (exitCode !== 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `❌ \`terragrunt\` ran but exited with code ${exitCode}.\n\n` +
                `Output:\n${output || "(no output)"}`,
            },
          ],
          details: {
            installed: false,
            exitCode,
            output,
          },
        };
      }

      // Parse version from output (handles formats like "terragrunt version v0.67.0" or "0.67.0")
      const versionMatch = output.match(/(\d+\.\d+\.\d+[\w.-]*)/);

      return {
        content: [
          {
            type: "text",
            text:
              `✅ \`terragrunt\` is installed and available.\n\n` +
              `${output}\n` +
              (versionMatch
                ? `\nDetected version: \`${versionMatch[1]}\``
                : ""),
          },
        ],
        details: {
          installed: true,
          version: versionMatch?.[1] ?? null,
          fullOutput: output,
        },
      };
    },
  });

  pi.registerTool({
    name: "run_terraform_plan",
    label: "Run Terraform Plan",
    description:
      "Run `terraform validate` first, and if validation passes, then run `terraform plan`. " +
      "This tool executes both commands sequentially in the terraform working directory. " +
      "If validation fails, the plan is not run and the validation errors are returned.",
    promptSnippet: "Run terraform validate then terraform plan",
    promptGuidelines: [
      "Use run_terraform_plan to validate and preview infrastructure changes before applying.",
    ],
    parameters: Type.Object({
      workingDir: Type.Optional(
        Type.String({
          description:
            "Working directory containing the Terraform configuration. Defaults to the current directory.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const workingDir = params.workingDir ?? ctx.cwd;

      // Step 1: Run terraform validate
      const validateResult = await pi.exec("terraform", ["validate"], {
        signal,
        cwd: workingDir,
      });

      const validateOutput = [
        validateResult.stdout ?? "",
        validateResult.stderr ?? "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (validateResult.code !== 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `❌ \`terraform validate\` failed (exit code ${validateResult.code}).\nPlan was not run.\n\n` +
                `Output:\n${validateOutput || "(no output)"}`,
            },
          ],
          details: {
            status: "validation_failed",
            exitCode: validateResult.code,
            output: validateOutput,
            workingDir,
          },
        };
      }

      // Step 2: Run terraform plan
      const planResult = await pi.exec("terraform", ["plan", "-input=false"], {
        signal,
        cwd: workingDir,
      });

      const planOutput = [planResult.stdout ?? "", planResult.stderr ?? ""]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (planResult.code === 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `✅ \`terraform validate\` passed.\n` +
                `📋 \`terraform plan\` completed with no changes.\n\n` +
                `${planOutput || "(no changes to report)"}`,
            },
          ],
          details: {
            status: "no_changes",
            exitCode: planResult.code,
            output: planOutput,
            workingDir,
          },
        };
      }

      // Exit code 2 means plan succeeded but changes detected
      if (planResult.code === 2) {
        return {
          content: [
            {
              type: "text",
              text:
                `✅ \`terraform validate\` passed.\n` +
                `⚠️ \`terraform plan\` detected changes (exit code 2).\n\n` +
                `${planOutput}`,
            },
          ],
          details: {
            status: "changes_detected",
            exitCode: planResult.code,
            output: planOutput,
            workingDir,
          },
        };
      }

      // Other error code
      return {
        content: [
          {
            type: "text",
            text:
              `✅ \`terraform validate\` passed.\n` +
              `❌ \`terraform plan\` failed (exit code ${planResult.code}).\n\n` +
              `Output:\n${planOutput || "(no output)"}`,
          },
        ],
        details: {
          status: "plan_failed",
          exitCode: planResult.code,
          output: planOutput,
          workingDir,
        },
      };
    },
  });

  pi.registerTool({
    name: "run_terraform_apply",
    label: "Run Terraform Apply",
    description:
      "Run `terraform validate` first, and if validation passes, then run `terraform apply -auto-approve`. " +
      "This tool executes both commands sequentially in the terraform working directory. " +
      "If validation fails, the apply is not run and the validation errors are returned. " +
      "This will apply infrastructure changes without prompting for confirmation.",
    promptSnippet: "Run terraform validate then terraform apply -auto-approve",
    promptGuidelines: [
      "Use run_terraform_apply to apply infrastructure changes after reviewing the plan output.",
      "Always run run_terraform_plan first to review changes before applying.",
    ],
    parameters: Type.Object({
      workingDir: Type.Optional(
        Type.String({
          description:
            "Working directory containing the Terraform configuration. Defaults to the current directory.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const workingDir = params.workingDir ?? ctx.cwd;

      // Step 1: Run terraform validate
      const validateResult = await pi.exec("terraform", ["validate"], {
        signal,
        cwd: workingDir,
      });

      const validateOutput = [
        validateResult.stdout ?? "",
        validateResult.stderr ?? "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (validateResult.code !== 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `❌ \`terraform validate\` failed (exit code ${validateResult.code}).\nApply was not run.\n\n` +
                `Output:\n${validateOutput || "(no output)"}`,
            },
          ],
          details: {
            status: "validation_failed",
            exitCode: validateResult.code,
            output: validateOutput,
            workingDir,
          },
        };
      }

      // Step 2: Run terraform apply -auto-approve
      const applyResult = await pi.exec(
        "terraform",
        ["apply", "-auto-approve"],
        { signal, cwd: workingDir },
      );

      const applyOutput = [applyResult.stdout ?? "", applyResult.stderr ?? ""]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (applyResult.code === 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `✅ \`terraform validate\` passed.\n` +
                `✅ \`terraform apply\` completed successfully.\n\n` +
                `${applyOutput || "(no changes to report)"}`,
            },
          ],
          details: {
            status: "success",
            exitCode: applyResult.code,
            output: applyOutput,
            workingDir,
          },
        };
      }

      // Error code - apply failed
      return {
        content: [
          {
            type: "text",
            text:
              `✅ \`terraform validate\` passed.\n` +
              `❌ \`terraform apply\` failed (exit code ${applyResult.code}).\n\n` +
              `Output:\n${applyOutput || "(no output)"}`,
          },
        ],
        details: {
          status: "apply_failed",
          exitCode: applyResult.code,
          output: applyOutput,
          workingDir,
        },
      };
    },
  });

  pi.registerTool({
    name: "run_terragrunt_plan_all",
    label: "Run Terragrunt Plan All",
    description:
      "Run `terragrunt run --all plan --parallelism 1` across all modules in the project. " +
      "This tool executes the command in the terragrunt working directory to plan infrastructure changes " +
      "for all modules sequentially (parallelism 1).",
    promptSnippet: "Run terragrunt run --all plan --parallelism 1",
    promptGuidelines: [
      "Use run_terragrunt_plan_all to plan changes across all terragrunt modules in the project.",
    ],
    parameters: Type.Object({
      workingDir: Type.Optional(
        Type.String({
          description:
            "Working directory containing the Terragrunt configuration. Defaults to the current directory.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const workingDir = params.workingDir ?? ctx.cwd;

      const planResult = await pi.exec(
        "terragrunt",
        ["run", "--all", "plan", "--parallelism", "1"],
        { signal, cwd: workingDir },
      );

      const planOutput = [planResult.stdout ?? "", planResult.stderr ?? ""]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (planResult.code === 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `✅ \`terragrunt run --all plan\` completed successfully.\n\n` +
                `${planOutput || "(no changes to report)"}`,
            },
          ],
          details: {
            status: "success",
            exitCode: planResult.code,
            output: planOutput,
            workingDir,
          },
        };
      }

      // Non-zero exit code - plan failed
      return {
        content: [
          {
            type: "text",
            text:
              `❌ \`terragrunt run --all plan\` failed (exit code ${planResult.code}).\n\n` +
              `Output:\n${planOutput || "(no output)"}`,
          },
        ],
        details: {
          status: "plan_failed",
          exitCode: planResult.code,
          output: planOutput,
          workingDir,
        },
      };
    },
  });

  pi.registerTool({
    name: "run_terraform_init",
    label: "Run Terraform Init",
    description:
      "Run `terraform init` to initialize the working directory. " +
      "This downloads providers, installs plugins, and sets up the backend " +
      "for the Terraform working directory. It should be run before any other " +
      "Terraform commands.",
    promptSnippet: "Run terraform init",
    promptGuidelines: [
      "Use run_terraform_init before running terraform plan, apply, or other commands.",
    ],
    parameters: Type.Object({
      workingDir: Type.Optional(
        Type.String({
          description:
            "Working directory containing the Terraform configuration. Defaults to the current directory.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const workingDir = params.workingDir ?? ctx.cwd;

      const initResult = await pi.exec("terraform", ["init"], {
        signal,
        cwd: workingDir,
      });

      const initOutput = [initResult.stdout ?? "", initResult.stderr ?? ""]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (initResult.code === 0) {
        return {
          content: [
            {
              type: "text",
              text:
                `✅ \`terraform init\` completed successfully.\n\n` +
                `${initOutput || "(no output)"}`,
            },
          ],
          details: {
            status: "success",
            exitCode: initResult.code,
            output: initOutput,
            workingDir,
          },
        };
      }

      // Non-zero exit code - init failed
      return {
        content: [
          {
            type: "text",
            text:
              `❌ \`terraform init\` failed (exit code ${initResult.code}).\n\n` +
              `Output:\n${initOutput || "(no output)"}`,
          },
        ],
        details: {
          status: "init_failed",
          exitCode: initResult.code,
          output: initOutput,
          workingDir,
        },
      };
    },
  });
}
