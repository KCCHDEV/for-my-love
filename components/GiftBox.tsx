'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface GiftBoxProps {
  children: React.ReactNode;
}

export default function GiftBox({ children }: GiftBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="relative"
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div
        className={`relative z-10 p-6 rounded-xl shadow-2xl ${
          isOpen ? 'bg-white/80 dark:bg-gray-800/80' : 'bg-rose-500'
        } backdrop-blur-sm cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        variants={{
          open: {
            rotateY: 180,
            transition: { duration: 0.5 }
          },
          closed: {
            rotateY: 0,
            transition: { duration: 0.5 }
          }
        }}
      >
        {!isOpen ? (
          <div className="text-center text-white">
            <span className="text-4xl">🎁</span>
            <p className="mt-2">กดเพื่อเปิด!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ rotateY: 180 }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
      
      {/* Sparkles */}
      {isOpen && (
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{ 
                duration: 1,
                delay: i * 0.1,
                repeat: 2,
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
