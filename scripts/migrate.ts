import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '../src/lib/db';

async function main() {
  try {
    console.log('Starting database migration...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();