import z from "zod";

export const lockdownLevelOptions = ["allow", "warn", "block"];
export const LockdownLevelSchema = z.enum(lockdownLevelOptions);
export type LockdownLevel = z.infer<typeof LockdownLevelSchema>;

export const LockdownSettingsSchema = z.object({
  protectedPatterns: z
    .array(z.string())
    .default(["**/.env*", "**/.git/**", "**/node_modules/**"]),
  external: z.object({
    protected: z.object({
      read: LockdownLevelSchema.default("block"),
      write: LockdownLevelSchema.default("block"),
      edit: LockdownLevelSchema.default("block"),
    }),
    unprotected: z.object({
      read: LockdownLevelSchema.default("allow"),
      write: LockdownLevelSchema.default("block"),
      edit: LockdownLevelSchema.default("block"),
    }),
  }),
  internal: z.object({
    protected: z.object({
      read: LockdownLevelSchema.default("warn"),
      write: LockdownLevelSchema.default("warn"),
      edit: LockdownLevelSchema.default("warn"),
    }),
    unprotected: z.object({
      read: LockdownLevelSchema.default("allow"),
      write: LockdownLevelSchema.default("warn"),
      edit: LockdownLevelSchema.default("warn"),
    }),
  }),
});
export type LockdownSettings = z.infer<typeof LockdownSettingsSchema>;
