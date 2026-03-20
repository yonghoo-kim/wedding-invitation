"use client"; // [추가] 클라이언트 컴포넌트로 선언

import dynamic from 'next/dynamic';

interface WeddingProps {
  theme: string;
}

const EffectComponents: Record<string, React.ComponentType> = {
  spring: dynamic(() => import('./Spring'), { ssr: false }),
  summer: dynamic(() => import('./Summer'), { ssr: false }),
  autumn: dynamic(() => import('./Autumn'), { ssr: false }),
  winter: dynamic(() => import('./Winter'), { ssr: false }),
};

export default function SeasonalEffect({ theme }: WeddingProps) {
  const currentSeason = (theme || 'spring').toLowerCase();
  const ActiveEffect = EffectComponents[currentSeason] || EffectComponents['spring'];
  return <ActiveEffect />;
}