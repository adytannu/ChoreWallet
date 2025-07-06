import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertChoreSchema } from '../shared/schema';
import { z } from 'zod';

// For this demo, we'll create a default user if none exists
const ensureDefaultUser = async () => {
  let user = await storage.getUserByUsername("kid");
  if (!user) {
    user = await storage.createUser({
      username: "kid",
      password: "password123"
    });
  }
  return user;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const user = await ensureDefaultUser();
      const chores = await storage.getChores(user.id);
      res.json(chores);
    } catch (error) {
      console.error('Error getting chores:', error);
      res.status(500).json({ message: "Failed to get chores" });
    }
  } else if (req.method === 'POST') {
    try {
      const choreData = insertChoreSchema.parse(req.body);
      const user = await ensureDefaultUser();
      const chore = await storage.createChore(user.id, choreData);
      res.json(chore);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid chore data", errors: error.errors });
      } else {
        console.error('Error creating chore:', error);
        res.status(500).json({ message: "Failed to create chore" });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}