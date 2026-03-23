// app/admin/edit/[inviteId]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditInvitationClient from '@/app/components/admin/EditInvitationClient';

interface PageProps {
  params: Promise<{ inviteId: string }>;
}

export default async function AdminEditPage({ params }: PageProps) {
  const { inviteId } = await params;

  // DB에서 기존 데이터 불러오기
  const invitation = await prisma.invitation.findFirst({
    where: { OR: [{ id: inviteId }, { urlSlug: inviteId }] },
  });

  if (!invitation) return notFound();

  // 🌟 [핵심] DB의 UTC 시간에 무조건 9시간을 더해 KST로 맞춘 후 문자열로 변환!
  const formatForInput = (date: Date) => {
    // 9시간 = 9 * 60분 * 60초 * 1000밀리초
    const kstTime = date.getTime() + (9 * 60 * 60 * 1000);
    const kstDate = new Date(kstTime);
    // getISOString()은 항상 Z 포맷으로 나오므로, 16자리까지만 자르면 완벽한 KST 로컬 시간이 됨
    return kstDate.toISOString().slice(0, 16);
  };

  const formattedData = {
    ...invitation,
    weddingDate: formatForInput(invitation.weddingDate),
    groomAccountInfo: invitation.groomAccountInfo || {},
    brideAccountInfo: invitation.brideAccountInfo || {},
  };

  return <EditInvitationClient initialData={formattedData} />;
}