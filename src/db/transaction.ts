import { Pool } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

/** WebSocket sessions are owned and closed by each transaction/request. */
export const transaction: NeonDatabase<typeof schema>['transaction'] = async (callback, config) => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  try {
    return await drizzle(pool, { schema }).transaction(callback, config);
  } finally {
    await pool.end();
  }
};
