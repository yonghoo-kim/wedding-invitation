// app/actions/rsvp.ts
'use server';

import prisma from '@/lib/prisma'; // 혹은 '@/lib/prisma'

export async function submitRsvp(data: {
  invitationId: string;
  side: string;
  name: string;
  count: number;
  meal: string;
}) {
  try {
    // 우리가 설계한 Prisma Rsvp 테이블에 맞게 데이터 저장
    await prisma.rsvp.create({
      data: {
        invitationId: data.invitationId,
        guestName: `[${data.side}] ${data.name}`,
        attendStatus: 'ATTEND', // 이 폼은 참석을 전제로 하므로 ATTEND 고정
        companionCount: data.count - 1, // 동반인 수 (본인 제외)
        hasMeal: data.meal === 'yes', // 식사 예정이면 true, 아니면 false
      },
    });
    return { success: true };
  } catch (error) {
    console.error('RSVP 저장 에러:', error);
    return { success: false, error: '저장에 실패했습니다.' };
  }
}