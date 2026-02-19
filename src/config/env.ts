import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
  BLOG_POSTS_DB_ID: z.string().min(1, "BLOG_POSTS_DB_ID is required"),
  ASSETS_DB_ID: z.string().min(1, "ASSETS_DB_ID is required"),
  WEBHOOK_SECRET: z.string().min(1, "WEBHOOK_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;

let _config: Env | null = null;

export function loadConfig(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    console.error(`Environment validation failed:\n${missing}`);
    process.exit(1);
  }

  _config = result.data;
  return _config;
}

export function getConfig(): Env {
  if (!_config) return loadConfig();
  return _config;
}
