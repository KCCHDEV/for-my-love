'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface MusicEmbedProps {
  url: string;
}

export default function MusicEmbed({ url }: MusicEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('spotify.com')) {
      return url.replace('/track/', '/embed/track/');
    }
    return url;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/5"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-rose-50 dark:bg-rose-950">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            🎵
          </motion.div>
        </div>
      )}
      <iframe
        src={getEmbedUrl(url)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </motion.div>
  );
}
