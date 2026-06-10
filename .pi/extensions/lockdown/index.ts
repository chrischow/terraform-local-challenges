import {
  ExtensionAPI,
  getSettingsListTheme,
  isToolCallEventType,
} from "@earendil-works/pi-coding-agent";
import path from "node:path";
import {
  lockdownLevelOptions,
  LockdownLevelSchema,
  LockdownSettingsSchema,
} from "./schema";
import loadSettings, { isInside } from "./utils";

import {
  Box,
  Container,
  type SettingItem,
  SettingsList,
  Text,
} from "@earendil-works/pi-tui";

// Settings
let lockdownSettings = LockdownSettingsSchema.parse({
  external: { protected: {}, unprotected: {} },
  internal: { protected: {}, unprotected: {} },
});

/**
 * Lockdown: A Pi extension to add security constraints to agents' tool usage.
 */
export default function (pi: ExtensionAPI) {
  // Set allowed tools
  pi.on("session_start", (_, ctx) => {
    // Set tools (including safe custom tools)
    pi.setActiveTools([
      "read",
      "edit",
      "write",
      "grep",
      "find",
      "ls",
      "get_tenv_version",
      "get_tf_version",
      "get_tg_version",
      "run_terraform_plan",
      "run_terraform_apply",
      "run_terraform_destroy",
      "run_terraform_init",
    ]);

    // Get settings
    lockdownSettings = loadSettings(ctx);
  });

  pi.on("tool_call", async (event, ctx) => {
    // Block bash
    if (isToolCallEventType("bash", event)) {
      return { block: true, reason: "[LOCKDOWN] Bash usage blocked." };
    }

    const isRead = isToolCallEventType("read", event);
    const isEdit = isToolCallEventType("edit", event);
    const isWrite = isToolCallEventType("write", event);
    const isGrep = isToolCallEventType("grep", event);
    const isFind = isToolCallEventType("find", event);
    const isLs = isToolCallEventType("ls", event);

    // Special case: Prevent deletion workaround
    if (isWrite && event.input.content.trim().length === 0) {
      return {
        block: true,
        reason:
          "[LOCKDOWN] Not allowed to soft-remove file by writing empty content to file.",
      };
    }

    // Compute permissions
    const hasPath = isRead || isEdit || isWrite;
    let inputPath = ".";
    if (hasPath) {
      inputPath = event.input.path;
    } else if (isGrep || isFind || isLs) {
      inputPath = event.input.path ?? ".";
    }
    const isInternal = isInside(ctx.cwd, inputPath);
    const isProtected = lockdownSettings.protectedPatterns.some((pattern) =>
      path.matchesGlob(inputPath, pattern),
    );
    const location: "internal" | "external" = isInternal
      ? "internal"
      : "external";
    const protection: "protected" | "unprotected" = isProtected
      ? "protected"
      : "unprotected";

    let permAction: "read" | "edit" | "write";
    let displayAction: string[] = [];
    let target: string;

    if (isRead) {
      permAction = "read";
      displayAction.push("read");
      target = "file";
    } else if (isGrep) {
      permAction = "read";
      displayAction.push("grep");
      target = "files";
    } else if (isFind || isLs) {
      permAction = "read";
      displayAction.push("list");
      target = "directories";
    } else if (isEdit) {
      permAction = "edit";
      displayAction.push("edit");
      target = "file";
    } else if (isWrite) {
      permAction = "write";
      displayAction.push("write");
      target = "file";
    } else {
      // Default to strictest
      permAction = "write";
      displayAction.push("perform");
      target = "action";
    }

    if (!isInternal) {
      displayAction.push("external");
    }
    if (isProtected) {
      displayAction.push("protected");
    }

    const fullAction = displayAction.join(" ");
    const permission = lockdownSettings[location][protection][permAction];

    switch (permission) {
      case "block":
        return {
          block: true,
          reason: `[LOCKDOWN] Not allowed to ${fullAction} ${target} (path: ${inputPath}).`,
        };
      case "warn":
        const choice = await ctx.ui.select(
          `[LOCKDOWN]\n⚠️ Allow agent to ${fullAction} ${target}?\n\n${inputPath}`,
          ["Yes", "No"],
        );

        if (choice !== "Yes") {
          return {
            block: true,
            reason: "[LOCKDOWN] Action blocked by user.",
          };
        }
        return;
      case "allow":
        return;
    }
  });

  // Reset permissions
  pi.registerCommand("lockdown:reset", {
    description:
      "Reset permissions to those specified in settings.json and/or defaults.",
    handler: async (_, ctx) => {
      lockdownSettings = loadSettings(ctx);
      ctx.ui.notify("Permissions have been reset.", "info");
    },
  });

  // Temporarily update permissions
  pi.registerCommand("lockdown:session-permissions", {
    description: "Configure file access permissions for session.",
    handler: async (_args, ctx) => {
      const items: SettingItem[] = [
        {
          id: "external-protected-read",
          label: "Read   external  protected   files",
          currentValue: lockdownSettings.external.protected.read,
          values: lockdownLevelOptions,
        },
        {
          id: "external-protected-edit",
          label: "Edit   external  protected   files",
          currentValue: lockdownSettings.external.protected.edit,
          values: lockdownLevelOptions,
        },
        {
          id: "external-protected-write",
          label: "Write  external  protected   files",
          currentValue: lockdownSettings.external.protected.write,
          values: lockdownLevelOptions,
        },
        {
          id: "external-unprotected-read",
          label: "Read   external  unprotected files",
          currentValue: lockdownSettings.external.unprotected.read,
          values: lockdownLevelOptions,
        },
        {
          id: "external-unprotected-edit",
          label: "Edit   external  unprotected files",
          currentValue: lockdownSettings.external.unprotected.edit,
          values: lockdownLevelOptions,
        },
        {
          id: "external-unprotected-write",
          label: "Write  external  unprotected files",
          currentValue: lockdownSettings.external.unprotected.write,
          values: lockdownLevelOptions,
        },
        {
          id: "internal-protected-read",
          label: "Read   internal  protected   files",
          currentValue: lockdownSettings.internal.protected.read,
          values: lockdownLevelOptions,
        },
        {
          id: "internal-protected-edit",
          label: "Edit   internal  protected   files",
          currentValue: lockdownSettings.internal.protected.edit,
          values: lockdownLevelOptions,
        },
        {
          id: "internal-protected-write",
          label: "Write  internal  protected   files",
          currentValue: lockdownSettings.internal.protected.write,
          values: lockdownLevelOptions,
        },
        {
          id: "internal-unprotected-read",
          label: "Read   internal  unprotected files",
          currentValue: lockdownSettings.internal.unprotected.read,
          values: lockdownLevelOptions,
        },
        {
          id: "internal-unprotected-edit",
          label: "Edit   internal  unprotected files",
          currentValue: lockdownSettings.internal.unprotected.edit,
          values: lockdownLevelOptions,
        },
        {
          id: "internal-unprotected-write",
          label: "Write  internal  unprotected files",
          currentValue: lockdownSettings.internal.unprotected.write,
          values: lockdownLevelOptions,
        },
      ];

      await ctx.ui.custom((_tui, theme, _kb, done) => {
        const container = new Container();

        const titleBox = new Box(0, 1);
        titleBox.addChild(
          new Text(theme.fg("accent", theme.bold("Session Permissions")), 0, 0),
        );
        titleBox.addChild(
          new Text(
            theme.fg(
              "dim",
              "Toggle file access permissions for the session. Changes are immediately applied.",
            ),
            0,
            0,
          ),
        );

        container.addChild(titleBox);

        const settingsList = new SettingsList(
          items,
          Math.min(items.length + 2, 15),
          getSettingsListTheme(),
          (id, newValue) => {
            // Handle value change
            const [location, protection, perm] = id.split("-");
            lockdownSettings[location as "external" | "internal"][
              protection as "protected" | "unprotected"
            ][perm as "read" | "write" | "edit"] =
              LockdownLevelSchema.parse(newValue);
          },
          () => done(undefined), // On close
          { enableSearch: true }, // Optional: enable fuzzy search by label
        );
        container.addChild(settingsList);

        return {
          render: (w) => container.render(w),
          invalidate: () => container.invalidate(),
          handleInput: (data) => settingsList.handleInput?.(data),
        };
      });
    },
  });
}
