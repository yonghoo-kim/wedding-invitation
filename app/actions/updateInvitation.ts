// app/actions/updateInvitation.ts
'use server';

import prisma from '@/lib/prisma'; // 🌟 본인 경로에 맞게 수정

export async function updateInvitationData(id: string, data: any) {
  try {
    // 1. 주소(Slug) 중복 검사 (내 청첩장 제외)
    const existing = await prisma.invitation.findFirst({
      where: {
        urlSlug: data.urlSlug,
        NOT: { id: id } // 나는 제외하고 중복 검사
      },
    });

    if (existing) {
      return { success: false, error: '이미 다른 사람이 사용 중인 주소입니다.' };
    }

    // 2. 데이터 덮어쓰기 (Update)
    await prisma.invitation.update({
      where: { id: id },
      data: {
        urlSlug: data.urlSlug,
        theme: data.theme,
        bgmFilename: data.bgmFilename,
        mainImage: data.mainImage,
        closingImage: data.closingImage,
        galleryImages: data.galleryImages,
        greetingMessage: data.greetingMessage,
        
        groomLastName: data.groomLastName,
        groomFirstName: data.groomFirstName,
        brideLastName: data.brideLastName,
        brideFirstName: data.brideFirstName,

        weddingDate: data.weddingDate,
        weddingLocation: data.weddingLocation,
        weddingAddress: data.weddingAddress,
        weddingLat: data.weddingLat ? parseFloat(data.weddingLat) : null,
        weddingLng: data.weddingLng ? parseFloat(data.weddingLng) : null,

        groomAccountInfo: data.groomAccountInfo,
        brideAccountInfo: data.brideAccountInfo,

        transitSubway: data.transitSubway,
        transitBus: data.transitBus,
        transitParking: data.transitParking,
        
        useRsvp: data.useRsvp,
      },
    });

    return { success: true, slug: data.urlSlug };
  } catch (error) {
    console.error('청첩장 수정 에러:', error);
    return { success: false, error: '수정 중 오류가 발생했습니다.' };
  }
}