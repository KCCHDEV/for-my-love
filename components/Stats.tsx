import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type StatsType = {
  totalGenerated: number;
  total_views: number;
  total_opened: number;
};

async function getStats(): Promise<StatsType> {
  const response = await fetch('/api/stats', {
    next: { revalidate: 60 },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    return {
      totalGenerated: 0,
      total_views: 0,
      total_opened: 0
    };
  }
  
  const data = await response.json();
  return data.stats;
}

export default async function Stats() {
  const stats = await getStats();

  return (
    <div className="mt-12 grid grid-cols-3 gap-4 p-4 glass rounded-xl">
      {[
        { value: stats.totalGenerated, label: "Gifts Created" },
        { value: stats.total_views, label: "Total Views" },
        { value: stats.total_opened, label: "Gifts Opened" }
      ].map((stat, index) => (
        <div
          key={index}
          className="text-center group hover:transform hover:scale-105 transition-all duration-300"
        >
          <div className="text-2xl font-bold text-rose-500">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-rose-500 transition-colors duration-300">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
