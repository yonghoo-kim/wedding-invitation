'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { loginUser } from '@/app/actions/userAuth'; // 🌟 registerUser 제거, loginUser만 사용

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    
    // 🌟 분기 처리 없이 바로 로그인 서버 액션 실행
    const result = await loginUser(formData);

    if (result.success) {
      alert('로그인 되었습니다!');
      router.push('/'); // 성공 시 메인 페이지로 이동
      router.refresh();
    } else {
      setErrorMsg(result.error || '로그인 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-[15px] focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center items-center p-6 selection:bg-stone-200 font-sans">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> 홈으로
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-stone-100">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center mb-5 shadow-md">
            <Sparkles className="text-amber-200 w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            다시 만나서 반가워요
          </h1>
          <p className="text-sm text-stone-500 mt-2 font-medium">
            등록하신 정보로 O'hoo에 로그인해주세요.
          </p>
        </div>

        {/* 🌟 순수 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-bold text-stone-700 mb-2">이메일 주소</label>
            <input 
              type="email" 
              name="email"
              required
              placeholder="example@wedding.com" 
              className={inputClass}
            />
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[13px] font-bold text-stone-700">비밀번호</label>
              <Link href="#" className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors font-medium">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <input 
              type="password" 
              name="password"
              required
              placeholder="••••••••" 
              className={inputClass}
            />
          </div>
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center border border-red-100">
              {errorMsg}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-stone-900 text-white font-bold text-[15px] rounded-xl hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSubmitting ? '로그인 처리 중...' : 'O\'hoo 로그인'}
          </button>
        </form>

        {/* 🌟 회원가입 페이지로 넘어가는 링크 */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-[13px] text-stone-500">
            아직 계정이 없으신가요?
            <Link href="/signup" className="font-bold text-stone-900 hover:text-amber-600 transition-colors ml-2">
              이메일로 무료 회원가입
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}