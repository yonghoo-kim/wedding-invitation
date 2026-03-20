'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SnowEffect {
  id: number;
  size: number;
  opacity: number;
  left: string;
  duration: number;
  delay: number;
  swayAmount: string;
  blur: number;
}

const Winter = () => {
  const [snowflakes, setSnowflakes] = useState<SnowEffect[]>([]);

  useEffect(() => {
    const snowCount = 200; // 눈송이는 풍성하게 떨어지도록 개수를 늘림

    const newSnowflakes: SnowEffect[] = Array.from({ length: snowCount }).map((_, i) => {
      // 크기에 따라 원근감을 주기 위한 설정
      const isForeground = Math.random() > 0.5;
      const size = isForeground ? Math.random() * 6 + 4 : Math.random() * 3 + 2; // 4~10px (가까운 눈), 2~5px (먼 눈)
      const opacity = isForeground ? Math.random() * 0.4 + 0.6 : Math.random() * 0.3 + 0.2; // 먼 눈은 더 투명하게
      const blur = isForeground ? 0 : Math.random() * 2 + 1; // 먼 눈은 약간 흐릿하게 (원근감)

      const left = `${Math.random() * 100}vw`;
      // 떨어지는 속도: 무거운 눈(큰 눈)은 빨리, 가벼운 눈(작은 눈)은 천천히
      const duration = isForeground ? Math.random() * 10 + 10 : Math.random() * 15 + 15; 
      const delay = Math.random() * 15;
      
      // 좌우 흔들림: 눈보라처럼 이리저리 흩날리도록 설정
      const swayAmount = `${Math.random() * 20 - 10}vw`; 

      return {
        id: i,
        size,
        opacity,
        left,
        duration,
        delay,
        swayAmount,
        blur
      };
    });
    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {snowflakes.map((snow) => {
        return (
          <motion.div
            key={snow.id}
            initial={{
              y: -50,
              x: snow.left,
              opacity: 0,
            }}
            animate={{
              y: "105vh",
              x: `calc(${snow.left} + ${snow.swayAmount})`,
              opacity: [0, snow.opacity, snow.opacity * 0.8, 0], // 부드럽게 나타나고 사라짐
            }}
            transition={{
              duration: snow.duration,
              repeat: Infinity,
              delay: snow.delay,
              ease: "linear",
            }}
            className="absolute top-0 flex items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{
              width: snow.size,
              height: snow.size,
              filter: `blur(${snow.blur}px)`, // 원근감 부여
            }}
          />
        );
      })}
    </div>
  );
};

export default Winter;