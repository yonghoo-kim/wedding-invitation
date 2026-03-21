// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { loginUser } from '@/app/actions/userAuth';
import { Noto_Sans_KR, Inter } from 'next/font/google';
import * as motion from "framer-motion/client";

// 🌟 폰트 설정 (회원가입 페이지와 동일한 무드)
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const notoSansKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '900'], display: 'swap' });

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);

    const result = await loginUser(formData);

    if (result.success) {
      alert('로그인 되었습니다!');
      router.push('/');
      router.refresh();
    } else {
      setErrorMsg(result.error || '로그인 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  // 🌟 인풋을 더 얇고 모던하게, 포커스 시 부드러운 오렌지 링 효과
  const inputClass = "w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all text-zinc-900 font-medium placeholder:text-zinc-400";
  const labelClass = "block text-[12px] font-bold text-zinc-600 mb-1.5";

  return (
    <div className={`relative min-h-[100dvh] bg-[#FCFCFD] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-orange-100 ${notoSansKr.className} overflow-hidden`}>
      
      {/* 🌟 화사한 오로라빛 배경 (회원가입 페이지와 통일) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-60">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-orange-200 to-rose-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-amber-100 to-yellow-50 blur-[100px]" />
      </div>

      {/* 🌟 홈으로 돌아가기 (플로팅 버튼 스타일) */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-bold text-xs transition-colors bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm z-10">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      {/* 🌟 폼 컨테이너: 오밀조밀하고 촘촘하게 구성 (Framer Motion 등장 효과) */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="w-full max-w-[400px] bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white relative z-10"
      >

        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className={`${inter.className} text-2xl font-black text-zinc-900 tracking-tight`}>
            Welcome Back
          </h1>
          <p className="text-[13px] text-zinc-500 mt-1.5 font-medium">
            등록하신 정보로 O'hoo에 로그인해주세요.
          </p>
        </div>

        {/* 🌟 순수 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>이메일 주소</label>
            <input
              type="email"
              name="email"
              required
              tabIndex={1}
              placeholder="name@example.com"
              className={inputClass}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className={labelClass} style={{ marginBottom: 0 }}>비밀번호</label>
            </div>
            <input
              type="password"
              name="password"
              required
              tabIndex={2}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-600 text-[13px] font-bold rounded-lg text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            tabIndex={3}
            className="w-full py-3.5 mt-2 bg-zinc-900 text-white font-bold text-[14px] rounded-xl hover:bg-orange-500 transition-all shadow-md hover:shadow-orange-500/20 disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:shadow-none flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? '로그인 처리 중...' : 'O\'hoo 로그인'}
          </button>
        </form>

        {/* 🌟 회원가입 페이지로 넘어가는 링크 */}
        <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
          <p className="text-[12px] text-zinc-500 font-medium">
            아직 계정이 없으신가요?
            <Link href="/signup" className="font-bold text-zinc-900 hover:text-orange-500 transition-colors ml-1.5">
              무료 회원가입
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}