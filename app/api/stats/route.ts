import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Get global stats
    const stats = await db.collection('stats').findOne({ id: 'global' }) || {
      id: 'global',
      total_views: 0,
      total_opened: 0,
      total_gifts: 0
    };

    // Get total gifts count
    const totalGifts = await db.collection('gifts').countDocuments();

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        total_gifts: totalGifts
      }
    });

  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
