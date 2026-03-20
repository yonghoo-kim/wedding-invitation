// app/components/Section3_Calendar.tsx
'use client';

import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { useEffect, useState } from 'react';
import { Gowun_Batang } from 'next/font/google';
import CalendarWidget from '@/app/components/CalendarWidget';
import { themeColors, SeasonTheme } from '@/lib/theme';

// 🌟 1. Props 타입 정의 (테마 추가)
interface Section3Props {
  weddingDate: Date;
  theme?: SeasonTheme;
}

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

// 🌟 2. Props 적용
const Section3_Calendar = ({ weddingDate, theme = 'autumn' }: Section3Props) => {
  const [isMounted, setIsMounted] = useState(false);

  // 현재 테마 색상 가져오기
  const currentTheme = themeColors[theme];

  // 🌟 3. Date 객체에서 필요한 정보 추출
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth() + 1;
  const day = weddingDate.getDate();

  // 요일 구하기 (영문)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayOfWeekEn = daysOfWeek[weddingDate.getDay()];

  // 시간 12시간제로 변환 및 AM/PM 구하기
  const hours24 = weddingDate.getHours();
  const minute = String(weddingDate.getMinutes()).padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hour12 = hours24 % 12 || 12; // 0시는 12시로 표기

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) return <span className={`${koreanFont.className} ${currentTheme.text} text-sm font-bold`}>결혼식을 축하합니다!</span>;

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center mx-1">
        <div className="bg-white w-10 h-10 rounded-md flex items-center justify-center shadow-sm border border-stone-200">
          <span className={`${koreanFont.className} text-lg font-semibold text-stone-800 tabular-nums pt-1`}>
            {value < 10 ? `0${value}` : value}
          </span>
        </div>
        <span className={`${koreanFont.className} text-[8px] text-stone-500 mt-1 uppercase tracking-wider`}>{label}</span>
      </div>
    );

    return (
      <div className="flex flex-col items-center w-full">
        <div className={`${koreanFont.className} text-stone-500 font-medium text-sm mb-4 tracking-widest`}>
          {/* 🎨 D-Day 숫자에 테마 색상 적용 */}
          D <span className="mx-1">-</span> <span className={`text-xl font-bold ${currentTheme.text}`}>{days}</span>
        </div>
        <div className="flex justify-center items-start gap-1">
          <TimeUnit value={hours} label="Hours" />
          <span className={`${koreanFont.className} text-stone-400 text-lg mt-1 font-light mx-0.5`}>:</span>
          <TimeUnit value={minutes} label="Mins" />
          <span className={`${koreanFont.className} text-stone-400 text-lg mt-1 font-light mx-0.5`}>:</span>
          <TimeUnit value={seconds} label="Secs" />
        </div>
      </div>
    );
  };

  return (
    <section className={`snap-section relative w-full min-h-[100dvh] flex items-center justify-center p-6 overflow-hidden`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/50 rounded-sm p-8 flex flex-col items-center"
      >
        <h2 className={`${koreanFont.className} text-xl font-bold mb-3 text-stone-800 text-center tracking-wide`}>
          {month}월의 어느 멋진 날
        </h2>
        <p className={`${koreanFont.className} mb-8 text-center text-stone-600 text-xs font-medium tracking-[0.1em]`}>
          {year}. {month}. {day}. {dayOfWeekEn} {hour12}:{minute} {ampm}
        </p>

        {/* 🌟 캘린더 위젯에도 테마를 넘겨줄 수 있도록 추가했습니다 (위젯 내부 수정 필요) */}
        <CalendarWidget weddingDate={weddingDate} theme={theme} />

        {/* 카운트다운 박스 */}
        <div className="w-full py-6 px-4 rounded-lg border border-stone-300/50 flex justify-center min-h-[110px] bg-white/40 shadow-inner">
          {isMounted ? (
            <Countdown date={weddingDate} renderer={renderer} />
          ) : (
            <div className={`${koreanFont.className} flex items-center justify-center text-stone-400 text-xs h-full w-full`}>
              <span className="animate-pulse">남은 시간을 불러오는 중...</span>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Section3_Calendar;