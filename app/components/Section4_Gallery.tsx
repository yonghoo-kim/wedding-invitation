// app/components/Section4_Gallery.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo, Variants } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Gowun_Batang, Playfair_Display } from 'next/font/google';

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const englishFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' });

// 🌟 1. 부모로부터 사진 배열을 받기 위한 Props 정의
interface Section4Props {
  images: string[];
}

const Section4_Gallery = ({ images }: Section4Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  // 🌟 2. 사진이 아예 없을 경우 컴포넌트를 숨김 처리
  if (!images || images.length === 0) return null;

  const navigate = (newDirection: number) => {
    if (selectedIndex === null) return;
    setDirection(newDirection);
    const newIndex = (selectedIndex + newDirection + images.length) % images.length;
    setSelectedIndex(newIndex);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const { offset, velocity } = info;
    if (offset.x > swipeThreshold || velocity.x > 500) {
      navigate(-1);
    } else if (offset.x < -swipeThreshold || velocity.x < -500) {
      navigate(1);
    }
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1, transition: { x: { type: "tween", ease: "linear", duration: 0.3 }, opacity: { duration: 0.2 } } },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? '100%' : '-100%', opacity: 0, transition: { x: { type: "tween", ease: "linear", duration: 0.3 }, opacity: { duration: 0.2 } } })
  };

  return (
    <section className={`snap-section relative w-full flex flex-col items-center justify-center py-20 px-4 overflow-hidden ${koreanFont.className}`}>
      
      <motion.div
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px" }}
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="relative z-10 w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/50 rounded-sm p-6 md:p-8"
      >
        <div className="mb-6 text-center">
          <p className={`${englishFont.className} text-amber-700/80 text-[10px] font-bold tracking-[0.3em] mb-2 uppercase`}>Gallery</p>
          <h2 className="text-xl font-bold text-stone-800 tracking-wide">우리의 아름다운 순간</h2>
        </div>

        <div className="overflow-x-auto pb-4 -mx-6 px-6 md:-mx-8 md:px-8 snap-x touch-auto scrollbar-hide">
          {/* 🌟 3. grid-rows-3 grid-flow-col 덕분에 위->아래 방향으로 먼저 채워집니다 (1, 2, 3 / 4, 5, 6) */}
          <div className="grid grid-rows-3 grid-flow-col gap-1 w-max">
            {images.map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setDirection(0); setSelectedIndex(i); }}
                className="relative aspect-square h-24 md:h-32 cursor-pointer rounded-sm overflow-hidden bg-stone-100 shadow-sm hover:shadow-md transition-all group border border-white/50 snap-start touch-auto"
              >
                {/* 🌟 4. unoptimized 추가 */}
                <Image src={src} alt={`gallery-${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 150px, 200px" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="text-white drop-shadow-md w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-[11px] text-stone-500 mt-4 tracking-wide opacity-80 flex items-center justify-center gap-1">
            <ChevronRight size={14} className="animate-pulse text-stone-400" /> 옆으로 넘겨 사진을 확인해보세요.
        </p>
      </motion.div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/95 backdrop-blur-xl px-4"
          >
            <button className="absolute top-6 right-6 text-stone-600 hover:text-stone-900 transition-colors p-2 z-[70]">
                <X size={32} strokeWidth={1.5} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="absolute left-2 text-stone-400 hover:text-stone-800 transition-colors p-4 z-[70] hidden md:block"><ChevronLeft size={48} strokeWidth={1} /></button>
            <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="absolute right-2 text-stone-400 hover:text-stone-800 transition-colors p-4 z-[70] hidden md:block"><ChevronRight size={48} strokeWidth={1} /></button>

            <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={selectedIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                    drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={handleDragEnd}
                    className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    <div className="relative w-full h-full shadow-2xl rounded-sm overflow-hidden bg-stone-50">
                        {/* 🌟 5. 라이트박스에도 unoptimized 추가 */}
                        <Image src={images[selectedIndex]} alt="Full Screen Image" fill className="object-contain" priority unoptimized />
                    </div>
                  </motion.div>
                </AnimatePresence>
            </div>
            
            <div className="absolute bottom-10 z-[70] flex flex-col items-center gap-2">
                <span className={`${englishFont.className} text-stone-600 text-sm tracking-widest bg-stone-200/50 px-4 py-1 rounded-full backdrop-blur-sm border border-stone-300/30`}>
                    {selectedIndex + 1} <span className="text-stone-400 mx-1">/</span> {images.length}
                </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Section4_Gallery;