// app/components/Section_RSVP.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Check, RefreshCw } from 'lucide-react';
import { Gowun_Batang } from 'next/font/google';
import { themeColors, SeasonTheme } from '@/lib/theme';

// 🌟 1. 방금 만든 서버 액션 함수를 불러옵니다.
import { submitRsvp } from '@/app/actions/rsvp';

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

// 🌟 2. 부모에게서 받을 Props 타입 지정 (테마 추가)
interface RsvpProps {
  invitationId: string;
  theme?: SeasonTheme;
}

const Section_RSVP = ({ invitationId, theme }: RsvpProps) => {
  console.log(theme);
  const [formData, setFormData] = useState({
    side: '신랑측',
    name: '',
    count: 1,
    meal: 'yes',
    privacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 현재 테마 색상 가져오기
  const currentTheme = themeColors[theme as keyof typeof themeColors] || themeColors.spring;
  // 제출 버튼 활성화 조건 (이름 입력 & 개인정보 동의)
  const isFormReady = formData.name.trim() !== '' && formData.privacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormReady) return; // 폼이 준비되지 않으면 실행 안 함

    setIsSubmitting(true);

    // 🌟 3. Supabase 직접 호출 대신, 안전한 Server Action 호출!
    const result = await submitRsvp({
      invitationId,
      side: formData.side,
      name: formData.name,
      count: formData.count,
      meal: formData.meal,
    });

    setIsSubmitting(false);

    if (!result.success) {
      alert('전송에 실패했습니다. 다시 시도해주세요.');
    } else {
      setIsSubmitted(true);

      // 로컬 스토리지 저장 후 'rsvp-updated' 이벤트 발생
      localStorage.setItem('rsvp_name', formData.name);
      window.dispatchEvent(new Event('rsvp-updated'));
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const btnBase = "flex-1 py-3 text-xs rounded-sm border transition-all duration-200 flex items-center justify-center gap-1.5";
  
  // 🎨 모든 Active 버튼을 테마 색상으로 통일!
  const activeBtn = `${currentTheme.primary} text-white font-bold shadow-md`;
  const inactiveBtn = "bg-white text-stone-400 border-stone-200 hover:bg-stone-50";

  return (
    <section className={`snap-section relative w-full min-h-[100dvh] flex items-center justify-center p-6 overflow-hidden wedding-bg ${koreanFont.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/60 rounded-sm p-8"
      >
        {/* 상단 텍스트 영역 */}
        <div className="text-center mb-8">
          <p className={`${koreanFont.className} ${currentTheme.textMuted} text-[10px] font-bold tracking-[0.3em] mb-2 uppercase`}>
            RSVP
          </p>
          <h2 className="text-xl font-bold text-stone-800 tracking-wide">참석 의사 전달</h2>
          <p className="text-stone-500 text-[11px] mt-2 tracking-tight opacity-80 leading-relaxed">
            예식과 식사가 동시에 진행되어<br />
            귀한 걸음 부족함 없이 모실 수 있도록<br />
            참석 정보를 알려주시면 감사하겠습니다.
          </p>
        </div>

        <AnimatePresence mode='wait'>
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <CheckCircle2 className={`w-12 h-12 mb-4 ${currentTheme.icon}`} />
              <h3 className="text-lg font-bold text-stone-800 mb-2">전달되었습니다!</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-8">
                소중한 시간 내어주셔서 감사합니다.<br />
                정보를 수정하시려면 아래 버튼을 눌러주세요.
              </p>

              <button
                onClick={handleEdit}
                className="text-xs text-stone-400 border-b border-stone-300 pb-0.5 hover:text-stone-800 hover:border-stone-800 transition-colors flex items-center gap-1"
              >
                <RefreshCw size={10} />
                정보 수정하기
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* 구분 */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-500 ml-1">구분</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({ ...formData, side: '신랑측' })} className={`${btnBase} ${formData.side === '신랑측' ? activeBtn : inactiveBtn}`}>
                    신랑측
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, side: '신부측' })} className={`${btnBase} ${formData.side === '신부측' ? activeBtn : inactiveBtn}`}>
                    신부측
                  </button>
                </div>
              </div>

              {/* 성함 / 인원 */}
              <div className="grid grid-cols-[1.2fr_1fr] gap-3">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-500 ml-1">성함</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="성함"
                    className="w-full bg-white border border-stone-200 rounded-sm px-3 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-500 transition-colors text-center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-500 ml-1">인원 (본인포함)</label>
                  <div className="flex items-center justify-between bg-white border border-stone-200 rounded-sm p-1 h-[46px]">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, count: Math.max(1, prev.count - 1) }))} className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-50 rounded-sm transition-colors text-lg">-</button>
                    <span className="text-sm font-bold text-stone-800 w-6 text-center">{formData.count}</span>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, count: Math.min(10, prev.count + 1) }))} className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-50 rounded-sm transition-colors text-lg">+</button>
                  </div>
                </div>
              </div>

              {/* 식사 여부 */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-500 ml-1">식사 여부</label>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setFormData({ ...formData, meal: 'yes' })} className={`${btnBase} ${formData.meal === 'yes' ? activeBtn : inactiveBtn}`}>
                    식사 예정
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, meal: '미정' })} className={`${btnBase} ${formData.meal === '미정' ? activeBtn : inactiveBtn}`}>
                    미정
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, meal: 'no' })} className={`${btnBase} ${formData.meal === 'no' ? activeBtn : inactiveBtn}`}>
                    안함
                  </button>
                </div>
              </div>

              {/* 동의 및 제출 */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${formData.privacy ? currentTheme.primary : 'bg-white border-stone-300'}`}>
                    {formData.privacy && <Check size={12} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.privacy}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                  />
                  <span className="text-[10px] text-stone-500 group-hover:text-stone-700 transition-colors">
                    개인정보 수집 및 이용에 동의합니다.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isFormReady || isSubmitting}
                className={`w-full py-4 rounded-sm text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-2
                  ${isFormReady
                    ? `${currentTheme.primary} text-white`
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (isFormReady ? '참석 의사 전달하기' : '정보를 입력해주세요')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Section_RSVP;