// app/components/Section2_Quote.tsx
'use client';

import { motion } from 'framer-motion';
import { Gowun_Batang, Playfair_Display } from 'next/font/google';

// 🌟 1. 공통 테마 파일에서 색상과 타입 불러오기
import { themeColors, SeasonTheme } from '@/lib/theme';

// 🌟 2. Props에 theme 추가
interface Section2Props {
  groomFirstName: string;
  brideFirstName: string;
  groomFatherName?: string;
  groomMotherName?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  greetingMessage?: string; 
  theme?: SeasonTheme; // 테마 prop 추가
}

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const englishFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], display: 'swap' });

// 🌟 3. Props 가져오기 (기본값 설정)
const Section2_Quote = ({
  groomFirstName,
  brideFirstName,
  groomFatherName,
  groomMotherName,
  brideFatherName,
  brideMotherName,
  greetingMessage,
  theme = 'autumn' // 기본 테마
}: Section2Props) => {

  // 현재 테마 색상 가져오기
  const currentTheme = themeColors[theme];

  // 부모님 이름 조합 (값이 있는 것만 ' · ' 으로 연결)
  const groomParents = [groomFatherName, groomMotherName].filter(Boolean).join(' · ');
  const brideParents = [brideFatherName, brideMotherName].filter(Boolean).join(' · ');

  // 🌟 4. 값이 없을 때 보여줄 기본 더미 텍스트 세팅
  const defaultMessage = "꽃향기와 함께 찾아온 당신과\n사랑의 언약을 맺습니다.\n\n저희 두 사람이 삶의 동반자로서 맞이하는\n첫 번째 봄에 함께 하시어 축복해 주시면\n큰 기쁨으로 영원히 간직하겠습니다.";
  const displayMessage = greetingMessage || defaultMessage;

  return (
    <section className={`snap-section relative w-full min-h-[100dvh] flex items-center justify-center p-6 overflow-hidden ${koreanFont.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm px-4 py-12 text-center"
      >
        <div className="w-[1px] h-6 bg-stone-500 mx-auto mb-6 opacity-50"></div>
        
        {/* 🎨 기존 text-amber-800 대신 테마 색상(currentTheme.text) 적용! */}
        <p className={`${englishFont.className} ${currentTheme.text} text-[11px] tracking-[0.3em] uppercase mb-4 font-medium drop-shadow-sm`}>
          Invitation
        </p>
        
        <h2 className="text-stone-900 text-2xl font-bold mb-10 tracking-[0.2em] drop-shadow-sm">초대의 글</h2>

        {/* 🌟 5. 엔터(\n)를 감지하여 문단과 줄바꿈을 동적으로 렌더링하는 마법! */}
        <div className="space-y-7 text-stone-800 text-[15px] leading-8 font-medium tracking-wide drop-shadow-sm">
          {displayMessage.split('\n\n').map((paragraph, i) => (
            <p key={i}>
              {paragraph.split('\n').map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j !== arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>
        
        <div className="w-[40px] h-[1px] bg-stone-400 mx-auto my-12 opacity-60" />

        <div className="grid grid-cols-[auto_auto_auto] gap-x-3 gap-y-3 justify-center items-center drop-shadow-sm mx-auto max-w-[300px]">
            {/* --- 1열: 신랑 측 --- */}
            <div className="text-right text-stone-700 text-[15px] tracking-tight whitespace-nowrap">
                {groomParents}
            </div>
            <div className="text-center text-stone-400 text-[11px] whitespace-nowrap pt-[2px]">의 아들</div>
            <div className="text-left text-xl font-bold text-stone-900 whitespace-nowrap">
                {groomFirstName}
            </div>

            {/* --- 2열: 신부 측 --- */}
            <div className="text-right text-stone-700 text-[15px] tracking-tight whitespace-nowrap">
                {brideParents}
            </div>
            <div className="text-center text-stone-400 text-[11px] whitespace-nowrap pt-[2px]">의 딸</div>
            <div className="text-left text-xl font-bold text-stone-900 whitespace-nowrap">
                {brideFirstName}
            </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Section2_Quote;