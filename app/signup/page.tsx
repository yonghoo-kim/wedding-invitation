'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Loader2, Check, X } from 'lucide-react';
import { registerUser } from '@/app/actions/userAuth';
import { Noto_Sans_KR, Inter } from 'next/font/google';
import * as motion from "framer-motion/client";

// 폰트 설정 (랜딩 페이지와 동일한 무드)
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const notoSansKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '900'], display: 'swap' });

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [passwordStrength, setPasswordStrength] = useState(0); 
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength += 1; 
    if (/[A-Z]/.test(pwd)) strength += 1; 
    if (/[a-z]/.test(pwd)) strength += 1; 
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) strength += 1; 
    
    if (pwd.length === 0) strength = 0;
    setPasswordStrength(strength);

    if (formData.confirmPassword.length > 0) {
      setPasswordsMatch(pwd === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  // 🌟 모던 톤에 맞춘 강도별 색상 변경 (Orange, Emerald 등 사용)
  const getStrengthUI = () => {
    if (passwordStrength === 0) return { text: '', color: 'bg-zinc-200', textCol: 'text-zinc-400' };
    if (passwordStrength <= 2) return { text: '약함', color: 'bg-red-400', textCol: 'text-red-500' };
    if (passwordStrength === 3) return { text: '보통', color: 'bg-orange-400', textCol: 'text-orange-500' };
    return { text: '강함', color: 'bg-emerald-500', textCol: 'text-emerald-500' };
  };
  const strengthUI = getStrengthUI();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordStrength < 2) return setErrorMsg('비밀번호가 너무 약합니다. 8자 이상, 영문/숫자/기호를 섞어주세요.');
    if (!passwordsMatch) return setErrorMsg('비밀번호가 일치하지 않습니다.');

    setIsSubmitting(true);
    setErrorMsg('');

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);

    const result = await registerUser(form);

    if (result.success) {
      alert(`${formData.name}님, 환영합니다! 회원가입이 완료되었습니다.`);
      router.push('/'); 
      router.refresh();
    } else {
      setErrorMsg(result.error || '회원가입 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  // 🌟 인풋을 더 얇고 모던하게, 포커스 시 부드러운 오렌지 링 효과
  const inputClass = "w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all text-zinc-900 font-medium placeholder:text-zinc-400";
  const labelClass = "block text-[12px] font-bold text-zinc-600 mb-1.5";

  return (
    <div className={`relative min-h-[100dvh] bg-[#FCFCFD] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-orange-100 ${notoSansKr.className} overflow-hidden`}>
      
      {/* 🌟 화사한 오로라빛 배경 (랜딩 페이지와 통일) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-60">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-orange-200 to-rose-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-amber-100 to-yellow-50 blur-[100px]" />
      </div>

      {/* 홈으로 돌아가기 (플로팅 버튼 스타일) */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-bold text-xs transition-colors bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white shadow-sm z-10">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      {/* 🌟 폼 컨테이너: 여백을 확 줄이고 촘촘하게 구성 */}
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
          <h1 className={`${inter.className} text-2xl font-black text-zinc-900 tracking-tight`}>Create Account</h1>
          <p className="text-[13px] text-zinc-500 mt-1.5 font-medium">단 3분만에 나만의 청첩장 완성하기</p>
        </div>

        {/* 폼 간격(space-y)을 줄임 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className={labelClass}>이름</label>
            <input type="text" name="name" required placeholder="홍길동" value={formData.name} onChange={handleChange} className={inputClass} tabIndex={1} />
          </div>

          <div>
            <label className={labelClass}>이메일 주소</label>
            <input type="email" name="email" required placeholder="name@example.com" value={formData.email} onChange={handleChange} className={inputClass} tabIndex={2} />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-[12px] font-bold text-zinc-600">비밀번호</label>
              {formData.password && (
                <span className={`text-[10px] font-black tracking-wide uppercase ${strengthUI.textCol}`}>{strengthUI.text}</span>
              )}
            </div>
            <input type="password" name="password" required placeholder="8자 이상, 대소문자/숫자 조합" value={formData.password} onChange={handleChange} className={inputClass} tabIndex={3} />
            
            {/* 비밀번호 게이지 바: 더 슬림하게 */}
            <div className="flex gap-1 mt-2 h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 1 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 2 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 3 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 4 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
            </div>
          </div>

          <div>
            <label className={labelClass}>비밀번호 확인</label>
            <div className="relative">
              <input type="password" name="confirmPassword" required placeholder="비밀번호 재입력" value={formData.confirmPassword} onChange={handleChange} 
                className={`${inputClass} ${passwordsMatch === false ? '!border-red-400 focus:!ring-red-500/10' : ''}`} tabIndex={4} 
              />
              {formData.confirmPassword && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                </div>
              )}
            </div>
          </div>
          
          {/* 에러 메시지도 컴팩트하게 */}
          {errorMsg && <div className="p-2.5 bg-red-50 text-red-600 text-[13px] font-bold rounded-lg text-center border border-red-100">{errorMsg}</div>}
          
          <button type="submit" disabled={isSubmitting || !passwordsMatch || passwordStrength < 2} tabIndex={5}
            className="w-full py-3.5 mt-2 bg-zinc-900 text-white font-bold text-[14px] rounded-xl hover:bg-orange-500 transition-all shadow-md hover:shadow-orange-500/20 disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:shadow-none flex justify-center items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? '계정 생성 중...' : '무료 계정 만들기'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
          <p className="text-[12px] text-zinc-500 font-medium">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-bold text-zinc-900 hover:text-orange-500 transition-colors ml-1">
              로그인
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}