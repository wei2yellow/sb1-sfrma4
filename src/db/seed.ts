import { db } from './index';
import { users } from './schema';
import { generateId } from '../lib/utils';
import { hash } from '../lib/auth';

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // 初始化管理者帳號
    const adminUser = {
      id: generateId(),
      username: 'admin',
      password: await hash('admin123'),
      name: '系統管理員',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    };

    await db.insert(users).values(adminUser).run();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();