import { Handler } from '@netlify/functions';
import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../../src/db/schema';
import { verifyPassword } from '../../src/lib/auth';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:tea-self-select.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

const api = express();
const router = Router();

// Middleware
api.use(cors());
api.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Login route
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Get user from database
    const user = await db.select().from(schema.users).where(eq(schema.users.username, username)).get();

    if (!user) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // Update last login time
    const now = new Date().toISOString();
    await db
      .update(schema.users)
      .set({
        lastLogin: now,
        lastActive: now,
      })
      .where(eq(schema.users.id, user.id))
      .run();

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登入時發生錯誤' });
  }
});

// Protected routes
router.use(authenticate);

// Mount router
api.use('/.netlify/functions/api', router);

// Export handler
export const handler: Handler = serverless(api);