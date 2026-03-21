// app/mypage/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Plus, ArrowLeft, ExternalLink, CalendarDays, MapPin, Link2, LayoutDashboard} from 'lucide-react';
import DeleteButton from '@/app/components/admin/DeleteButton';
import { Noto_Sans_KR, Inter } from 'next/font/google';

// 🌟 폰트 설정 (통일된 모던 무드)
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const notoSansKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '900'], display: 'swap' });

export default async function MyPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_token')?.value;

  if (!userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect('/login');
  }

  const invitations = await prisma.invitation.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    // 🌟 화사한 오프화이트 배경과 징크 텍스트
    <div className={`relative min-h-[100dvh] bg-[#FCFCFD] p-6 md:p-10 text-zinc-900 selection:bg-orange-100 ${notoSansKr.className} overflow-hidden`}>
      
      {/* 🌟 화사한 오로라빛 배경 (통일된 디자인) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-orange-200 to-rose-100 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[30%] h-[30%] rounded-full bg-gradient-to-bl from-amber-100 to-yellow-50 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* 상단 헤더 & 뒤로가기 */}
        <div className="mb-12">
          {/* 플로팅 뒤로가기 스타일 */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-bold text-xs transition-colors bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-zinc-200/60 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
                  <Sparkles className="text-white w-3 h-3" />
                </div>
                <span className={`${inter.className} text-zinc-500 font-bold text-sm tracking-wide uppercase`}>Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                <span className="text-orange-500">{user.name}</span>님의 청첩장
              </h1>
            </div>
            {invitations.length > 0 && (
              <Link href="/create" className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-orange-500 transition-colors shadow-sm shadow-orange-500/10 text-sm shrink-0">
                <Plus className="w-4 h-4" /> 새 청첩장 만들기
              </Link>
            )}
          </div>
        </div>

        {/* 청첩장이 없을 때 (Empty State) */}
        {invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-zinc-900 mb-2 tracking-tight">아직 제작된 청첩장이 없습니다.</h2>
            <p className="text-zinc-500 mb-8 max-w-md font-medium">
              직관적인 에디터를 사용해 세상에 단 하나뿐인<br/>
              특별한 모바일 청첩장을 만들어보세요.
            </p>
            <Link href="/create" className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/10">
              <Plus className="w-5 h-5" /> 무료로 첫 청첩장 만들기
            </Link>
          </div>
        ) : (
          /* 청첩장이 있을 때 썸네일 그리드 (모던 카드 스타일) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const imageUrl = inv.mainImage || (inv.galleryImages?.length > 0 ? inv.galleryImages[0] : '/images/wedding/section1.jpg');
              const title = `${inv.groomFirstName} & ${inv.brideFirstName}`;

              return (
                <div key={inv.id} className="relative flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-zinc-100 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-orange-100 transition-all duration-300 group">
                  
                  {/* 상단 썸네일 이미지 영역 */}
                  <Link href={`/admin/edit/${inv.id}`} className="block relative w-full h-56 bg-zinc-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Thumbnail"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    {/* 오버레이 그라데이션 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    
                    {/* 테마 뱃지 */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-md text-zinc-900 font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        {inv.theme}
                      </div>
                    </div>

                    {/* 날짜 정보 (이미지 위 하단 배치) */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 font-medium text-sm">
                      <CalendarDays className="w-4 h-4" />
                      {inv.weddingDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </Link>

                  {/* 🌟 Delete 버튼 위치 조정 (오른쪽 상단 절대 위치) */}
                  <div className="absolute top-4 right-4 z-10">
                    <DeleteButton inviteId={inv.id} title={title} />
                  </div>

                  {/* 하단 텍스트 정보 영역 */}
                  <div className="p-6 pb-5 flex-grow flex flex-col justify-between">
                    <Link href={`/admin/edit/${inv.id}`} className="block group-hover:opacity-80 transition-opacity">
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                          {inv.groomLastName}{inv.groomFirstName} 
                          <span className="text-zinc-300 font-normal text-lg">&</span> 
                          {inv.brideLastName}{inv.brideFirstName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium line-clamp-1">
                        <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="truncate">{inv.weddingLocation}</span>
                      </div>
                    </Link>

                    {/* 독립된 하단 액션 바 */}
                    <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 bg-zinc-50 px-2.5 py-1.5 rounded-lg truncate max-w-[120px]">
                        <Link2 className="w-3 h-3 text-zinc-400" />
                        /{inv.urlSlug}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* 미리보기 링크 */}
                        <Link 
                          href={`/${inv.urlSlug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[13px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          Preview <ExternalLink className="w-3 h-3" />
                        </Link>
                        
                        <div className="w-px h-3 bg-zinc-200"></div>
                        
                        {/* 편집 링크 */}
                        <Link 
                          href={`/admin/edit/${inv.id}`} 
                          className="text-[13px] font-bold text-orange-600 hover:text-orange-500 transition-colors"
                        >
                          Edit →
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