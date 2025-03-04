import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('valentine-gifts');
}

export async function incrementStat(field: 'totalGenerated' | 'total_views' | 'total_opened') {
  const db = await connectToDatabase();
  await db.collection('stats').updateOne(
    { id: 'global' },
    { 
      $inc: { [field]: 1 },
      $setOnInsert: {
        totalGenerated: 0,
        total_views: 0,
        total_opened: 0
      }
    },
    { upsert: true }
  );
}