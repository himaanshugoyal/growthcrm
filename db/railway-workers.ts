import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new pg.Pool({ connectionString }) : null;

function railwayPool(): pg.Pool {
  if (!pool) {
    throw new Error(
      "DATABASE_URL is required for database-backed routes on Railway. Add a PostgreSQL service and connect it to this service.",
    );
  }
  return pool;
}

function postgresSql(sql: string): string {
  let parameter = 0;
  return sql.replace(/\?/g, () => `$${++parameter}`);
}

class RailwayStatement {
  private values: unknown[] = [];

  constructor(private readonly sql: string) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async run() {
    const result = await railwayPool().query(postgresSql(this.sql), this.values);
    return {
      success: true,
      meta: { changes: result.rowCount ?? 0 },
      results: result.rows,
    };
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    const result = await railwayPool().query(postgresSql(this.sql), this.values);
    return (result.rows[0] as T | undefined) ?? null;
  }

  async all<T = Record<string, unknown>>() {
    const result = await railwayPool().query(postgresSql(this.sql), this.values);
    return { success: true, results: result.rows as T[] };
  }
}

const database = {
  prepare(sql: string) {
    return new RailwayStatement(sql);
  },
  async exec(sql: string) {
    await railwayPool().query(sql);
    return { count: 1, duration: 0 };
  },
};

// This module is aliased to `cloudflare:workers` only for Railway builds.
// The structural cast lets existing D1 call sites work without platform
// conditionals while PostgreSQL provides durable Railway storage.
export const env = { DB: database as unknown as D1Database };
