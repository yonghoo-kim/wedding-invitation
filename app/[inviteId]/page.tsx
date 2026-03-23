// app/[inviteId]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma'; // Prisma 클라이언트 (DB 연결용)

// 컴포넌트들 Import
import FixedBackground from '@/app/components/FixedBackground';
import Section1_Main from '@/app/components/Section1_Main';
import Section2_Quote from '@/app/components/Section2_Quote';
import Section3_Calendar from '@/app/components/Section3_Calendar';
import Section_RSVP from '@/app/components/Section_RSVP';
import Section4_Gallery from '@/app/components/Section4_Gallery';
import Section5_Map from '@/app/components/Section5_Map';
import Section6_Gift from '@/app/components/Section6_Gift';
import Section7_Closing from '@/app/components/Section7_Closing';

import IntroOverlay from '@/app/components/IntroOverlay';
import BackgroundMusic from '@/app/components/BackgroundMusic';
import SeasonalEffect from '@/app/components/effect/SeasonalEffect';

import { SeasonTheme } from '@/lib/theme';

interface ParentAccount {
  name: string;
  bank: string;
  account: string;
}

interface AccountInfo {
  bank: string;
  account: string;
  father?: ParentAccount;
  mother?: ParentAccount;
}

// 🌟 [핵심 헬퍼 함수] DB의 UTC 날짜를 클라이언트 환경(타임존)에 구애받지 않는 강제 KST Date 객체로 변환
const getClientSafeKSTDate = (utcDate: Date) => {
  // 1. UTC 시간에 9시간을 더합니다.
  const kstTime = utcDate.getTime() + (9 * 60 * 60 * 1000);
  const kstDate = new Date(kstTime);
  
  // 2. KST 기준의 년, 월, 일, 시, 분을 추출 (getUTC... 메서드 사용)
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kstDate.getUTCDate()).padStart(2, '0');
  const h = String(kstDate.getUTCHours()).padStart(2, '0');
  const min = String(kstDate.getUTCMinutes()).padStart(2, '0');

  // 3. Z(타임존)가 없는 로컬 문자열로 재생성 (클라이언트가 무조건 KST 시각을 로컬 시각으로 인식하게 만듦)
  return new Date(`${y}-${m}-${d}T${h}:${min}:00`);
};

export async function generateMetadata({ params }: { params: { inviteId: string } }) {
  const { inviteId } = await params;
  const invitation = await prisma.invitation.findUnique({ where: { urlSlug: inviteId } });
  
  if (!invitation) {
    return { title: '청첩장을 찾을 수 없습니다.' };
  }

  // 🌟 강제 KST 날짜 객체 생성
  const clientSafeDate = getClientSafeKSTDate(invitation.weddingDate);

  const groomName = `${invitation.groomLastName}${invitation.groomFirstName}`;
  const brideName = `${invitation.brideLastName}${invitation.brideFirstName}`;
  
  const year = clientSafeDate.getFullYear();
  const month = clientSafeDate.getMonth() + 1;
  const day = clientSafeDate.getDate();

  const hours24 = clientSafeDate.getHours();
  const minutes = clientSafeDate.getMinutes(); 
  const hour12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? '오후' : '오전';

  const minuteText = minutes > 0 ? ` ${minutes}분` : '';

  const titleText = `${groomName} & ${brideName} 결혼합니다`;
  const descText = `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}시${minuteText}, ${invitation.weddingLocation}`;

  const ogImage = invitation.mainImage || 'https://내도메인.com/images/default-thumbnail.jpg';

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: "결혼식 초대장 썸네일",
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function InvitationHome({ params }: { params: { inviteId: string } }) {
  const { inviteId } = await params;
  const invitation = await prisma.invitation.findUnique({ where: { urlSlug: inviteId } });

  if (!invitation) {
    notFound();
  }

  // 🌟 컴포넌트에 넘겨줄 날짜도 타임존 우회 처리된 KST 날짜 사용
  const clientSafeDate = getClientSafeKSTDate(invitation.weddingDate);

  const groomAccount = invitation.groomAccountInfo as unknown as AccountInfo;
  const brideAccount = invitation.brideAccountInfo as unknown as AccountInfo;

  return (
    <main className="snap-container scrollbar-hide relative">
      <IntroOverlay weddingDate={clientSafeDate} />
      <SeasonalEffect theme={invitation.theme} />
      <BackgroundMusic bgm={invitation.bgmFilename ?? ''} />
      <FixedBackground theme={invitation.theme} />
      
      <Section1_Main
        groomLastName={invitation.groomLastName}
        groomFirstName={invitation.groomFirstName}
        brideLastName={invitation.brideLastName}
        brideFirstName={invitation.brideFirstName}
        mainImage={invitation.mainImage}
      />
      
      <Section2_Quote
        groomFirstName={invitation.groomFirstName}
        brideFirstName={invitation.brideFirstName}
        groomFatherName={groomAccount?.father?.name}
        groomMotherName={groomAccount?.mother?.name}
        brideFatherName={brideAccount?.father?.name}
        brideMotherName={brideAccount?.mother?.name}
        greetingMessage={invitation.greetingMessage}
        theme={invitation.theme as SeasonTheme} 
      />
      
      <Section3_Calendar weddingDate={clientSafeDate} theme={invitation.theme as SeasonTheme} />
      
      {invitation.useRsvp && (
        <Section_RSVP 
          invitationId={invitation.id} 
          theme={invitation.theme as SeasonTheme} 
        />
      )}
      
      <Section4_Gallery images={invitation.galleryImages} />
      
      <Section5_Map
        locationName={invitation.weddingLocation}
        address={invitation.weddingAddress}
        lat={invitation.weddingLat}
        lng={invitation.weddingLng}
        transitSubway={invitation.transitSubway || undefined}
        transitBus={invitation.transitBus || undefined}
        transitParking={invitation.transitParking || undefined}
        theme={invitation.theme as SeasonTheme}
      />
      
      <Section6_Gift
        invitationId={invitation.id}
        groomLastName={invitation.groomLastName}
        groomFirstName={invitation.groomFirstName}
        brideLastName={invitation.brideLastName}
        brideFirstName={invitation.brideFirstName}
        groomAccount={groomAccount}
        brideAccount={brideAccount}
      />
      
      <Section7_Closing
        closingImage={invitation.closingImage}
        weddingDate={clientSafeDate}
      />
    </main>
  );
}