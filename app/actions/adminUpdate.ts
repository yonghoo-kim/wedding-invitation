// app/actions/adminUpdate.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateInvitation(inviteId: string, formData: any) {
  try {
    await prisma.invitation.update({
      where: { id: inviteId },
      data: {
        theme: formData.theme,
        bgmFilename: formData.bgmFilename,
        mainImage: formData.mainImage,
        closingImage: formData.closingImage,
        
        groomLastName: formData.groomLastName,
        groomFirstName: formData.groomFirstName,
        brideLastName: formData.brideLastName,
        brideFirstName: formData.brideFirstName,
        
        weddingDate: new Date(formData.weddingDate),
        weddingLocation: formData.weddingLocation,
        weddingAddress: formData.weddingAddress,
        // 위도/경도는 값이 있으면 숫자로 변환, 없으면 null
        weddingLat: formData.weddingLat ? parseFloat(formData.weddingLat) : null,
        weddingLng: formData.weddingLng ? parseFloat(formData.weddingLng) : null,
        
        // JSON 데이터 통째로 저장
        groomAccountInfo: formData.groomAccountInfo,
        brideAccountInfo: formData.brideAccountInfo,
      },
    });

    revalidatePath('/admin');
    revalidatePath(`/${inviteId}`);
    
    return { success: true };
  } catch (error) {
    console.error('업데이트 실패:', error);
    return { success: false, error: '업데이트 중 오류가 발생했습니다.' };
  }
}