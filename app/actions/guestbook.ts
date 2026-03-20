// app/actions/guestbook.ts
'use server';

import prisma from '@/lib/prisma'; // 혹은 '@/lib/prisma'

// 1. 방명록 조회 함수
export async function getGuestbooks(invitationId: string) {
  try {
    const messages = await prisma.guestbook.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error('방명록 조회 에러:', error);
    return { success: false, error: '조회에 실패했습니다.' };
  }
}

// 2. 방명록 저장 함수
export async function addGuestbook(data: {
  invitationId: string;
  name: string;
  message: string;
}) {
  try {
    await prisma.guestbook.create({
      data: {
        invitationId: data.invitationId,
        guestName: data.name,
        message: data.message,
        password: '0000', // 나중에 삭제 기능을 위해 임시 비밀번호 할당
      },
    });
    return { success: true };
  } catch (error) {
    console.error('방명록 저장 에러:', error);
    return { success: false, error: '저장에 실패했습니다.' };
  }
}