// app/components/create/Step5_Greeting.tsx
'use client';

import { PenTool } from 'lucide-react';

interface Step5Props {
  formData: any;
  handleFormChange: (e: any) => void;
}

export default function Step5_Greeting({ formData, handleFormChange }: Step5Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">1</span>
          초대의 글 작성
        </h3>
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-stone-200 shadow-sm transition-all hover:shadow-md">
          
          <div className="flex justify-between items-end mb-2">
            <label className="block text-[11px] font-bold text-stone-500 ml-1">인사말 내용</label>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {formData.greetingMessage.length} / 300자
            </span>
          </div>

          <div className="relative group">
            <div className="absolute top-4 left-0 flex items-center pl-4 pointer-events-none">
              <PenTool className="w-4 h-4 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <textarea
              name="greetingMessage"
              value={formData.greetingMessage}
              onChange={handleFormChange}
              maxLength={300}
              rows={7}
              placeholder={`꽃향기와 함께 찾아온 당신과\n사랑의 언약을 맺습니다.\n\n저희 두 사람이 삶의 동반자로서 맞이하는\n첫 번째 봄에 함께 하시어 축복해 주시면\n큰 기쁨으로 영원히 간직하겠습니다.`}
              className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300 resize-none leading-relaxed"
            />
          </div>
          <ul className="text-[11px] text-stone-400 mt-3 ml-1 space-y-1">
            <li>💡 모바일 화면을 고려하여 한 줄에 12~15자 내외로 적는 것을 추천합니다.</li>
            <li>💡 엔터(줄바꿈)를 입력하면 우측 미리보기에 실시간으로 반영됩니다.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}