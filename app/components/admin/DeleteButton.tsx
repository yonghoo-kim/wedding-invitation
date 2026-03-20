// app/components/admin/DeleteButton.tsx
'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteInvitationData } from '@/app/actions/deleteInvitation';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  inviteId: string;
  title: string;
}

export default function DeleteButton({ inviteId, title }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    // 중요: 부모인 <Link> 태그의 이동 이벤트를 막아줍니다.
    e.preventDefault();
    e.stopPropagation();

    // 🌟 삭제 확인 알림창
    const isConfirmed = window.confirm(
      `[${title}] 청첩장을 정말 삭제하시겠습니까?\n업로드된 모든 사진과 데이터가 영구적으로 삭제되며 복구할 수 없습니다.`
    );

    if (isConfirmed) {
      setIsDeleting(true);
      const result = await deleteInvitationData(inviteId);
      
      if (result.success) {
        alert('완벽하게 삭제되었습니다.');
        router.refresh(); // 화면 새로고침
      } else {
        alert(result.error || '삭제에 실패했습니다.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 left-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-sm transition-all z-20 shadow-sm"
      title="이 청첩장 삭제하기"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}