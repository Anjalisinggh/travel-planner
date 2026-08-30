import { createRequire } from "node:module";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

const require = createRequire(import.meta.url);

function getD1Binding(): D1Database | undefined {
  try {
    const { env } = require("cloudflare:workers") as { env: { DB?: D1Database } };
    return env.DB;
  } catch {
    return undefined;
  }
}

export function getDb() {
  const binding = getD1Binding();
  if (!binding) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(binding, { schema });
}
