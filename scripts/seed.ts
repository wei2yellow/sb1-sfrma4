import { db } from '../src/lib/db';
import { users } from '../src/db/schema';
import { hash } from '../src/lib/auth';
import { generateId } from '../src/lib/utils';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    console.log('Starting database seeding...');

    // Check if super admin exists
    const superAdminExists = await db.select().from(users).where(eq(users.username, 'weiwei')).get();
    
    if (!superAdminExists) {
      const hashedPassword = await hash('920321');
      
      await db.insert(users).values({
        id: generateId(),
        username: 'weiwei',
        password: hashedPassword,
        name: '超級管理者',
        role: 'SUPER_ADMIN',
        createdAt: new Date().toISOString()
      });
      
      console.log('Super admin user created successfully');
    } else {
      console.log('Super admin user already exists, skipping...');
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();