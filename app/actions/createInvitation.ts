// app/actions/createInvitation.ts
'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma'; // 🌟 본인의 prisma 경로에 맞게 수정하세요 (예: '@/lib/prisma')

export async function createNewInvitation(data: any) {
  try {
    // 🌟 1. 로그인한 유저 확인 (쿠키에서 진짜 유저 ID 가져오기)
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_token')?.value;

    if (!userId) {
      return { success: false, error: '로그인이 필요한 서비스입니다.' };
    }

    // 2. 주소(Slug) 중복 검사
    const existing = await prisma.invitation.findUnique({
      where: { urlSlug: data.urlSlug },
    });

    if (existing) {
      return { success: false, error: '이미 사용 중인 주소입니다. 다른 주소를 입력해주세요.' };
    }

    // 🌟 3. 임시 유저 생성 로직을 삭제하고, 로그인한 'userId'를 그대로 사용!
    const newInvitation = await prisma.invitation.create({
      data: {
        urlSlug: data.urlSlug,
        userId: userId, // <--- 핵심! 가입한 유저의 ID와 연결됩니다.
        theme: data.theme || 'spring',
        bgmFilename: data.bgmFilename || '',
        mainImage: data.mainImage || '',
        closingImage: data.closingImage || '',
        greetingMessage: data.greetingMessage || '',
        galleryImages: data.galleryImages || [],
        
        groomLastName: data.groomLastName,
        groomFirstName: data.groomFirstName,
        brideLastName: data.brideLastName,
        brideFirstName: data.brideFirstName,
        
        weddingDate: data.weddingDate,
        weddingLocation: data.weddingLocation,
        weddingAddress: data.weddingAddress || '',
        weddingLat: data.weddingLat ? parseFloat(data.weddingLat) : null,
        weddingLng: data.weddingLng ? parseFloat(data.weddingLng) : null,
        
        groomAccountInfo: data.groomAccountInfo || {},
        brideAccountInfo: data.brideAccountInfo || {},
      },
    });

    return { success: true, slug: newInvitation.urlSlug };
  } catch (error) {
    console.error('청첩장 생성 에러:', error);
    return { success: false, error: '생성 중 오류가 발생했습니다.' };
  }
}