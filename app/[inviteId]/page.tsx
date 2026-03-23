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

export async function generateMetadata({ params }: { params: { inviteId: string } }) {
  const { inviteId } = await params;
  const invitation = await prisma.invitation.findUnique({ where: { urlSlug: inviteId } });
  
  if (!invitation) {
    return { title: '청첩장을 찾을 수 없습니다.' };
  }

  // 🌟 DB의 UTC 시간을 한국 시간(KST)으로 변환
  const kstString = invitation.weddingDate.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const kstDate = new Date(kstString);

  // 데이터 가공
  const groomName = `${invitation.groomLastName}${invitation.groomFirstName}`;
  const brideName = `${invitation.brideLastName}${invitation.brideFirstName}`;
  const year = kstDate.getFullYear();
  const month = kstDate.getMonth() + 1;
  const day = kstDate.getDate();

  const hours24 = kstDate.getHours();
  const minutes = kstDate.getMinutes(); // 🌟 분(Minutes) 가져오기
  const hour12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? '오후' : '오전';

  // 🌟 분이 0이면 안 보여주고, 숫자가 있으면 ' 30분' 형식으로 추가
  const minuteText = minutes > 0 ? ` ${minutes}분` : '';

  const titleText = `${groomName} & ${brideName} 결혼합니다`;
  const descText = `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}시${minuteText}, ${invitation.weddingLocation}`;

  // 썸네일 이미지 처리 (null 방지)
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

  // 🌟 컴포넌트에 넘겨줄 시간도 한국 시간(KST)으로 변환
  const kstString = invitation.weddingDate.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const kstDate = new Date(kstString);

  const groomAccount = invitation.groomAccountInfo as unknown as AccountInfo;
  const brideAccount = invitation.brideAccountInfo as unknown as AccountInfo;

  return (
    <main className="snap-container scrollbar-hide relative">
      {/* 🌟 기존 invitation.weddingDate 대신 변환된 kstDate를 사용합니다. */}
      <IntroOverlay weddingDate={kstDate} />
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
      
      {/* 🌟 달력에도 kstDate 전달 */}
      <Section3_Calendar weddingDate={kstDate} theme={invitation.theme as SeasonTheme} />
      
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
      
      {/* 🌟 클로징 컴포넌트에도 kstDate 전달 */}
      <Section7_Closing
        closingImage={invitation.closingImage}
        weddingDate={kstDate}
      />
    </main>
  );
}