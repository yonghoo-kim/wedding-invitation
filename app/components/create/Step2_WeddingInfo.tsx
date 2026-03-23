// app/components/create/Step2_WeddingInfo.tsx
'use client';

import { CalendarDays, MapPin, Building2, Navigation, Train, Bus, Megaphone } from 'lucide-react';

interface Step2Props {
  formData: any;
  handleFormChange: (e: any) => void;
}

export default function Step2_WeddingInfo({ formData, handleFormChange }: Step2Props) {
  
  // 🌟 입력칸이나 배경 클릭 시 우측 미리보기 자동 스크롤
  const scrollToPreview = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* 1. 예식 일시 */}
      <section 
        onClick={() => scrollToPreview('preview-wedding')} 
        onFocus={() => scrollToPreview('preview-wedding')}
      >
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2 cursor-pointer">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">1</span>
          예식 일시
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm transition-all hover:shadow-md cursor-pointer">
          <label className="block text-xs font-bold text-stone-500 mb-2 cursor-pointer">날짜 및 시간 선택</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
              <CalendarDays className="w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            {/* 🌟 value 값을 딱 16자리(YYYY-MM-DDTHH:mm)로 자르는 처리 추가 */}
            <input
              type="datetime-local"
              name="weddingDate"
              value={formData.weddingDate ? formData.weddingDate.substring(0, 16) : ''}
              onChange={handleFormChange}
              className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all appearance-none cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 2. 예식장 정보 */}
      <section 
        onClick={() => scrollToPreview('preview-map')} 
        onFocus={() => scrollToPreview('preview-map')}
      >
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2 cursor-pointer">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">2</span>
          예식장 및 지도 정보
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5 transition-all hover:shadow-md">

          {/* 예식장 이름 */}
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2">예식장 이름</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Building2 className="w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="text"
                name="weddingLocation"
                placeholder="예: 조선 팰리스 서울 강남"
                value={formData.weddingLocation}
                onChange={handleFormChange}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* 도로명 주소 */}
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2">도로명 주소</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <MapPin className="w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="text"
                name="weddingAddress"
                placeholder="예: 서울특별시 강남구 231 테헤란로"
                value={formData.weddingAddress}
                onChange={handleFormChange}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* 위도 경도 */}
          <div className="pt-4 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-500 mb-3">지도 좌표 (선택)</label>
            <div className="flex gap-3">
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Navigation className="w-4 h-4 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="number"
                  name="weddingLat"
                  placeholder="위도"
                  value={formData.weddingLat}
                  onChange={handleFormChange}
                  className="w-full pl-9 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all"
                />
              </div>
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Navigation className="w-4 h-4 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="number"
                  name="weddingLng"
                  placeholder="경도"
                  value={formData.weddingLng}
                  onChange={handleFormChange}
                  className="w-full pl-9 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 오시는 길 및 교통수단 안내 */}
      <section 
        onClick={() => scrollToPreview('preview-map')} 
        onFocus={() => scrollToPreview('preview-map')}
      >
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2 cursor-pointer">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">3</span>
          오시는 길 및 교통수단 안내
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-5 transition-all hover:shadow-md">

          {/* 지하철 안내 */}
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2">지하철 안내</label>
            <div className="relative group">
              <div className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none">
                <Train className="w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <textarea
                name="transitSubway"
                rows={2}
                placeholder="예: 5호선 마포역 4번 출구 도보 3분"
                value={formData.transitSubway || ''}
                onChange={handleFormChange}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300 resize-none"
              />
            </div>
          </div>

          {/* 버스 안내 */}
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2">버스 안내</label>
            <div className="relative group">
              <div className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none">
                <Bus className="w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <textarea
                name="transitBus"
                rows={3}
                placeholder="예: 간선버스 160, 260, 261, 463 하차&#13;&#10;지선버스 7611, 7613 하차"
                value={formData.transitBus || ''}
                onChange={handleFormChange}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300 resize-none"
              />
            </div>
          </div>

          {/* 주차 및 기타 안내 */}
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-2">주차 및 기타 안내</label>
            <div className="relative group">
              <div className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none">
                <Megaphone className="w-5 h-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <textarea
                name="transitParking"
                rows={3}
                placeholder="예: 호텔 내 주차공간이 협소하오니,&#13;&#10;가급적 대중교통을 이용해 주시기 바랍니다."
                value={formData.transitParking || ''}
                onChange={handleFormChange}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 hover:bg-white transition-all placeholder:text-stone-300 resize-none"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}