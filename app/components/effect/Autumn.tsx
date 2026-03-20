'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LeafEffect {
  id: number;
  size: number;
  mainColor: string;
  left: string;
  duration: number;
  delay: number;
  rotateDir: number;
  swayAmount: string;
}

const Autumn = () => {
  const [leaves, setLeaves] = useState<LeafEffect[]>([]);

  useEffect(() => {
    const leafCount = 10; // 떨어지는 잎의 개수
    // 알록달록한 가을 웜톤 색상 배열 (레드, 오렌지, 옐로우, 브라운)
    const colors = ['#D32F2F', '#E64A19', '#F57C00', '#FBC02D', '#8D6E63'];

    const newLeaves: LeafEffect[] = Array.from({ length: leafCount }).map((_, i) => {
      // 잎의 크기를 조금 더 넉넉하게 잡음 (25~45px)
      const size = Math.random() * 20 + 25; 
      const mainColor = colors[Math.floor(Math.random() * colors.length)];
      const left = `${Math.random() * 100}vw`;
      const duration = Math.random() * 15 + 12; // 하늘하늘하게 떨어지도록 설정
      const delay = Math.random() * 15;
      const rotateDir = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 1); // 부드러운 회전
      const swayAmount = `${Math.random() * 40 - 20}vw`; // 좌우로 흩날리는 폭 설정

      return {
        id: i,
        size,
        mainColor,
        left,
        duration,
        delay,
        rotateDir,
        swayAmount
      };
    });
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {leaves.map((leaf) => {
        const gradientId = `leaf-gradient-${leaf.id}`;

        return (
          <motion.div
            key={leaf.id}
            initial={{
              y: -50,
              x: leaf.left,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: "105vh",
              x: `calc(${leaf.left} + ${leaf.swayAmount})`,
              opacity: [0, 1, 0.8, 0], // 서서히 나타났다가 바닥에 닿기 전 사라짐
              rotate: [null, 360 * leaf.rotateDir],
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "linear",
            }}
            className="absolute top-0 flex items-center justify-center"
            style={{
              width: leaf.size,
              height: leaf.size,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24" // 정사각형 뷰박스
              width="100%"
              height="100%"
              stroke="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  {/* 노란빛에서 메인 색상으로 물드는 그라데이션 */}
                  <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.8" />
                  <stop offset="60%" stopColor={leaf.mainColor} stopOpacity="1" />
                  <stop offset="100%" stopColor={leaf.mainColor} stopOpacity="0.9" />
                </linearGradient>
              </defs>
              
              {/* [핵심] 둥글고 곡선미가 살아있는 단풍잎 모양 Path */}
              <path
                fill={`url(#${gradientId})`}
                d="M21.8 12c-.1-.3-.4-.6-.7-.7-.3-.1-.7-.1-1.1.1-.4.2-.8.5-1.3.7-.5.2-.9.4-1.5.5a13 13 0 0 1-1.7.2 9.4 9.4 0 0 1-1.9-.2l-.1-.1a6 6 0 0 1-1-1.1c-.2-.4-.5-.8-.7-1.2l-.6-1.1c-.2-.5-.4-.9-.7-1.3l-.9-1.3c-.3-.5-.7-.9-1-1.3a10.2 10.2 0 0 0-1.2-1.2c-.3-.3-.7-.5-1.1-.6-.4-.2-.9-.3-1.3-.3s-.9.1-1.3.2c-.4.2-.8.4-1.1.7-.3.3-.6.7-.8 1-.2.4-.4.8-.4 1.2v.1a12.7 12.7 0 0 0 .3 1.8l.5 1.7.3.7c.1.3.3.5.4.8a6.5 6.5 0 0 1 .5 1.1l.1.2a14.7 14.7 0 0 1-.9.8c-.3.3-.6.5-1 .7a12 12 0 0 1-1.3.6L2.6 13l-.1.1a4.2 4.2 0 0 0-.6.8 3 3 0 0 0-.4 1.2c0 .4.1.9.3 1.3s.5.8 1 1a12.2 12.2 0 0 0 1.9 1 20 20 0 0 0 2.2.6L8.8 19c.4 0 .7.1 1.1.1.4 0 .8-.1 1.2-.2l.1-.1v2.9c0 .4.2.8.5 1s.7.4 1.2.4a1.7 1.7 0 0 0 1.2-.4c.3-.3.5-.7.5-1v-2.9l.1.1c.4.1.8.2 1.2.2h1c.4 0 .8-.1 1.2-.2.4-.1.8-.3 1.2-.5.4-.2.7-.5.9-.9.2-.4.4-.8.4-1.2a13 13 0 0 0-.2-1.9 19.1 19.1 0 0 0-.5-2l-.1-.1c.3-.1.7-.2 1.1-.2.4-.1.8-.2 1.2-.4a9.6 9.6 0 0 0 1.3-.7c.4-.3.7-.7.9-1.1s.3-.9.3-1.4c0-.3-.1-.7-.2-.9z"
              />

              {/* 🌟 만약 은행나무잎 모양을 원하시면 아래 주석을 해제하고 위 <path>를 주석처리 하세요 */}
              {/* <path
                fill={`url(#${gradientId})`}
                d="M20.8 11C19.7 7.7 16.6 5.4 13.1 4.5V2h-2v2.5c-3.5 0.9-6.6 3.2-7.7 6.5C3 12.1 3.2 13.3 3.8 14.3c.4.7 1.1 1.3 1.9 1.6l.3.1h.1a.8.8 0 0 0 .2-.1l.2-.1h.1l.3-.2.2-.1c.1-.1.2-.1.2-.2 0 0 .1-.1.1-.1l.3-.3.2-.1.1-.1 1-.9.7-.6 1.1-.9 1-.7v10h2v-10l1 .7 1.1.9.7.6 1 .9c.1.1.2.2.3.3l.2.1h.1a.8.8 0 0 0 .1.2c0 .1.1.1.2.1l.1.1.3.2h.1l.2.1a.8.8 0 0 0 .2.1h.1l.2.1c.8.3 1.5-.3 1.9-1 .6-.9.8-2 .4-3.3z"
              /> */}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Autumn;