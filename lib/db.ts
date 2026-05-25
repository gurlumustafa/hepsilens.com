import mysql from "mysql2/promise";

// Singleton connection pool — uygulama boyunca tek instance
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host:               process.env.DB_HOST     || "localhost",
      port:               Number(process.env.DB_PORT) || 3306,
      user:               process.env.DB_USER     || "root",
      password:           process.env.DB_PASSWORD || "",
      database:           process.env.DB_NAME     || "hepsilens",
      waitForConnections: true,
      connectionLimit:    10,
      queueLimit:         0,
      charset:            "utf8mb4",
    });
  }
  return pool;
}

/** Tek satır veya null döner */
export async function queryOne<T>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>(sql, params as any);
  return (rows[0] as T) ?? null;
}

/** Satır dizisi döner */
export async function queryMany<T>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await getPool().execute<mysql.RowDataPacket[]>(sql, params as any);
  return rows as T[];
}

/** INSERT / UPDATE / DELETE — ResultSetHeader döner */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<mysql.ResultSetHeader> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result] = await getPool().execute<mysql.ResultSetHeader>(sql, params as any);
  return result;
}
