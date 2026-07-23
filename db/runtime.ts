import { env } from "cloudflare:workers";

export function getDatabase(): D1Database {
  if (!env.DB) {
    throw new Error(
      "Database binding DB is unavailable. Use the local Cloudflare D1 binding or set DATABASE_URL on Railway.",
    );
  }
  return env.DB;
}

export async function allRows<T>(sql: string, ...values: unknown[]): Promise<T[]> {
  const result = await getDatabase().prepare(sql).bind(...values).all<T>();
  return result.results ?? [];
}

export async function firstRow<T>(sql: string, ...values: unknown[]): Promise<T | null> {
  return getDatabase().prepare(sql).bind(...values).first<T>();
}
