'use client';

import Image from 'next/image';

interface WeddingProps {
  theme: string;
}

const FixedBackground = ({ theme }: WeddingProps) => {
  const season = theme || 'spring';
  const imagePath = `/images/bg/${season.toLowerCase()}.png`;

  return (
    <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden bg-stone-50">
      {/* 배경 이미지 */}
      <Image
        src={imagePath} // 3. 동적으로 생성된 경로 적용
        alt={`${season} background`} // alt 속성도 동적으로 변경
        fill
        priority
        className="object-cover opacity-60 transition-opacity duration-500" // 투명도 조절 및 부드러운 전환을 위한 transition 추가
        style={{ objectPosition: 'center' }}
      />
      
      {/* (선택사항) 그레인(노이즈) 효과 추가 - 더 종이 질감 같음 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
    </div>
  );
};

export default FixedBackground;