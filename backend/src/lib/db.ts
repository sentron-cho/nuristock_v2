import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config({ path: '.env' });

console.log("[SERVER ENV] ====> ", {
  host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // database: process.env.DB_NAME,
  origin: process.env.FRONT_END_ORIGIN,
});

export const pool = mariadb.createPool({
  host: process.env.DB_HOST || "db.nurioweb.co.kr", //"localhost", // db.nurioweb.co.kr
  port: 3306,
  user: process.env.DB_USER || "nurimon", // "root", // "nurimon"
  password: process.env.DB_PASSWORD || "qlalfdldi",
  database: process.env.DB_NAME || "nuristock_v2",
  connectionLimit: 5,
});

export const db = {
  async query<T = any>(sql: string, values?: any[]): Promise<T[]> {
    let conn;
    try {
      conn = await pool.getConnection();
      console.log("[DB CONN] ====> ", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        origin: process.env.FRONT_END_ORIGIN,
      });

      const result = await conn.query(sql, values);
      return result as T[];
    } finally {
      if (conn) conn.end();
    }
  },
};
