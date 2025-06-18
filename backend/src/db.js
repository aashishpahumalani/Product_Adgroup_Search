import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'ad_analysis',
  password: process.env.PGPASSWORD || 'password',
  port: process.env.PGPORT || 5432,
});

export default pool;
