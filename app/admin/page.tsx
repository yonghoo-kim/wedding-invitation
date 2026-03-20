// app/admin/page.tsx
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma'; // 본인 경로에 맞게 확인해주세요
import Image from 'next/image';
import Link from 'next/link';
import AdminLoginForm from '@/app/components/admin/AdminLoginForm';
import DeleteButton from '@/app/components/admin/DeleteButton';

export default async function AdminPage() {
  // 1. 관리자 쿠키 확인 (Next.js 15 방식)
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_token')?.value === 'true';

  // 2. 로그인이 안 되어 있다면 로그인 폼 보여주기
  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  // 3. DB에서 모든 청첩장 목록 가져오기 (최신순)
  const invitations = await prisma.invitation.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-stone-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">어드민 대시보드</h1>
            <p className="text-stone-500 mt-2">생성된 청첩장 목록을 관리합니다.</p>
          </div>
          <p className="text-sm font-bold text-stone-600">총 {invitations.length}개의 청첩장</p>
        </div>

        {/* 썸네일 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {invitations.map((inv) => {
            const imageUrl = inv.mainImage || (inv.galleryImages?.length > 0 ? inv.galleryImages[0] : '/images/wedding/section1.jpg');
            const title = `${inv.groomFirstName} & ${inv.brideFirstName}`;

            return (
              // 🌟 <Link> 밖으로 빼내서 버튼 클릭 시 페이지 이동이 안 겹치게 만듭니다.
              <div key={inv.id} className="relative bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group block">
                
                {/* 🌟 방금 만든 삭제 버튼 장착! */}
                <DeleteButton inviteId={inv.id} title={title} />

                <Link href={`/admin/edit/${inv.id}`} className="block">
                  {/* 썸네일 이미지 */}
                  <div className="relative w-full h-48 bg-stone-200">
                    <Image
                      src={imageUrl}
                      alt="Thumbnail"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                      {inv.theme}
                    </div>
                  </div>

                  {/* 정보 영역 */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-stone-800 mb-1">
                      {inv.groomLastName}{inv.groomFirstName} & {inv.brideLastName}{inv.brideFirstName}
                    </h3>
                    <p className="text-xs text-stone-500 mb-3">
                      {inv.weddingDate.toLocaleDateString('ko-KR')} | {inv.weddingLocation}
                    </p>
                    <div className="text-[10px] font-bold text-amber-600 truncate bg-amber-50 px-2 py-1 rounded w-fit">
                      🔗 /{inv.urlSlug}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}