'use client';

import { useState, useRef } from 'react';
import { VolumeX, Music } from 'lucide-react'; // Volume2는 미사용이므로 제거했습니다.
import { motion, AnimatePresence } from 'framer-motion';

interface WeddingProps {
  bgm: string | null;
}

const BackgroundMusic = ({ bgm }: WeddingProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 환경변수에서 파일명을 가져오고, 값이 없으면 기본값('bg.mp3')을 사용합니다.
  const bgmFileName = process.env.NEXT_PUBLIC_BGM_FILENAME || 'bg.mp3';
  const audioSrc = `/music/${bgmFileName}`;

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* 환경변수로 동적 할당된 audioSrc 적용 */}
      <audio ref={audioRef} src={audioSrc} loop />

      {/* 우측 상단 고정 버튼 */}
      <motion.button
        onClick={toggleMusic}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className={`fixed top-4 right-4 z-[9999] w-10 h-10 rounded-full flex items-center justify-center border shadow-md transition-all duration-300 
          ${isPlaying
            ? 'bg-stone-800/80 border-stone-700 text-white shadow-lg'
            : 'bg-white/80 border-stone-200 text-stone-400 hover:text-stone-600 backdrop-blur-sm'
          }`}
        aria-label={isPlaying ? "배경음악 끄기" : "배경음악 켜기"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0 }}
              transition={{
                rotate: { repeat: Infinity, duration: 3, ease: "linear" }
              }}
            >
              <Music size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <VolumeX size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default BackgroundMusic;