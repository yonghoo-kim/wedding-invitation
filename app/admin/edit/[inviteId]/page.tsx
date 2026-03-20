// app/admin/edit/[inviteId]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditInvitationClient from '@/app/components/admin/EditInvitationClient';

interface PageProps {
  params: Promise<{ inviteId: string }>;
}

export default async function AdminEditPage({ params }: PageProps) {
  const { inviteId } = await params;

  // DB에서 기존 데이터 불러오기 (urlSlug나 id 모두 대응 가능하게 찾기)
  const invitation = await prisma.invitation.findFirst({
    where: { OR: [{ id: inviteId }, { urlSlug: inviteId }] },
  });

  if (!invitation) return notFound();

  // 날짜 데이터를 input[type="datetime-local"]에 맞게 포맷팅 (YYYY-MM-DDTHH:mm)
  const formatForInput = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const formattedData = {
    ...invitation,
    weddingDate: formatForInput(invitation.weddingDate),
    // 계좌 정보가 빈 객체일 경우를 대비
    groomAccountInfo: invitation.groomAccountInfo || {},
    brideAccountInfo: invitation.brideAccountInfo || {},
  };

  return <EditInvitationClient initialData={formattedData} />;
}