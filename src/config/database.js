import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';

dotenv.config();

// Configure Neon for local development with Neon Local
if (process.env.NODE_ENV === 'development' && process.env.NEON_LOCAL_HOST) {
  // Neon Local uses HTTP endpoint (not websockets)
  neonConfig.fetchEndpoint = `http://${process.env.NEON_LOCAL_HOST}:${process.env.NEON_LOCAL_PORT || 5432}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
  console.log('🔧 Using Neon Local at:', neonConfig.fetchEndpoint);
} else {
  console.log('☁️  Using Neon Cloud');
}

const sql = neon(process.env.DATABASE_URL );

const db = drizzle(sql);

export { db, sql };
