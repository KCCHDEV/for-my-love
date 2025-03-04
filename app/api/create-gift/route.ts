import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    const giftId = crypto.randomBytes(8).toString('hex');
    
    const db = await connectToDatabase();
    await db.collection('gifts').insertOne({
      giftId,
      type,
      created: new Date(),
      views: 0,
      opened: false
    });

    await db.collection('stats').updateOne(
      { id: 'global' },
      { $inc: { totalGenerated: 1 } },
      { upsert: true }
    );

    return NextResponse.json({ giftUrl: giftId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 });
  }
}
