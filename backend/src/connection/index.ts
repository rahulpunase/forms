import mysql2 from "mysql2";
import { Pool } from "mysql2/typings/mysql/lib/Pool";

class DbConnection {
  private pool: Pool | null = null;

  createPool(): void {
    this.pool = mysql2.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  getPool() {
    return this.pool;
  }
}

export default DbConnection;
