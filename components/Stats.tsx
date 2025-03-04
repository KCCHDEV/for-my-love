'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type StatsType = {
  totalGenerated: number;
  totalViews: number;
  total_opened: number;
};

export default function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [stats, setStats] = useState<StatsType>({
    totalGenerated: 0,
    totalViews: 0,
    total_opened: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };

    fetchStats();
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6 }}
      className="mt-12 grid grid-cols-3 gap-4 p-4 glass rounded-xl"
    >
      {[
        { value: stats.totalGenerated, label: "Gifts Created" },
        { value: stats.totalViews, label: "Total Views" },
        { value: stats.total_opened, label: "Gifts Opened" }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center group hover:transform hover:scale-105 transition-all duration-300"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-2xl font-bold text-rose-500"
          >
            {stat.value}
          </motion.div>
          <div className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-rose-500 transition-colors duration-300">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
