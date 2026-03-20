import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Sparkles, HeartHandshake, Smartphone, 
  Palette, LogOut, LayoutDashboard, Star, Users, CheckCircle2 
} from 'lucide-react';
import { Gowun_Batang, Noto_Sans_KR } from 'next/font/google';
import { logoutUser } from '@/app/actions/userAuth';

// 🌟 감성적인 제목용 폰트 (고운바탕)
const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
// 🌟 깔끔한 본문용 폰트 (본고딕)
const notoSansKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });

export default async function PlatformLandingPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_token')?.value;

  let userName = '';
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) userName = user.name;
  }
  
  const isLoggedIn = !!userName;

  return (
    // 🌟 Y 스크롤 복구 및 본문 전체에 Noto_Sans_KR 적용
    <main className={`absolute inset-0 w-full h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#FAFAFA] selection:bg-amber-200 text-stone-800 ${notoSansKr.className}`}>
      
      {/* ✨ 배경 데코레이션 */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-amber-100/40 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-b from-rose-50/60 to-transparent blur-[100px]" />
      </div>

      {/* 🌟 1. 상단 네비게이션 바 (GNB) */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className={`${koreanFont.className} text-2xl font-bold tracking-wider text-stone-900`}>O'hoo</span>
          </Link>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            {isLoggedIn ? (
              <>
                <span className="text-stone-600 hidden sm:inline mr-2 bg-stone-100 px-3 py-1.5 rounded-full">
                  <span className="font-bold text-stone-900">{userName}</span>님 환영합니다
                </span>
                <Link href="/mypage" className="flex items-center gap-1.5 px-4 py-2 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all font-bold">
                  <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">나의청첩장</span>
                </Link>
                <form action={logoutUser}>
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-2 text-stone-400 hover:text-stone-700 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-stone-500 hover:text-stone-900 transition-colors font-medium">로그인</Link>
                <Link href="/signup" className="px-5 py-2.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  무료로 시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 🌟 2. 메인 히어로 섹션 (Hero) */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-stone-600 text-xs font-bold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
              2026 트렌드 반영 프리미엄 청첩장 솔루션
            </div>
            
            <h1 className={`${koreanFont.className} text-5xl lg:text-[4rem] font-bold text-stone-900 mb-6 leading-[1.15] tracking-tight`}>
              가장 빛나는 순간,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-400">
                완벽한 초대장
              </span>
              을<br /> 경험하세요.
            </h1>
            
            <p className="text-stone-500 text-lg mb-10 max-w-xl leading-relaxed">
              복잡한 코딩이나 디자인 지식은 필요 없습니다. O'hoo의 직관적인 빌더를 통해 단 3분 만에 우리 커플만의 감성을 담은 모바일 청첩장을 완성해 보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/create" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1">
                    새 청첩장 만들기 <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/mypage" className="w-full sm:w-auto px-8 py-4 bg-white text-stone-800 font-bold rounded-2xl border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm text-center">
                    내 청첩장 관리
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl hover:-translate-y-1">
                    지금 무료로 만들기 <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-700 font-bold rounded-2xl border border-stone-200 hover:bg-white transition-colors shadow-sm">
                    샘플 갤러리 보기
                  </button>
                </>
              )}
            </div>

            <div className="mt-12 flex items-center gap-6 pt-8 border-t border-stone-200/60">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-stone-${i*100} flex items-center justify-center shadow-sm bg-stone-200`} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-stone-500"><strong className="text-stone-800">12,400+</strong> 쌍의 예비 부부가 선택했습니다</p>
              </div>
            </div>
          </div>

          {/* 우측 목업 */}
          <div className="relative hidden lg:block h-[600px] w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-amber-200/40 to-rose-200/40 rounded-full blur-3xl -z-10" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-[10px] border-stone-100 overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-stone-50 relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-white rounded-b-3xl w-1/2 mx-auto z-10" />
                <div className="w-full h-[50%] bg-stone-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
                </div>
                <div className="p-6 text-center mt-4">
                  <p className={`${koreanFont.className} text-2xl mb-2 font-bold`}>김철수 & 이영희</p>
                  <p className="text-xs text-stone-400 mb-6 font-medium">2026. 05. 24. SAT PM 12:30</p>
                  <div className="w-full h-10 bg-stone-100 rounded-lg mb-3 animate-pulse" />
                  <div className="w-3/4 h-10 bg-stone-100 rounded-lg mx-auto animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 🌟 3. 주요 기능 소개 섹션 (Features) */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-amber-600 font-bold tracking-wider text-sm mb-3">CORE FEATURES</h2>
            <h3 className={`${koreanFont.className} text-4xl font-bold text-stone-900 mb-4`}>결혼 준비를 더 완벽하게</h3>
            <p className="text-stone-500 text-lg">오직 두 사람에게만 집중하세요. 나머지는 O'hoo가 해결해 드립니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-10 rounded-3xl bg-stone-50 border border-stone-100/80 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                  <Palette className="text-amber-500 w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold text-stone-900 mb-4">커스텀 테마 에셋</h4>
                <p className="text-stone-500 text-lg leading-relaxed max-w-md">
                  계절의 변화, 두 사람의 취향을 담은 수십 가지의 프리미엄 템플릿. 드래그 앤 드롭으로 사진과 텍스트를 손쉽게 배치하세요.
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="p-10 rounded-3xl bg-stone-900 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-stone-800 rounded-2xl flex items-center justify-center mb-8 border border-stone-700">
                <Smartphone className="text-white w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold mb-4">모바일 최적화 UI</h4>
              <p className="text-stone-400 leading-relaxed">
                어떤 기기에서도 완벽한 비율. 카카오톡 공유 썸네일까지 세심하게 맞춰드립니다.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-rose-50 border border-rose-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <HeartHandshake className="text-rose-400 w-7 h-7" />
              </div>
              <h4 className="text-2xl font-bold text-stone-900 mb-4">하객 편의 기능</h4>
              <ul className="space-y-3 font-medium">
                {['원터치 계좌복사', '실시간 방명록', '네비게이션 연동'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-stone-600">
                    <CheckCircle2 className="w-5 h-5 text-rose-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 p-10 rounded-3xl bg-stone-50 border border-stone-100/80 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                  <Users className="text-stone-700 w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold text-stone-900 mb-4">참석자 관리 대시보드</h4>
                <p className="text-stone-500 text-lg leading-relaxed max-w-sm">
                  누가 참석하는지, 식사 여부는 어떠한지 한눈에 파악하세요. 복잡한 인원 체크가 스마트해집니다.
                </p>
              </div>
              <div className="w-full md:w-64 h-40 bg-white rounded-xl shadow-inner border border-stone-200 p-4 flex flex-col gap-3">
                <div className="w-full h-8 bg-stone-100 rounded-md animate-pulse" />
                <div className="w-3/4 h-8 bg-stone-100 rounded-md animate-pulse" />
                <div className="w-5/6 h-8 bg-stone-100 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 4. 푸터 (Footer) */}
      <footer className="bg-stone-950 pt-20 pb-10 px-6 text-stone-400 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h2 className={`${koreanFont.className} text-3xl font-bold text-white mb-4 tracking-wider flex items-center gap-2`}>
              <Sparkles className="text-amber-500 w-5 h-5" /> O'hoo
            </h2>
            <p className="text-stone-400 mb-6 max-w-sm leading-relaxed">
              가장 아름다운 시작을 함께합니다.<br />
              감성을 담은 프리미엄 모바일 청첩장 플랫폼.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">서비스</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="#" className="hover:text-amber-400 transition-colors">기능 소개</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">샘플 디자인</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">요금 안내</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">고객지원</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="#" className="hover:text-amber-400 transition-colors">자주 묻는 질문</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">1:1 문의하기</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors">이용약관 및 개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 O'hoo Web Service. All rights reserved.</p>
          <div className="flex gap-4">
            <span>사업자등록번호: 123-45-67890</span>
            <span>통신판매업신고: 제2026-서울강남-0000호</span>
          </div>
        </div>
      </footer>
      
    </main>
  );
}