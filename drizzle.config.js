import dotenv from 'dotenv';
// Load .env.development when running in development mode so migrations use the right DB URL
const envPath = process.env.DRIZZLE_ENV_FILE || (process.env.NODE_ENV === 'development' ? '.env.development' : '.env');
dotenv.config({ path: envPath });

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://neon:npg@localhost:5432/neondb',
  },
};
