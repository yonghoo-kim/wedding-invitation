// app/components/Section1_Main.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Gowun_Batang, Playfair_Display } from 'next/font/google';

interface Section1Props {
  groomLastName: string;
  groomFirstName: string;
  brideLastName: string;
  brideFirstName: string;
  mainImage: string | null;
}

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const englishFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], display: 'swap' });

const Section1_Main = ({ groomLastName, groomFirstName, brideLastName, brideFirstName, mainImage }: Section1Props) => {

  // 🌟 수정: mainImage가 있으면 그대로(URL) 쓰고, 없으면 기본 샘플 이미지 경로를 씁니다.
  const imageUrl = mainImage || '/images/wedding/section1.png';

  return (
    <section className={`snap-section relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden`}>
      
      {/* --- 상단 텍스트 생략 (기존 코드와 동일) --- */}
      <div className="absolute top-[10vh] w-full z-20 flex flex-col items-center text-center px-4">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 3.2 }} className={`${koreanFont.className} text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 font-medium text-stone-500`}>
          We Are Getting Married
        </motion.p>
        <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 3.5, ease: "easeOut" }} className="flex flex-row items-center justify-center gap-3 md:gap-4 mb-3 whitespace-nowrap">
          <span className={`${koreanFont.className} text-xl md:text-3xl font-bold text-stone-900 tracking-[0.2em] drop-shadow-sm`}>
            {groomLastName}{groomFirstName}
          </span>
          <span className={`${englishFont.className} text-sm md:text-xl text-amber-800/60 italic font-normal mt-1`}>&</span>
          <span className={`${koreanFont.className} text-xl md:text-3xl font-bold text-stone-900 tracking-[0.2em] drop-shadow-sm`}>
            {brideLastName}{brideFirstName}
          </span>
        </motion.h1>
        <motion.div initial={{ width: 0 }} animate={{ width: "30px" }} transition={{ duration: 1, delay: 4.0 }} className="h-[1px] bg-stone-400/60 mb-3" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 4.2 }} className={`${koreanFont.className} text-xs md:text-sm font-medium text-stone-600 tracking-widest leading-relaxed`}>
          저희 두 사람, 결혼합니다.
        </motion.p>
      </div>

      {/* --- 액자 + 와이어 --- */}
      <motion.div className="absolute top-0 w-full h-full flex flex-col items-center pointer-events-none z-10" style={{ transformOrigin: 'top center' }} animate={{ rotate: [3.0, -3.0] }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: "easeInOut" }}>
        
        {/* 와이어 생략 */}
        <div className="absolute top-0 flex flex-col items-center w-full">
            <div className="relative z-20"><div className="w-6 h-6 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center mt-[-12px]"><div className="w-1 h-1 rounded-full bg-stone-300"></div></div></div>
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: '30vh', opacity: 1 }} transition={{ duration: 3, ease: "easeInOut", delay: 2.2 }} className="w-[1px] bg-stone-100 origin-top shadow-[1px_0_2px_rgba(0,0,0,0.1)]" />
        </div>

        <motion.div initial={{ y: -600, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 20, damping: 15, mass: 2, delay: 2.5 }} className="relative pt-[30vh]">
            <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
               <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[10px] border-b-white drop-shadow-sm"></div>
            </div>

            {/* 액자 크기 */}
            <div className="relative z-10 p-3 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-[75vw] max-w-[380px] aspect-[3/4]">
                <div className="relative w-full h-full bg-stone-50 overflow-hidden border border-stone-100">
                    {/* 🌟 수정: DB에서 넘어온 URL을 바로 꽂고, unoptimized를 켜줍니다. */}
                    <Image 
                        src={imageUrl}
                        alt="Wedding Couple Main Image"
                        fill
                        className="object-cover"
                        priority
                        unoptimized // 💡 핵심: 이 속성이 있어야 외부(Supabase) URL을 에러 없이 즉시 렌더링합니다!
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                </div>
            </div>
        </motion.div>
      </motion.div>

      {/* --- 스크롤 안내 생략 --- */}
      <motion.div initial={{ opacity: 0 }} animate={{ y: [0, 8, 0], opacity: [0, 0.8, 0] }} transition={{ y: { repeat: Infinity, duration: 2, ease: "easeInOut" }, opacity: { repeat: Infinity, duration: 2, ease: "easeInOut", delay: 4.5 } }} className="absolute bottom-8 z-30 text-stone-500 flex flex-col items-center gap-2">
        <span className={`${englishFont.className} text-[10px] tracking-[0.2em] font-medium opacity-70`}>SCROLL</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-stone-400 to-transparent"></div>
      </motion.div>

    </section>
  );
};

export default Section1_Main;