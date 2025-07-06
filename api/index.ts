import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertChoreSchema, insertGoalSchema, allocateToGoalSchema } from '../shared/schema';
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

  const { url = '', method = 'GET' } = req;
  const path = url.replace('/api', '');

  try {
    // User endpoint
    if (path === '/user' && method === 'GET') {
      const user = await ensureDefaultUser();
      return res.json(user);
    }

    // Chores endpoints
    if (path === '/chores' && method === 'GET') {
      const user = await ensureDefaultUser();
      const chores = await storage.getChores(user.id);
      return res.json(chores);
    }

    if (path === '/chores' && method === 'POST') {
      const choreData = insertChoreSchema.parse(req.body);
      const user = await ensureDefaultUser();
      const chore = await storage.createChore(user.id, choreData);
      return res.json(chore);
    }

    // Chore claim endpoint
    if (path.match(/^\/chores\/\d+\/claim$/) && method === 'POST') {
      const choreId = parseInt(path.split('/')[2]);
      const user = await ensureDefaultUser();
      const result = await storage.claimChore(user.id, choreId);
      return res.json(result);
    }

    // Goals endpoints
    if (path === '/goals' && method === 'GET') {
      const user = await ensureDefaultUser();
      const goals = await storage.getGoals(user.id);
      return res.json(goals);
    }

    if (path === '/goals' && method === 'POST') {
      const goalData = insertGoalSchema.parse(req.body);
      const user = await ensureDefaultUser();
      const goal = await storage.createGoal(user.id, goalData);
      return res.json(goal);
    }

    // Goal allocation endpoint
    if (path === '/goals/allocate' && method === 'POST') {
      const allocationData = allocateToGoalSchema.parse(req.body);
      const user = await ensureDefaultUser();
      const result = await storage.allocateToGoal(user.id, allocationData);
      return res.json(result);
    }

    // Transactions endpoints
    if (path === '/transactions' && method === 'GET') {
      const user = await ensureDefaultUser();
      const transactions = await storage.getTransactions(user.id);
      return res.json(transactions);
    }

    // Transaction undo endpoint
    if (path.match(/^\/transactions\/\d+$/) && method === 'DELETE') {
      const transactionId = parseInt(path.split('/')[2]);
      const user = await ensureDefaultUser();
      await storage.undoTransaction(user.id, transactionId);
      return res.json({ message: "Transaction undone successfully" });
    }

    // Reset endpoint
    if (path === '/reset' && method === 'POST') {
      const user = await ensureDefaultUser();
      await storage.completeReset(user.id);
      return res.json({ message: "Complete reset successful" });
    }

    // If no route matches
    res.status(404).json({ message: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}