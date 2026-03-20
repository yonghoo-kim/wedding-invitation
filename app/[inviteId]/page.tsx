// app/[inviteId]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma'; // Prisma 클라이언트 (DB 연결용)

// 컴포넌트들 Import (기존과 동일)
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
import SeasonalEffect from '@/app/components/effect/SeasonalEffect'; // [추가 및 변경]

import { SeasonTheme } from '@/lib/theme';

interface ParentAccount {
  name: string;
  bank: string;
  account: string;
}

interface AccountInfo {
  bank: string;
  account: string;
  father?: ParentAccount; // 부모님 계좌는 없을 수도 있으니 ?(선택) 처리
  mother?: ParentAccount;
}

export async function generateMetadata({ params }: { params: { inviteId: string } }) {
  const { inviteId } = await params;
  const invitation = await prisma.invitation.findUnique({ where: { urlSlug: inviteId } });
  // 정보가 없으면 기본값 반환
  if (!invitation) {
    return { title: '청첩장을 찾을 수 없습니다.' };
  }

  // 데이터 가공
  const groomName = `${invitation.groomLastName}${invitation.groomFirstName}`;
  const brideName = `${invitation.brideLastName}${invitation.brideFirstName}`;
  const year = invitation.weddingDate.getFullYear();
  const month = invitation.weddingDate.getMonth() + 1;
  const day = invitation.weddingDate.getDate();

  const hours24 = invitation.weddingDate.getHours();
  const hour12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? '오후' : '오전';

  const titleText = `${groomName} & ${brideName} 결혼합니다`;
  const descText = `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}시, ${invitation.weddingLocation}`;

  // 썸네일 이미지 (DB에 메인 이미지가 있으면 쓰고, 없으면 기본 갤러리 이미지 사용)
  const ogImage = invitation.mainImage
    ? `/images/wedding/${invitation.mainImage}`
    : '/images/wedding/gallery-20.jpg';

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

  const groomAccount = invitation.groomAccountInfo as unknown as AccountInfo;
  const brideAccount = invitation.brideAccountInfo as unknown as AccountInfo;

  return (
    <main className="snap-container scrollbar-hide relative">
      <IntroOverlay weddingDate={invitation.weddingDate} />
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
        theme={invitation.theme as SeasonTheme} 
      />
      <Section3_Calendar weddingDate={invitation.weddingDate} theme={invitation.theme as SeasonTheme} />
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
        weddingDate={invitation.weddingDate}
      />
    </main>
  );
}