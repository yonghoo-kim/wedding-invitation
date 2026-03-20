// app/mypage/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma'; // 🌟 본인 경로에 맞게 확인해주세요
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, PlusCircle, ArrowLeft, ExternalLink } from 'lucide-react'; // 🌟 ExternalLink 아이콘 추가
import DeleteButton from '@/app/components/admin/DeleteButton';
import { Gowun_Batang } from 'next/font/google';

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

export default async function MyPage() {
  // 1. 유저 로그인 상태 확인
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_token')?.value;

  // 로그인이 안 되어 있다면 로그인 페이지로 강제 이동
  if (!userId) {
    redirect('/login');
  }

  // 2. DB에서 유저 이름 가져오기
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect('/login');
  }

  // 3. 로그인한 유저(userId)가 만든 청첩장만 가져오기
  const invitations = await prisma.invitation.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 md:p-10 font-sans selection:bg-stone-200">
      <div className="max-w-6xl mx-auto">
        
        {/* 상단 헤더 & 뒤로가기 */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-sm transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> 홈으로
          </Link>
          <div className="flex justify-between items-end border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-amber-500 w-5 h-5" />
                <span className={`${koreanFont.className} text-stone-500 font-bold`}>My Page</span>
              </div>
              <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
                <span className="text-amber-600">{user.name}</span>님의 청첩장
              </h1>
            </div>
            {invitations.length > 0 && (
              <Link href="/create" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-all shadow-sm text-sm">
                <PlusCircle className="w-4 h-4" /> 새 청첩장 만들기
              </Link>
            )}
          </div>
        </div>

        {/* 청첩장이 없을 때 (Empty State) */}
        {invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white rounded-2xl border border-stone-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="text-stone-300 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">아직 만들어진 청첩장이 없어요!</h2>
            <p className="text-stone-500 mb-8 max-w-md leading-relaxed">
              O'hoo와 함께 가장 아름다운 순간을 기록해보세요.<br/>
              단 3분이면 우리 커플만의 모바일 초대장이 완성됩니다.
            </p>
            <Link href="/create" className="px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-lg hover:-translate-y-1">
              무료로 첫 청첩장 만들기
            </Link>
          </div>
        ) : (
          /* 청첩장이 있을 때 썸네일 그리드 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {invitations.map((inv) => {
              const imageUrl = inv.mainImage || (inv.galleryImages?.length > 0 ? inv.galleryImages[0] : '/images/wedding/section1.jpg');
              const title = `${inv.groomFirstName} & ${inv.brideFirstName}`;

              return (
                <div key={inv.id} className="relative flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group">
                  
                  <DeleteButton inviteId={inv.id} title={title} />

                  {/* 🌟 1. 클릭 시 수정 페이지로 가는 상단 영역 */}
                  <Link href={`/admin/edit/${inv.id}`} className="block flex-grow">
                    <div className="relative w-full h-56 bg-stone-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Thumbnail"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <div className="bg-white/90 text-stone-800 font-bold text-[11px] px-2.5 py-1.5 rounded-md backdrop-blur-md shadow-sm">
                          {inv.theme.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pb-2">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className={`${koreanFont.className} text-xs text-amber-600 font-bold mb-1 tracking-wider`}>
                            {inv.weddingDate.toLocaleDateString('ko-KR')}
                          </p>
                          <h3 className="text-xl font-bold text-stone-900">
                            {inv.groomLastName}{inv.groomFirstName} <span className="text-stone-300 font-normal mx-1">&</span> {inv.brideLastName}{inv.brideFirstName}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 text-sm text-stone-500">
                        <span className="truncate">{inv.weddingLocation}</span>
                      </div>
                    </div>
                  </Link>

                  {/* 🌟 2. 독립된 하단 액션 바 (미리보기 & 수정하기) */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div className="text-xs font-bold text-stone-400 bg-stone-50 px-3 py-1.5 rounded-md truncate max-w-[100px]">
                        /{inv.urlSlug}
                      </div>
                      <div className="flex items-center gap-4">
                        {/* 미리보기 버튼 (새 창 열림) */}
                        <Link 
                          href={`/${inv.urlSlug}`} /* 🌟 실제 라우팅 경로에 맞게 수정해주세요 (예: /invite/${inv.urlSlug}) */
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          미리보기 <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {/* 수정하기 버튼 */}
                        <Link 
                          href={`/admin/edit/${inv.id}`} 
                          className="text-sm font-bold text-stone-900 hover:text-amber-600 transition-colors"
                        >
                          수정하기 →
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}