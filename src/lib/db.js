import { Pool } from 'pg';

export const pool = new Pool({
  // user: process.env.DB_USER || 'postgres',
  // host: process.env.DB_HOST || 'localhost',
  // database: process.env.DB_DATABASE || 'cna',
  // password: process.env.DB_PASSWORD || 'Master@rajat55',
  // port: process.env.DB_PORT || 5432,
  connectionString: process.env.POSTGRES_URL,
});
