# Lockdown

A Pi extension that adds security constraints to the agent's tool usage. It intercepts every tool call and enforces fine-grained read/edit/write permissions based on whether files are inside or outside the project, and whether they match protected patterns (e.g., `.env`, `.git/`, `node_modules/`).

## Features

- **Bash blocking** — All `bash` tool calls are blocked by default
- **Granular permissions** — Three modes per permission: `allow`, `warn`, `block`
- **Two dimensions of control**:
  - **Location**: internal (within the project) vs. external (outside the project)
  - **Protection level**: protected (matching `protectedPatterns`) vs. unprotected (everything else)
- **Interactive session configuration** — Adjust permissions mid-session via a TUI dialog
- **Settings persistence** — Per-project or global settings via `settings.json`
- **Quick reset** — One command to restore all permissions to defaults

## Default Permissions

| Location | Protection | Read | Edit | Write |
|----------|------------|------|------|-------|
| **External** | Protected | `block` | `block` | `block` |
| **External** | Unprotected | `warn` | `block` | `block` |
| **Internal** | Protected | `warn` | `warn` | `warn` |
| **Internal** | Unprotected | `allow` | `warn` | `warn` |

## Protected Patterns (default)

```
**/.env*
**/.git/**
**/node_modules/**
```

## Configuration
You may configure Lockdown by adding a `lockdown` property in your project or global `settings.json` with one or more of the keys as outlined in the default settings below. Configuration is optional: any omitted fields fall back to the built-in defaults.

```json
{
  "lockdown": {
    "protectedPatterns": [
      "**/.env*",
      "**/.git/**",
      "**/node_modules/**"
    ],
    "external": {
      "protected": {
        "read": "block",
        "write": "block",
        "edit": "block"
      },
      "unprotected": {
        "read": "warn",
        "write": "block",
        "edit": "block"
      }
    },
    "internal": {
      "protected": {
        "read": "warn",
        "write": "warn",
        "edit": "warn"
      },
      "unprotected": {
        "read": "allow",
        "write": "warn",
        "edit": "warn"
      }
    }
  }
}
```

### Per-session override

Run the `/lockdown:session-permissions` command to open an interactive TUI where you can toggle any of the 12 permission slots on the fly. Changes apply immediately and last for the current session only.

## Commands

| Command | Description |
|---------|-------------|
| `/lockdown:session-permissions` | Open the interactive session permissions dialog |
| `/lockdown:reset` | Reset all permissions to settings/default values |

## How it Works

1. On `session_start`, lockdown sets the agent's active tool list to the safe subset: `read`, `edit`, `write`, `grep`, `find`, `ls`
2. On every `tool_call`, the extension evaluates:
   - **Is the target path internal or external?** — Resolved relative to the project CWD
   - **Does the path match a protected pattern?** — Uses glob matching
   - **What is the action type?** — `read`, `edit`, `write`, `grep`, `list`, etc.
3. The permission is looked up in the 4×3 permission matrix (2 locations × 2 protection levels × 3 action types)
4. Depending on the permission level:
   - **`block`** — The call is denied with a `[LOCKDOWN]` reason
   - **`warn`** — A select dialog prompts the user to allow or deny
   - **`allow`** — The call proceeds normally

### Empty write protection

Lockdown also blocks empty writes (`write` with empty content) as a safeguard against file soft-deletion workarounds.

## Installation

Place the extension in your extensions directory for auto-discovery:

**Project-local:**

```bash
cp -r .pi/extensions/lockdown .pi/extensions/lockdown
```

**Global:**

```bash
cp -r .pi/extensions/lockdown ~/.pi/agent/extensions/lockdown
```

Or load manually for testing:

```bash
pi --extension .pi/extensions/lockdown
```

## Extension Structure

```
lockdown/
├── index.ts        # Entry point — event handlers, commands, TUI
├── schema.ts       # Zod schemas for settings validation
├── utils.ts        # Path resolution helpers (isInside, loadSettings)
├── package.json    # Dependencies (zod)
└── README.md       # This file
```
