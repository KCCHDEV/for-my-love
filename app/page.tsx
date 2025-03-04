'use client';
import GiftGenerator from '@/components/GiftGenerator';
import Stats from '@/components/Stats';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.classList.add('heart-cursor');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('heart-cursor');
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-pink-50 via-rose-50 to-white dark:from-pink-950 dark:via-rose-950 dark:to-gray-900">
      {/* Heart cursor */}
      <motion.div
        className="heart-cursor-icon"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", damping: 10, stiffness: 150 }}
      >
        💝
      </motion.div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <main className="relative max-w-4xl mx-auto pt-8 px-4 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-rose-600 dark:text-rose-400 mb-4"
        >
          สร้างของขวัญสุดพิเศษ 💝
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-300 mb-8"
        >
          สร้างของขวัญดิจิทัลสุดพิเศษให้คนที่คุณรักในไม่กี่วินาที
        </motion.p>
        
        <GiftGenerator />
        <Stats />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center space-y-4"
        >
          <div className="flex justify-center gap-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://tipme.in.th/kcch-naygolf" 
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
            >
              ☕ สนับสนุนผู้พัฒนา
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://rdtrc.cloud" 
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300"
            >
              ผู้สนับสนุนโครงการ
            </motion.a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
