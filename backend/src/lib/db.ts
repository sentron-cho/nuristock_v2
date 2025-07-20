// src/lib/db.ts
import mariadb from "mariadb";

// console.log({ host: process.env.DB_HOST, database: process.env.DB_NAME });

export const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "qlalfdldi",
  database: process.env.DB_NAME || "nuristock",
  connectionLimit: 5,
});

export const db = {
  async query<T = any>(sql: string, values?: any[]): Promise<T[]> {
    let conn;
    try {
      conn = await pool.getConnection();
      console.log({ host: process.env.DB_HOST, database: process.env.DB_NAME });

      const result = await conn.query(sql, values);
      return result as T[];
    } finally {
      if (conn) conn.end();
    }
  },
};
