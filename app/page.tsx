import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { 
  ArrowRight, Sparkles, LayoutTemplate, HeartHandshake,
  CreditCard, LogOut, LayoutDashboard, MessageSquare, Users, Link2, Plus
} from 'lucide-react';
import { Noto_Sans_KR, Inter } from 'next/font/google';
import { logoutUser } from '@/app/actions/userAuth';
import * as motion from "framer-motion/client";

// 폰트 설정
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const notoSansKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '900'], display: 'swap' });

// 🌟 트렌디한 스프링 애니메이션
const springFadeIn = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring", stiffness: 100, damping: 20 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

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
    // 🌟 세로 스크롤 완벽 복구: absolute inset-0 w-full h-[100dvh] overflow-y-auto overflow-x-hidden
    <main className={`absolute inset-0 w-full h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#FCFCFD] selection:bg-orange-100 text-zinc-900 ${notoSansKr.className} pb-20`}>
      
      {/* 화사한 오로라빛 배경 */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none opacity-60">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-orange-200 to-rose-100 blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-amber-100 to-yellow-50 blur-[100px]" />
      </div>

      {/* 1. 플로팅 헤더 */}
      <div className="fixed top-6 inset-x-0 w-full z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between w-full max-w-4xl px-5 py-3.5 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full transition-all">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center rounded-full group-hover:bg-orange-500 transition-colors">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className={`${inter.className} text-xl font-black tracking-tight text-zinc-900`}>O'hoo</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-zinc-500 hidden sm:inline mr-2 text-sm font-semibold">
                  <span className="text-zinc-900">{userName}</span>님
                </span>
                <Link href="/mypage" className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full transition-all text-sm font-bold">
                  <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">대시보드</span>
                </Link>
                <form action={logoutUser}>
                  <button type="submit" className="flex items-center justify-center w-9 h-9 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-red-500 rounded-full transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-bold">로그인</Link>
                <Link href="/signup" className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-colors shadow-sm">
                  무료 시작하기
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* 🌟 2. 메인 히어로 & Bento Grid 통합 섹션 (오글거리는 멘트 제거, 담백하게 변경) */}
      <motion.section 
        initial="initial" 
        whileInView="animate" 
        viewport={{ once: true }} 
        variants={staggerContainer}
        className="pt-36 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div variants={springFadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[13px] font-bold mb-6 border border-orange-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            쉽고 깔끔한 모바일 청첩장
          </motion.div>
          
          <motion.h1 variants={springFadeIn} className="text-5xl md:text-6xl lg:text-[5rem] font-black text-zinc-900 mb-6 leading-[1.05] tracking-tighter break-keep">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-400">
              우리의 초대장.
            </span>
          </motion.h1>
          
          <motion.p variants={springFadeIn} className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            복잡한 과정은 다 뺐습니다. 꼭 필요한 기능만 담아 누구나 직관적으로 모바일 청첩장을 만들 수 있습니다.
          </motion.p>
          
          <motion.div variants={springFadeIn} className="flex flex-wrap justify-center gap-3">
            {isLoggedIn ? (
              <Link href="/create" className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/10">
                <Plus className="w-5 h-5" /> 새 청첩장 만들기
              </Link>
            ) : (
              <Link href="/signup" className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/10">
                지금 무료로 만들기 <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-zinc-700 font-bold rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all shadow-sm">
              샘플 디자인 보기
            </button>
          </motion.div>
        </div>

        {/* 🌟 밀도 높은 Bento Grid (담백한 문구로 수정) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[240px]">
          
          {/* 큰 박스 1: 직관적인 에디터 */}
          <motion.div variants={springFadeIn} className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between overflow-hidden group hover:border-orange-200 transition-colors relative">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-5">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">어려운 설정 없이 간편하게</h3>
              <p className="text-zinc-500 font-medium">눈에 보이는 대로 텍스트를 적고 사진을 올리세요.<br/>드래그 앤 드롭으로 3분이면 레이아웃이 완성됩니다.</p>
            </div>
            {/* 추상적인 UI 조각 비주얼 */}
            <div className="relative h-48 mt-8 w-full bg-zinc-50 rounded-2xl border border-zinc-100 p-4 flex gap-3 group-hover:bg-orange-50/50 transition-colors z-10">
              <div className="w-1/3 h-full bg-white rounded-xl shadow-sm border border-zinc-100/50 flex flex-col p-3 gap-2">
                <div className="w-full h-20 bg-zinc-100 rounded-lg animate-pulse"></div>
                <div className="w-3/4 h-3 bg-zinc-100 rounded-full mt-auto"></div>
              </div>
              <div className="flex-1 h-full flex flex-col gap-3">
                <div className="w-full flex-1 bg-white rounded-xl shadow-sm border border-zinc-100/50 p-3 flex flex-col justify-center gap-2">
                   <div className="w-1/2 h-3 bg-zinc-100 rounded-full"></div>
                   <div className="w-full h-3 bg-zinc-100 rounded-full"></div>
                </div>
                <div className="w-full flex-1 bg-white rounded-xl shadow-sm border border-zinc-100/50 p-3 flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><Sparkles className="w-4 h-4"/></div>
                   <div className="flex-1 h-3 bg-zinc-100 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 중간 박스 1: 방명록 */}
          <motion.div variants={springFadeIn} className="md:col-span-2 bg-zinc-900 rounded-3xl p-8 text-white flex flex-row items-center justify-between overflow-hidden group">
            <div className="flex-1">
              <div className="w-10 h-10 bg-zinc-800 text-white rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">실시간 축하 메시지</h3>
              <p className="text-zinc-400 text-sm font-medium">하객들이 남겨준 축하 인사를 방명록에서 한눈에 확인하세요.</p>
            </div>
            <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform">
               <HeartHandshake className="w-12 h-12 text-rose-400" />
               <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
            </div>
          </motion.div>

          {/* 작은 박스 1: 1초 계좌복사 */}
          <motion.div variants={springFadeIn} className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">마음 전하기</h3>
              <p className="text-zinc-500 text-sm font-medium">터치 한 번으로 쉽게 계좌번호를 복사할 수 있습니다.</p>
            </div>
          </motion.div>

          {/* 작은 박스 2: 참석자 관리 */}
          <motion.div variants={springFadeIn} className="bg-orange-50 rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-zinc-900">참석 인원 파악</h3>
                <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full">PRO</span>
              </div>
              <p className="text-orange-700/70 text-sm font-medium">누가 오는지, 식사는 하는지 간편하게 취합하세요.</p>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* 🌟 3. 미니멀한 콜투액션(CTA) 섹션 (멘트 담백하게 변경) */}
      <motion.section 
        initial="initial" 
        whileInView="animate" 
        viewport={{ once: true, amount: 0.5 }} 
        variants={staggerContainer}
        className="mt-24 px-4 max-w-4xl mx-auto text-center"
      >
        <motion.div variants={springFadeIn} className="bg-zinc-900 rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 -z-0"></div>
          <div className="relative z-10">
            <Link2 className="w-12 h-12 text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">지금 바로 만들어보세요.</h2>
            <p className="text-zinc-400 mb-8 font-medium">수정은 언제든 자유롭게 가능합니다. 가벼운 마음으로 시작해보세요.</p>
            {isLoggedIn ? (
              <Link href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-bold rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                청첩장 만들기 시작 <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-bold rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                회원가입 후 무료로 만들기 <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>
      </motion.section>

      {/* 🌟 4. 새로운 형태의 미니멀 푸터 */}
      <footer className="mt-24 max-w-6xl mx-auto px-6 border-t border-zinc-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
        <div className="flex items-center gap-2 text-zinc-900 font-black text-lg">
          <Sparkles className="w-4 h-4 text-orange-500" /> O'hoo
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-zinc-500">
          <Link href="#" className="hover:text-zinc-900 transition-colors">이용약관</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">개인정보처리방침</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">고객센터</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">자주 묻는 질문</Link>
        </div>

        <div className="text-xs text-zinc-400 font-medium">
          © 2026 O'hoo Inc. All rights reserved.
        </div>
      </footer>
      
    </main>
  );
}