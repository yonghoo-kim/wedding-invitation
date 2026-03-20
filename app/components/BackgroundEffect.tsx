'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; 

const BackgroundEffect = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    // [수정 포인트]
    // z-[9999]: 모든 섹션보다 무조건 위에 뜨게 함 (오버레이 효과)
    // pointer-events-none: 마우스 클릭은 통과시킴 (필수)
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <Particles
        id="tsparticles"
        className="w-full h-full"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 120,
          particles: {
            // [색상] 잘 보이도록 진한 앰버(Gold)와 화이트 섞음
            color: {
              value: ["#ffffff", "#d97706", "#fbbf24"], 
            },
            // [개수] 너무 많으면 지저분하므로 적당히
            number: {
              density: {
                enable: true,
                // area 속성 없이 자동 계산됨
              },
              value: 100, 
            },
            // [투명도] 은은하게 반짝임
            opacity: {
              value: { min: 0.3, max: 0.8 }, // 최소 투명도를 높여서 더 잘 보이게 함
              animation: {
                enable: true,
                speed: 0.5,
                sync: false
              }
            },
            // [모양] 원형
            shape: {
              type: "circle",
            },
            // [크기] 약간 키워서 눈에 띄게 함 (2~4px)
            size: {
              value: { min: 2, max: 4 },
            },
            // [움직임] 아래에서 위로 천천히 떠오르는 먼지 효과
            move: {
              enable: true,
              direction: "top", // 위로 이동
              random: true,     // 불규칙하게 흔들림
              speed: { min: 0.5, max: 1.5 }, // 속도 살짝 올림
              straight: false,
              outModes: {
                default: "out", // 화면 밖으로 나가면 재생성
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default BackgroundEffect;