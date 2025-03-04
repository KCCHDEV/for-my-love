import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Gift from '@/models/Gift';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      
      const { type, message, uniqueCode } = req.body;
      
      const newGift = new Gift({
        type,
        message,
        uniqueCode
      });

      await newGift.save();

      res.status(201).json({ 
        message: 'Gift generated successfully', 
        uniqueCode: newGift.uniqueCode 
      });
    } catch (error) {
      res.status(500).json({ error: 'Gift generation failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}