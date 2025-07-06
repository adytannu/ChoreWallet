import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

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
      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ message: "Failed to get user data" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}