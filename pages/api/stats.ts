import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const stats = await db.collection('stats').findOne({ id: 'global' });
    
    return NextResponse.json({
      stats: {
        totalGenerated: stats?.totalGenerated || 0,
        total_views: stats?.total_views || 0,
        total_opened: stats?.total_opened || 0
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
