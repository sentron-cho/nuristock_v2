import { SqlError } from "mariadb/*";

export const withError = (error: SqlError, options?: { tag?: string }) => {
  const { code, sqlMessage } = error as SqlError;
  console.error(`[ERROR:${options?.tag || ''}]`, error);

  return { code, message: sqlMessage };
};
