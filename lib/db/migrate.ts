import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// This script applies all pending migrations to the database
async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  console.log('Starting database migration...');
  const sql = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(sql);

  // This runs all migrations from the migrations folder
  await migrate(db, { migrationsFolder: './lib/db/migrations' });

  console.log('Migration completed successfully!');
  await sql.end();
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
