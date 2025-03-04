import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { giftId } = await request.json();

    if (!giftId) {
      return NextResponse.json({ error: 'Gift ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();

    // Update gift view count
    await db.collection('gifts').updateOne(
      { id: giftId },
      { $inc: { view_count: 1 } }
    );

    // Update global stats
    await db.collection('stats').updateOne(
      { id: 'global' },
      { $inc: { total_views: 1 } },
      { upsert: true }
    );

    // Fetch the updated gift data
    const gift = await db.collection('gifts').findOne(
      { id: giftId }
    );

    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      gift: {
        ...gift,
        id: gift.id.toString()
      }
    });

  } catch (error) {
    console.error('Failed to update gift view count:', error);
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 });
  }
}
