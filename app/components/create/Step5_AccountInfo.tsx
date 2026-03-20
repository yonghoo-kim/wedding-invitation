// app/components/create/Step4_AccountInfo.tsx
'use client';

interface Step4Props {
  groomAcc: any;
  brideAcc: any;
  handleGroomAccChange: (e: any) => void;
  handleBrideAccChange: (e: any) => void;
}

// 🌟 대한민국 모든 주요 은행 및 인터넷 뱅크 리스트
const BANKS = [
  "은행 선택", 
  "농협", "국민", "신한", "우리", "기업", "하나", "새마을", 
  "카카오뱅크", "토스뱅크", "케이뱅크", 
  "우체국", "SC제일", "씨티", "수협", "신협", 
  "부산", "대구", "광주", "전북", "경남", "제주", "저축은행", "산림조합"
];

export default function Step4_AccountInfo({ groomAcc, brideAcc, handleGroomAccChange, handleBrideAccChange }: Step4Props) {
  // 🌟 공통 스타일 (패딩을 살짝 줄여서 좁은 모바일 화면에서도 텍스트가 안 잘리도록 최적화)
  const baseStyle = "py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* 🌟 1. 신랑측 계좌 */}
      <section>
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">신랑</span>
          신랑측 마음 전하실 곳
        </h3>
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 transition-all hover:shadow-md">
          
          {/* 신랑 본인 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 ml-1">신랑 본인</label>
            <div className="flex gap-2">
              {/* 🌟 은행 선택 (Select) */}
              <select name="bank" value={groomAcc.bank} onChange={handleGroomAccChange} className={`${baseStyle} w-[100px] px-2 shrink-0 cursor-pointer`}>
                {BANKS.map(bank => (
                  <option key={bank} value={bank === "은행 선택" ? "" : bank} disabled={bank === "은행 선택"}>
                    {bank}
                  </option>
                ))}
              </select>
              {/* 계좌번호 (남는 공간 전부 차지) */}
              <input type="text" name="account" value={groomAcc.account} onChange={handleGroomAccChange} placeholder="계좌번호 (- 제외 입력)" className={`${baseStyle} px-3 flex-1`} />
            </div>
          </div>

          {/* 신랑 아버지 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 ml-1">혼주 (아버지)</label>
            <div className="flex gap-2">
              {/* 🌟 이름 (최대 4글자, 초소형 너비) */}
              <input type="text" name="fatherName" maxLength={4} value={groomAcc.fatherName} onChange={handleGroomAccChange} placeholder="성함" className={`${baseStyle} w-[68px] px-1 text-center shrink-0`} />
              <select name="fatherBank" value={groomAcc.fatherBank} onChange={handleGroomAccChange} className={`${baseStyle} w-[96px] px-1 shrink-0 cursor-pointer`}>
                {BANKS.map(bank => <option key={bank} value={bank === "은행 선택" ? "" : bank} disabled={bank === "은행 선택"}>{bank}</option>)}
              </select>
              <input type="text" name="fatherAccount" value={groomAcc.fatherAccount} onChange={handleGroomAccChange} placeholder="계좌번호" className={`${baseStyle} px-3 flex-1`} />
            </div>
          </div>

          {/* 신랑 어머니 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 ml-1">혼주 (어머니)</label>
            <div className="flex gap-2">
              <input type="text" name="motherName" maxLength={4} value={groomAcc.motherName} onChange={handleGroomAccChange} placeholder="성함" className={`${baseStyle} w-[68px] px-1 text-center shrink-0`} />
              <select name="motherBank" value={groomAcc.motherBank} onChange={handleGroomAccChange} className={`${baseStyle} w-[96px] px-1 shrink-0 cursor-pointer`}>
                {BANKS.map(bank => <option key={bank} value={bank === "은행 선택" ? "" : bank} disabled={bank === "은행 선택"}>{bank}</option>)}
              </select>
              <input type="text" name="motherAccount" value={groomAcc.motherAccount} onChange={handleGroomAccChange} placeholder="계좌번호" className={`${baseStyle} px-3 flex-1`} />
            </div>
          </div>

        </div>
      </section>

      {/* 🌟 2. 신부측 계좌 */}
      <section>
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-[10px]">신부</span>
          신부측 마음 전하실 곳
        </h3>
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 transition-all hover:shadow-md">
          
          {/* 신부 본인 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 ml-1">신부 본인</label>
            <div className="flex gap-2">
              <select name="bank" value={brideAcc.bank} onChange={handleBrideAccChange} className={`${baseStyle} w-[100px] px-2 shrink-0 cursor-pointer`}>
                {BANKS.map(bank => <option key={bank} value={bank === "은행 선택" ? "" : bank} disabled={bank === "은행 선택"}>{bank}</option>)}
              </select>
              <input type="text" name="account" value={brideAcc.account} onChange={handleBrideAccChange} placeholder="계좌번호 (- 제외 입력)" className={`${baseStyle} px-3 flex-1`} />
            </div>
          </div>

          {/* 신부 아버지 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 ml-1">혼주 (아버지)</label>
            <div className="flex gap-2">
              <input type="text" name="fatherName" maxLength={4} value={brideAcc.fatherName} onChange={handleBrideAccChange} placeholder="성함" className={`${baseStyle} w-[68px] px-1 text-center shrink-0`} />
              <select name="fatherBank" value={brideAcc.fatherBank} onChange={handleBrideAccChange} className={`${baseStyle} w-[96px] px-1 shrink-0 cursor-pointer`}>
                {BANKS.map(bank => <option key={bank} value={bank === "은행 선택" ? "" : bank} disabled={bank === "은행 선택"}>{bank}</option>)}
              </select>
              <input type="text" name="fatherAccount" value={brideAcc.fatherAccount} onChange={handleBrideAccChange} placeholder="계좌번호" className={`${baseStyle} px-3 flex-1`} />
            </div>
          </div>

          {/* 신부 어머니 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 ml-1">혼주 (어머니)</label>
            <div className="flex gap-2">
              <input type="text" name="motherName" maxLength={4} value={brideAcc.motherName} onChange={handleBrideAccChange} placeholder="성함" className={`${baseStyle} w-[68px] px-1 text-center shrink-0`} />
              <select name="motherBank" value={brideAcc.motherBank} onChange={handleBrideAccChange} className={`${baseStyle} w-[96px] px-1 shrink-0 cursor-pointer`}>
                {BANKS.map(bank => <option key={bank} value={bank === "은행 선택" ? "" : bank} disabled={bank === "은행 선택"}>{bank}</option>)}
              </select>
              <input type="text" name="motherAccount" value={brideAcc.motherAccount} onChange={handleBrideAccChange} placeholder="계좌번호" className={`${baseStyle} px-3 flex-1`} />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}