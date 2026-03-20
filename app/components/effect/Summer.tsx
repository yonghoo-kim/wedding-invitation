'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FireflyEffect {
  id: number;
  size: number;
  mainColor: string;
  left: string;
  duration: number;
  delay: number;
  swayAmount: string;
}

const Summer = () => {
  const [fireflies, setFireflies] = useState<FireflyEffect[]>([]);

  useEffect(() => {
    const fireflyCount = 40; // 반짝임이 예쁘게 보이도록 개수를 늘림
    // 🌟 한여름 밤에 어울리는 따뜻한 반딧불이 빛깔 (연노랑, 연두, 골드)
    const colors = ['#FFF59D', '#FFF176', '#FFEE58', '#E6EE9C', '#FBC02D'];

    const newFireflies: FireflyEffect[] = Array.from({ length: fireflyCount }).map((_, i) => {
      // 반딧불이 크기는 작고 아기자기하게 (2~6px)
      const size = Math.random() * 4 + 2; 
      const mainColor = colors[Math.floor(Math.random() * colors.length)];
      const left = `${Math.random() * 100}vw`;
      
      // 떠오르는 속도는 천천히 여유롭게
      const duration = Math.random() * 15 + 15; 
      const delay = Math.random() * 20; // 딜레이를 길게 주어 자연스럽게 하나씩 나타나게 함
      
      // 좌우로 살랑살랑 흔들리며 날아가는 궤적
      const swayAmount = `${Math.random() * 20 - 10}vw`; 

      return {
        id: i,
        size,
        mainColor,
        left,
        duration,
        delay,
        swayAmount
      };
    });
    setFireflies(newFireflies);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {fireflies.map((firefly) => {
        return (
          <motion.div
            key={firefly.id}
            initial={{
              // 화면 맨 아래(또는 살짝 아래)에서 시작
              y: "110vh",
              x: firefly.left,
              opacity: 0,
            }}
            animate={{
              // 화면 위쪽으로 떠오름
              y: "-10vh",
              x: `calc(${firefly.left} + ${firefly.swayAmount})`,
              // 반딧불이 특유의 깜빡거리는(Twinkling) 효과를 위해 투명도 조절
              opacity: [0, 0.8, 0.2, 1, 0], 
            }}
            transition={{
              duration: firefly.duration,
              repeat: Infinity,
              delay: firefly.delay,
              ease: "easeInOut", // 부드럽게 시작하고 끝나는 타이밍 함수
            }}
            className="absolute top-0 flex items-center justify-center rounded-full"
            style={{
              width: firefly.size,
              height: firefly.size,
              backgroundColor: firefly.mainColor,
              // 반짝이는 빛 번짐(Glow) 효과
              boxShadow: `0 0 ${firefly.size * 2}px ${firefly.size}px ${firefly.mainColor}80`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Summer;