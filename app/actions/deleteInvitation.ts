// app/actions/deleteInvitation.ts
'use server';

import prisma from '@/lib/prisma'; // 본인 경로에 맞게 확인
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function deleteInvitationData(inviteId: string) {
  try {
    // 1. 삭제할 청첩장 데이터 먼저 찾기 (사진 주소를 알아내기 위함)
    const invitation = await prisma.invitation.findUnique({
      where: { id: inviteId },
    });

    if (!invitation) return { success: false, error: '데이터를 찾을 수 없습니다.' };

    // 2. 삭제할 모든 클라우드 이미지 URL 모으기 (중복 제거를 위해 Set 사용)
    const allUrls = new Set<string>();
    if (invitation.galleryImages) {
      invitation.galleryImages.forEach(url => allUrls.add(url));
    }
    if (invitation.mainImage) allUrls.add(invitation.mainImage);
    if (invitation.closingImage) allUrls.add(invitation.closingImage);

    // 3. URL에서 파일명만 추출하기
    const fileNames = Array.from(allUrls).map(url => {
      if (url.includes('wedding-gallery')) {
        let fileName = url.split('/').pop();
        if (fileName) return decodeURIComponent(fileName.split('?')[0]);
      }
      return null;
    }).filter(Boolean) as string[];

    // 4. Supabase Storage에서 파일들 한꺼번에 영구 삭제!
    if (fileNames.length > 0) {
      const { error } = await supabase.storage.from('wedding-gallery').remove(fileNames);
      if (error) console.error('Supabase 파일 삭제 실패:', error);
      else console.log(`✅ 클라우드에서 ${fileNames.length}개의 파일 삭제 완료`);
    }

    // 5. DB에서 청첩장 데이터 삭제
    await prisma.invitation.delete({
      where: { id: inviteId },
    });

    // 6. 어드민 페이지 데이터 새로고침
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('청첩장 삭제 에러:', error);
    return { success: false, error: '삭제 중 서버 오류가 발생했습니다.' };
  }
}