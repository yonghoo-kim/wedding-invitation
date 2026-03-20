'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// 타입 정의
interface SpringEffect {
  id: number;
  width: number;
  height: number;
  mainColor: string;
  left: string;
  duration: number;
  delay: number;
  rotateDir: number;
  swayAmount: string;
}

const Spring = () => {
  const [petals, setPetals] = useState<SpringEffect[]>([]);

  useEffect(() => {
    const petalCount = 15;
    const colors = ['#FFB7B2', '#FFC8C4', '#FCA5A5'];

    const newPetals: SpringEffect[] = Array.from({ length: petalCount }).map((_, i) => {
      const size = Math.random() * 10 + 15; // 15~25px
      const mainColor = colors[Math.floor(Math.random() * colors.length)];
      const left = `${Math.random() * 100}vw`;
      const duration = Math.random() * 20 + 15; // 15~35초
      const delay = Math.random() * 20;
      const rotateDir = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 0.5);
      const swayAmount = `${Math.random() * 60 - 30}vw`;

      return {
        id: i,
        // [수정] 둥근 모양이므로 너비와 높이 비율을 비슷하게 조정 (약간만 좁게)
        width: size * 0.9, 
        height: size,
        mainColor,
        left,
        duration,
        delay,
        rotateDir,
        swayAmount
      };
    });
    setPetals(newPetals);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {petals.map((petal) => {
        const gradientId = `petal-gradient-${petal.id}`;

        return (
          <motion.div
            key={petal.id}
            initial={{
              y: -50,
              x: petal.left,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: "105vh",
              x: `calc(${petal.left} + ${petal.swayAmount})`,
              opacity: [0, 0.9, 0.7, 0],
              rotate: [null, 360 * petal.rotateDir],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: "linear",
            }}
            className="absolute top-0 flex items-center justify-center"
            style={{
              width: petal.width,
              height: petal.height,
              filter: 'blur(0.2px)', 
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              stroke="none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="10%" stopColor="#FFF0F5" stopOpacity="0.9" />
                  <stop offset="60%" stopColor={petal.mainColor} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={petal.mainColor} />
                </linearGradient>
              </defs>
              
              {/* [수정 핵심] 하트 모양의 움푹 파인 부분을 없앤 둥근 꽃잎 Path */}
              <path
                fill={`url(#${gradientId})`}
                d="M50 95 C 20 80 5 50 5 30 C 5 10 25 0 50 0 C 75 0 95 10 95 30 C 95 50 80 80 50 95 Z"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Spring;