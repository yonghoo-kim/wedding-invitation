// app/signup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Loader2, Check, X } from 'lucide-react';
import { registerUser } from '@/app/actions/userAuth';

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 폼 상태 관리
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  
  // 비밀번호 강도 및 일치 여부 상태
  const [passwordStrength, setPasswordStrength] = useState(0); // 0~4
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌟 비밀번호 실시간 강도 체크 로직
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength += 1; // 길이 8자 이상
    if (/[A-Z]/.test(pwd)) strength += 1; // 대문자 포함
    if (/[a-z]/.test(pwd)) strength += 1; // 소문자 포함
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) strength += 1; // 숫자 또는 특수문자 포함
    
    if (pwd.length === 0) strength = 0;
    setPasswordStrength(strength);

    // 비밀번호 확인 일치 여부
    if (formData.confirmPassword.length > 0) {
      setPasswordsMatch(pwd === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  // 강도별 UI 매핑 헬퍼
  const getStrengthUI = () => {
    if (passwordStrength === 0) return { text: '', color: 'bg-stone-200', textCol: 'text-stone-400' };
    if (passwordStrength <= 2) return { text: '약함', color: 'bg-red-400', textCol: 'text-red-500' };
    if (passwordStrength === 3) return { text: '보통', color: 'bg-amber-400', textCol: 'text-amber-500' };
    return { text: '강함', color: 'bg-green-500', textCol: 'text-green-600' };
  };
  const strengthUI = getStrengthUI();

  // 제출 핸들러
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

  const inputClass = "w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-[15px] focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 focus:bg-white transition-all";
  const labelClass = "block text-[13px] font-bold text-stone-700 mb-2";

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center items-center p-6 selection:bg-stone-200 font-sans overflow-y-auto">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> 홈으로
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-stone-100 my-auto">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center mb-5 shadow-md">
            <Sparkles className="text-amber-200 w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">O'hoo 무료 회원가입</h1>
          <p className="text-sm text-stone-500 mt-2 font-medium">3초만에 가입하고 나만의 청첩장을 만들어보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 이름 입력 */}
          <div>
            <label className={labelClass}>이름 (Name)</label>
            <input type="text" name="name" required placeholder="홍길동" value={formData.name} onChange={handleChange} className={inputClass} />
          </div>

          {/* 이메일 입력 */}
          <div>
            <label className={labelClass}>이메일 주소</label>
            <input type="email" name="email" required placeholder="example@wedding.com" value={formData.email} onChange={handleChange} className={inputClass} />
          </div>

          {/* 비밀번호 입력 & 강도 체크기 */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[13px] font-bold text-stone-700">비밀번호</label>
              {formData.password && (
                <span className={`text-[11px] font-bold ${strengthUI.textCol}`}>{strengthUI.text}</span>
              )}
            </div>
            <input type="password" name="password" required placeholder="8자 이상, 대소문자, 숫자, 특수기호 조합" value={formData.password} onChange={handleChange} className={inputClass} />
            
            {/* 🌟 비밀번호 게이지 바 */}
            <div className="flex gap-1 mt-2.5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 1 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 2 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 3 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
              <div className={`h-full transition-all duration-300 ${passwordStrength >= 4 ? strengthUI.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className={labelClass}>비밀번호 확인</label>
            <div className="relative">
              <input type="password" name="confirmPassword" required placeholder="비밀번호를 다시 입력해주세요" value={formData.confirmPassword} onChange={handleChange} 
                className={`${inputClass} ${passwordsMatch === false ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`} 
              />
              {/* 일치/불일치 아이콘 피드백 */}
              {formData.confirmPassword && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                </div>
              )}
            </div>
            {passwordsMatch === false && <p className="text-red-500 text-xs font-bold mt-2">비밀번호가 일치하지 않습니다.</p>}
          </div>
          
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center border border-red-100">{errorMsg}</div>}
          
          <button type="submit" disabled={isSubmitting || !passwordsMatch || passwordStrength < 2}
            className="w-full py-4 mt-2 bg-stone-900 text-white font-bold text-[15px] rounded-xl hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? '가입 처리 중...' : 'O\'hoo 무료로 시작하기'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-[13px] text-stone-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-bold text-stone-900 hover:text-amber-600 transition-colors ml-1">
              로그인하기
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}