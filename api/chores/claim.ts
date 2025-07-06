import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

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

  if (req.method === 'POST') {
    try {
      const choreId = parseInt(req.body.choreId);
      const user = await ensureDefaultUser();
      const result = await storage.claimChore(user.id, choreId);
      res.json(result);
    } catch (error) {
      console.error('Error claiming chore:', error);
      res.status(500).json({ message: "Failed to claim chore" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}