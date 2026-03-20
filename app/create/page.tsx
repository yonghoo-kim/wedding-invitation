// app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowLeft, Check, Smartphone } from 'lucide-react';
import { Gowun_Batang } from 'next/font/google';
import { createNewInvitation } from '@/app/actions/createInvitation';

// 입력 폼 컴포넌트
import Step1_BasicInfo from '@/app/components/create/Step1_BasicInfo';
import Step2_WeddingInfo from '@/app/components/create/Step2_WeddingInfo';
import Step3_MediaTheme from '@/app/components/create/Step3_MediaTheme';
import Step4_Greeting from '@/app/components/create/Step4_Greeting';
import Step5_AccountInfo from '@/app/components/create/Step5_AccountInfo';

// 미리보기를 위한 실제 청첩장 컴포넌트
import SeasonalEffect from '@/app/components/effect/SeasonalEffect';
import BackgroundMusic from '@/app/components/BackgroundMusic';
import FixedBackground from '@/app/components/FixedBackground';
import Section1_Main from '@/app/components/Section1_Main';
import Section2_Quote from '@/app/components/Section2_Quote';
import Section3_Calendar from '@/app/components/Section3_Calendar';
import Section_RSVP from '@/app/components/Section_RSVP';
import Section4_Gallery from '@/app/components/Section4_Gallery';
import Section5_Map from '@/app/components/Section5_Map';
import Section6_Gift from '@/app/components/Section6_Gift';
import Section7_Closing from '@/app/components/Section7_Closing';

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

const STEPS = [
  { id: 'basic', label: '기본 정보' },
  { id: 'greeting', label: '초대의 글' },
  { id: 'wedding', label: '예식장 & 지도' },
  { id: 'media', label: '테마 & 미디어' },
  { id: 'account', label: '마음 전하실 곳' },
];

export default function CreateInvitationPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(STEPS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    urlSlug: '', theme: 'spring', bgmFilename: '', mainImage: '', closingImage: '',
    greetingMessage: '',
    groomLastName: '', groomFirstName: '', brideLastName: '', brideFirstName: '',
    weddingDate: '', weddingLocation: '', weddingAddress: '', weddingLat: '', weddingLng: '',
    galleryImages: [],
  });

  const [groomAcc, setGroomAcc] = useState({ bank: '', account: '', fatherName: '', fatherBank: '', fatherAccount: '', motherName: '', motherBank: '', motherAccount: '' });
  const [brideAcc, setBrideAcc] = useState({ bank: '', account: '', fatherName: '', fatherBank: '', fatherAccount: '', motherName: '', motherBank: '', motherAccount: '' });

  // 탭 변경 시 자동 스크롤
  useEffect(() => {
    const sectionElement = document.getElementById(`preview-${activeTab}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  const handleFormChange = (e: any) => {
    if (e.target.name === 'urlSlug') {
      setFormData({ ...formData, urlSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const handleGroomAccChange = (e: any) => setGroomAcc({ ...groomAcc, [e.target.name]: e.target.value });
  const handleBrideAccChange = (e: any) => setBrideAcc({ ...brideAcc, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!formData.urlSlug) return alert('기본 정보 탭에서 초대장 링크(URL)를 입력해주세요.');
    if (!formData.groomFirstName || !formData.brideFirstName) return alert('기본 정보 탭에서 신랑/신부 이름을 입력해주세요.');
    if (!formData.weddingDate) return alert('예식장 탭에서 예식 일시를 지정해주세요.');
    if (!formData.weddingLocation) return alert('예식장 탭에서 예식장 이름을 입력해주세요.');

    setIsSubmitting(true);

    const finalData = {
      ...formData,
      weddingDate: new Date(formData.weddingDate),
      groomAccountInfo: { bank: groomAcc.bank, account: groomAcc.account, father: { name: groomAcc.fatherName, bank: groomAcc.fatherBank, account: groomAcc.fatherAccount }, mother: { name: groomAcc.motherName, bank: groomAcc.motherBank, account: groomAcc.motherAccount } },
      brideAccountInfo: { bank: brideAcc.bank, account: brideAcc.account, father: { name: brideAcc.fatherName, bank: brideAcc.fatherBank, account: brideAcc.fatherAccount }, mother: { name: brideAcc.motherName, bank: brideAcc.motherBank, account: brideAcc.motherAccount } }
    };

    const result = await createNewInvitation(finalData);
    setIsSubmitting(false);

    if (result.success) {
      alert('성공적으로 생성되었습니다!');
      router.push(`/${result.slug}`);
    } else {
      alert(result.error || '생성에 실패했습니다.');
    }
  };

  const previewGroomLast = formData.groomLastName || '김';
  const previewGroomFirst = formData.groomFirstName || '사무엘';
  const previewBrideLast = formData.brideLastName || '이';
  const previewBrideFirst = formData.brideFirstName || '에스더';
  const previewDate = formData.weddingDate ? new Date(formData.weddingDate) : new Date('2026-04-18T12:30:00+09:00');
  const previewLocation = formData.weddingLocation || '조선 팰리스 서울 강남';
  const previewAddress = formData.weddingAddress || '서울특별시 강남구 231 테헤란로';
  const previewLat = formData.weddingLat ? parseFloat(formData.weddingLat) : 37.502998;
  const previewLng = formData.weddingLng ? parseFloat(formData.weddingLng) : 127.041346;
  const previewTheme = formData.theme || 'spring';
  
  const previewGroomAccount = {
    bank: groomAcc.bank || '카카오뱅크', account: groomAcc.account || '3333-01-1234567',
    father: { name: groomAcc.fatherName || '김아버지', bank: groomAcc.fatherBank || '국민은행', account: groomAcc.fatherAccount || '123-4567-890' },
    mother: { name: groomAcc.motherName || '강어머니', bank: groomAcc.motherBank || '신한은행', account: groomAcc.motherAccount || '098-7654-321' }
  };
  
  const previewBrideAccount = {
    bank: brideAcc.bank || '토스뱅크', account: brideAcc.account || '1000-1234-5678',
    father: { name: brideAcc.fatherName || '이아버지', bank: brideAcc.fatherBank || '우리은행', account: brideAcc.fatherAccount || '111-222-333333' },
    mother: { name: brideAcc.motherName || '최어머니', bank: brideAcc.motherBank || '기업은행', account: brideAcc.motherAccount || '444-555-666666' }
  };

  const previewGallery = formData.galleryImages && formData.galleryImages.length > 0 
    ? formData.galleryImages 
    : ['/images/wedding/section1.png'];

  return (
    <div className="absolute inset-0 w-full h-[100dvh] overflow-hidden bg-[#FDFCFB] font-sans text-stone-800 flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 h-14 px-4 md:px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] font-bold text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 뒤로가기
          </button>
          <div className="hidden md:block w-px h-4 bg-stone-300"></div>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[13px] font-bold text-stone-700">새 청첩장 만들기</span>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 text-white text-[13px] font-bold rounded-md hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50">
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          {isSubmitting ? '생성 중...' : '최종 생성 완료'}
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1500px] mx-auto min-h-0 relative">
        <aside className="w-full md:w-48 lg:w-52 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50/50 shrink-0 overflow-y-auto custom-scrollbar">
          <div className="flex flex-row md:flex-col p-2 md:p-4 gap-1">
            <p className="hidden md:block text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-2">Setup Menu</p>
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`flex-shrink-0 text-left px-3.5 py-2 md:py-2.5 rounded-md text-[13px] font-bold transition-all ${
                  activeTab === step.id ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60' : 'text-stone-500 hover:bg-stone-100/50 hover:text-stone-800 border border-transparent'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-5 md:p-8 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-2xl mx-auto pb-20">
            <h2 className={`${koreanFont.className} text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100`}>
              {STEPS.find(s => s.id === activeTab)?.label}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'basic' && <Step1_BasicInfo formData={formData} handleFormChange={handleFormChange} />}
                {activeTab === 'greeting' && <Step4_Greeting formData={formData} handleFormChange={handleFormChange} />}
                {activeTab === 'wedding' && <Step2_WeddingInfo formData={formData} handleFormChange={handleFormChange} />}
                {activeTab === 'media' && <Step3_MediaTheme formData={formData} handleFormChange={handleFormChange} setFormData={setFormData} />}
                {activeTab === 'account' && <Step5_AccountInfo groomAcc={groomAcc} brideAcc={brideAcc} handleGroomAccChange={handleGroomAccChange} handleBrideAccChange={handleBrideAccChange} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <aside className="hidden lg:flex w-[320px] xl:w-[360px] bg-[#F4F4F5]/50 border-l border-stone-200 items-center justify-center shrink-0 h-full relative">
          <div className="flex flex-col items-center gap-3 w-full justify-center">
            
            <div className="flex items-center gap-1.5 text-stone-600 font-bold text-[12px] bg-white px-4 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-stone-100">
              <Smartphone className="w-3.5 h-3.5" /> iPhone Pro 미리보기
            </div>

            <div className="w-[272px] h-[548px] bg-white rounded-[38px] border-[10px] border-stone-900 shadow-xl relative overflow-hidden ring-1 ring-stone-200/50">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-900 rounded-full z-[9999]"></div>

              <div className="absolute top-0 left-0 w-[420px] h-[880px] origin-top-left scale-[0.6] bg-stone-50 relative">
                
                <SeasonalEffect theme={previewTheme} key={`effect-${previewTheme}`} />
                <FixedBackground theme={previewTheme} key={`bg-${previewTheme}`} />

                <div className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory custom-scrollbar preview-scroll">
                  <style>{`.preview-scroll section { height: 880px !important; min-height: 880px !important; scroll-snap-align: start; }`}</style>
                  
                  <BackgroundMusic bgm={formData.bgmFilename} />

                  <div id="preview-basic">
                    <Section1_Main 
                      groomLastName={previewGroomLast}
                      groomFirstName={previewGroomFirst}
                      brideLastName={previewBrideLast}
                      brideFirstName={previewBrideFirst}
                      mainImage={formData.mainImage}
                    />
                  </div>

                  <div id="preview-greeting">
                    <Section2_Quote 
                      greetingMessage={formData.greetingMessage}
                      groomFirstName={previewGroomFirst}
                      brideFirstName={previewBrideFirst}
                      groomFatherName={previewGroomAccount.father.name}
                      groomMotherName={previewGroomAccount.mother.name}
                      brideFatherName={previewBrideAccount.father.name}
                      brideMotherName={previewBrideAccount.mother.name}
                    />
                  </div>

                  {/* 🌟 preview-wedding (달력)과 preview-map (지도) 완벽 분리! */}
                  <div id="preview-wedding">
                    <Section3_Calendar weddingDate={previewDate} />
                    <Section_RSVP invitationId="preview-only" />
                  </div>
                  
                  <div id="preview-map">
                    <Section5_Map 
                      locationName={previewLocation}
                      address={previewAddress}
                      lat={previewLat}
                      lng={previewLng}
                    />
                  </div>
                  
                  <div id="preview-media">
                    <Section4_Gallery images={previewGallery} />
                  </div>
                  
                  <div id="preview-account">
                    <Section6_Gift 
                      invitationId="preview-only"
                      groomLastName={previewGroomLast}
                      groomFirstName={previewGroomFirst}
                      brideLastName={previewBrideLast}
                      brideFirstName={previewBrideFirst}
                      groomAccount={previewGroomAccount as any}
                      brideAccount={previewBrideAccount as any}
                    />
                    <Section7_Closing 
                      closingImage={formData.closingImage || '/images/wedding/closing.png'}
                      weddingDate={previewDate}
                    />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}