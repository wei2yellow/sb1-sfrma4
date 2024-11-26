import express from 'express';
import cors from 'cors';
import { db } from '../src/lib/db';
import { users } from '../src/db/schema';
import { verifyPassword } from '../src/lib/auth';
import { eq } from 'drizzle-orm';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Authentication endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.select().from(users).where(eq(users.username, username)).get();

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // Update last login time
    await db
      .update(users)
      .set({
        lastLogin: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      })
      .where(eq(users.id, user.id))
      .run();

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登入時發生錯誤' });
  }
});

// Protected routes middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未授權' });
  }
  try {
    // Verify token and attach user to request
    // Implementation depends on your token strategy
    next();
  } catch (error) {
    res.status(401).json({ error: '未授權' });
  }
};

// Protected routes
app.use('/api', authenticate);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});