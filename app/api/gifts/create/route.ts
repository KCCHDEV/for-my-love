import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import type { GiftData } from '@/types/gift';

export async function POST(request: Request) {
  try {
    const data: GiftData = await request.json();
    const giftId = nanoid(10);
    
    const db = await connectToDatabase();
    await db.collection('gifts').insertOne({
      id: giftId,
      ...data,
      created: new Date(),
      views: 0,
      opened: false
    });

    await db.collection('stats').updateOne(
      { id: 'global' },
      { 
        $inc: { 
          totalGenerated: 1,
          [`typeStats.${data.type}`]: 1 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      giftId,
      shareUrl: `/gift/${giftId}` 
    });
  } catch (error) {
    console.error('Gift creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create gift' }, 
      { status: 500 }
    );
  }
}
