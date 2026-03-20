// app/components/create/Step1_BasicInfo.tsx
import { Link2, ClipboardCheck } from 'lucide-react';

export default function Step1_BasicInfo({ formData, handleFormChange }: any) {
  const inputBase = "w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-[14px] text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-all";
  const labelBase = "block text-[13px] font-bold text-stone-600 mb-2";
  const inputWrapper = "relative flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-stone-800 transition-all shadow-sm";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">기본 정보 설정</h2>
        <p className="text-sm text-stone-500 mb-6 pb-6 border-b border-stone-100">가장 중요한 주소와 이름을 설정합니다.</p>
      </div>

      <div>
        <label className={labelBase}>청첩장 고유 링크 (URL)</label>
        <div className={inputWrapper}>
          <Link2 className="ml-4 text-stone-400 w-5 h-5" />
          <span className="pl-3 pr-1 py-3.5 text-stone-400 text-sm font-medium select-none hidden sm:block">our-wedding.com/</span>
          <input type="text" name="urlSlug" value={formData.urlSlug} onChange={handleFormChange} placeholder="hong-park" className="flex-1 px-2 py-3.5 bg-transparent text-[15px] font-bold text-stone-800 outline-none placeholder:font-normal" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100/50">
          <label className="block text-[12px] font-bold text-blue-800 mb-3">신랑 정보</label>
          <div className="flex gap-2">
            <input type="text" name="groomLastName" placeholder="성" value={formData.groomLastName} onChange={handleFormChange} className={`${inputBase} w-1/3 text-center`} />
            <input type="text" name="groomFirstName" placeholder="이름" value={formData.groomFirstName} onChange={handleFormChange} className={`${inputBase} w-2/3`} />
          </div>
        </div>
        <div className="bg-pink-50/50 p-5 rounded-xl border border-pink-100/50">
          <label className="block text-[12px] font-bold text-pink-800 mb-3">신부 정보</label>
          <div className="flex gap-2">
            <input type="text" name="brideLastName" placeholder="성" value={formData.brideLastName} onChange={handleFormChange} className={`${inputBase} w-1/3 text-center`} />
            <input type="text" name="brideFirstName" placeholder="이름" value={formData.brideFirstName} onChange={handleFormChange} className={`${inputBase} w-2/3`} />
          </div>
        </div>
      </div>

      {/* 🌟 RSVP 사용 여부 토글 스위치 추가 */}
      <div className="pt-2">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-stone-800 flex items-center gap-2 cursor-pointer" htmlFor="useRsvp">
              <ClipboardCheck className="w-4 h-4 text-stone-500" />
              참석 의사 (RSVP) 기능 사용
            </label>
            <p className="text-[12px] text-stone-500 font-medium ml-6">
              하객들의 참석 여부와 식사 인원을 취합받습니다.
            </p>
          </div>
          
          {/* 토글 스위치 UI */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              id="useRsvp"
              name="useRsvp"
              checked={formData.useRsvp}
              onChange={handleFormChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-800"></div>
          </label>
        </div>
      </div>

    </div>
  );
}