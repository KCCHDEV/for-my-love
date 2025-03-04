import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { giftId } = await request.json();
    
    if (!giftId) {
      return NextResponse.json({ error: 'Gift ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    
    // Update gift opened status
    await db.collection('gifts').updateOne(
      { _id: giftId, opened: false },
      { 
        $set: { opened: true },
        $inc: { opened_count: 1 }
      }
    );

    // Update global stats
    await db.collection('stats').updateOne(
      { id: 'global' },
      { $inc: { total_opened: 1 } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update gift opened status:', error);
    return NextResponse.json({ error: 'Failed to update gift' }, { status: 500 });
  }
}
