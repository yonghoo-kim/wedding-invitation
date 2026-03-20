// app/components/Section6_Gift.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, MessageCircle, Loader2, Send, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Gowun_Batang, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

// 🌟 1. 방금 만든 서버 액션을 불러옵니다. (Supabase 클라이언트 제거)
import { getGuestbooks, addGuestbook } from '@/app/actions/guestbook';

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const englishFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' });

// 🌟 2. Props 타입과 계좌 정보 타입 정의
interface ParentAccount { name: string; bank: string; account: string; }
interface AccountInfo { bank: string; account: string; father?: ParentAccount; mother?: ParentAccount; }

interface Section6Props {
  invitationId: string;
  groomLastName: string;
  groomFirstName: string;
  brideLastName: string;
  brideFirstName: string;
  groomAccount: AccountInfo;
  brideAccount: AccountInfo;
}

// Prisma에서 넘어오는 방명록 타입
type GuestMessage = {
  id: string;
  guestName: string;
  message: string;
  createdAt: Date;
};

// 🌟 3. JSON 데이터를 모달에 띄우기 좋은 배열로 변환하는 함수
const createAccountList = (lastName: string, firstName: string, info: AccountInfo) => {
  const list = [];
  // 본인 계좌
  if (info?.bank && info?.account) {
    list.push({ bank: info.bank, name: lastName + firstName, account: info.account, copyText: info.account.replace(/-/g, '') });
  }
  // 아버지 계좌
  if (info?.father) {
    list.push({ bank: info.father.bank, name: info.father.name, account: info.father.account, copyText: info.father.account.replace(/-/g, '') });
  }
  // 어머니 계좌
  if (info?.mother) {
    list.push({ bank: info.mother.bank, name: info.mother.name, account: info.mother.account, copyText: info.mother.account.replace(/-/g, '') });
  }
  return list;
};

// 🌟 4. 컴포넌트 시작
const Section6_Gift = ({
  invitationId,
  groomLastName, groomFirstName,
  brideLastName, brideFirstName,
  groomAccount, brideAccount
}: Section6Props) => {
  const [activeModal, setActiveModal] = useState<'groom' | 'bride' | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [guestbook, setGuestbook] = useState<GuestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 변환 함수를 통해 각각의 배열 생성
  const groomAccounts = createAccountList(groomLastName, groomFirstName, groomAccount);
  const brideAccounts = createAccountList(brideLastName, brideFirstName, brideAccount);

  // 🌟 5. 방명록 조회 로직 (서버 액션 사용)
  const fetchMessages = async () => {
    setIsLoading(true);
    const result = await getGuestbooks(invitationId);
    if (result.success && result.data) {
      setGuestbook(result.data as unknown as GuestMessage[]);
    } else {
      console.error(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [invitationId]);

  // 🌟 6. 방명록 저장 로직 (서버 액션 사용)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert('이름과 메시지를 입력해주세요.');
      return;
    }
    
    const result = await addGuestbook({ invitationId, name, message });
    
    if (!result.success) { 
        alert('저장에 실패했습니다.'); 
    } else { 
        setName(''); 
        setMessage(''); 
        await fetchMessages(); 
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  };

  const copy = (num: string) => {
    navigator.clipboard.writeText(num);
    alert('계좌번호가 복사되었습니다.');
  };

  const scrollToNext = () => {
    const currentSection = document.querySelector('.gift-section');
    if (currentSection?.nextElementSibling) {
      currentSection.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={`gift-section snap-section relative w-full min-h-[100dvh] flex items-center justify-center p-4 overflow-hidden ${koreanFont.className}`}>
      {/* 메인 콘텐츠 카드 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[340px] max-h-[85vh] bg-white/70 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/50 rounded-sm p-6 flex flex-col"
      >
        {/* 헤더 */}
        <div className="shrink-0 text-center mb-6">
            <p className={`${englishFont.className} text-amber-700/80 text-[10px] font-bold tracking-[0.3em] mb-2 uppercase`}>
                Account & Message
            </p>
            <h2 className="text-xl font-bold text-stone-800 tracking-widest mb-1">마음 전하는 곳</h2>
        </div>

        {/* 계좌 확인 버튼 (2개) */}
        <div className="shrink-0 flex flex-col gap-2 mb-6">
            <button 
                onClick={() => setActiveModal('groom')}
                className="w-full py-3 px-4 bg-white/80 border border-stone-200 rounded-sm shadow-sm flex items-center justify-between hover:bg-stone-50 transition-colors group"
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs text-stone-400 mb-0.5">Groom's Side</span>
                    <span className="text-sm font-bold text-stone-800">신랑측 마음 전하기</span>
                </div>
                <ChevronRight size={16} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={() => setActiveModal('bride')}
                className="w-full py-3 px-4 bg-white/80 border border-stone-200 rounded-sm shadow-sm flex items-center justify-between hover:bg-amber-50/50 transition-colors group"
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs text-stone-400 mb-0.5">Bride's Side</span>
                    <span className="text-sm font-bold text-stone-800">신부측 마음 전하기</span>
                </div>
                <ChevronRight size={16} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* 방명록 영역 */}
        <div className="flex-1 flex flex-col min-h-0 border-t border-stone-300/50 pt-4">
            <div className="flex items-center gap-1 mb-2 px-1 shrink-0">
                <MessageCircle size={14} className="text-stone-500" />
                <h3 className="text-xs font-bold text-stone-700">축하 메시지 <span className={`${englishFont.className} text-amber-700 ml-0.5 font-bold`}>{guestbook.length}</span></h3>
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className="flex gap-1.5 mb-3 shrink-0 w-full">
                <input 
                    type="text" 
                    placeholder="이름" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-[3.5rem] bg-white border border-stone-200 rounded-sm px-1 py-2 text-xs text-center text-stone-800 focus:outline-none focus:border-stone-400 shadow-sm placeholder:text-stone-300 font-medium" 
                />
                <input 
                    type="text" 
                    placeholder="축하 메시지" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    className="flex-1 min-w-0 bg-white border border-stone-200 rounded-sm px-2 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-400 shadow-sm placeholder:text-stone-300 font-medium" 
                />
                <button type="submit" className="bg-stone-800 text-white px-2.5 rounded-sm text-xs hover:bg-stone-700 transition-colors shadow-sm flex items-center justify-center shrink-0">
                    <Send size={12} />
                </button>
            </form>

            {/* 메시지 리스트 */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pr-1 pb-2">
                {isLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="animate-spin text-stone-300 w-5 h-5" /></div>
                ) : guestbook.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 py-6">
                        <p className="text-stone-400 text-xs">작성된 메시지가 없습니다.</p>
                        <p className="text-stone-300 text-[10px] mt-1">따뜻한 마음을 남겨주세요!</p>
                    </div>
                ) : (
                    guestbook.map((msg) => (
                        <div key={msg.id} className="bg-white/70 rounded-sm p-2.5 border border-stone-100 shadow-sm animate-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-stone-800 text-xs truncate max-w-[80px]">{msg.guestName}</span>
                                <span className={`${koreanFont.className} text-[9px] text-stone-400 font-light whitespace-nowrap`}>
                                    {/* 🌟 7. DB의 Date 객체를 포맷팅 */}
                                    {new Date(msg.createdAt).toLocaleDateString('ko-KR').slice(2)}
                                </span>
                            </div>
                            <p className="text-stone-600 text-xs break-words leading-relaxed font-light">{msg.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
      </motion.div>

      {/* 계좌번호 모달 팝업 */}
      <AnimatePresence>
        {activeModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-sm rounded-sm shadow-2xl overflow-hidden"
                >
                    <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-center">
                        <h3 className="text-stone-800 font-bold text-sm tracking-wide">
                            {activeModal === 'groom' ? '신랑측 계좌번호' : '신부측 계좌번호'}
                        </h3>
                        <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-800 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        {(activeModal === 'groom' ? groomAccounts : brideAccounts).map((acc, idx) => (
                            <div key={idx} className="flex flex-col bg-stone-50/50 border border-stone-100 p-3 rounded-sm hover:border-stone-200 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-stone-500 font-medium">{acc.bank}</span>
                                        <div className="w-[1px] h-2 bg-stone-300"></div>
                                        <span className="text-xs text-stone-800 font-bold">{acc.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => copy(acc.copyText)} 
                                        className="text-[10px] bg-white border border-stone-200 text-stone-600 px-2 py-1 rounded-sm hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        <Copy size={10} /> 복사
                                    </button>
                                </div>
                                <p className={`${koreanFont.className} text-stone-800 text-sm font-bold tracking-wide mt-1`}>
                                    {acc.account}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-stone-50 p-3 text-center border-t border-stone-100">
                        <button onClick={() => setActiveModal(null)} className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-2">
                            닫기
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* 스크롤 유도 버튼 */}
      <motion.button 
          onClick={scrollToNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }} 
          transition={{ opacity: { delay: 1, duration: 1 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
          className="absolute bottom-8 z-30 flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-100 transition-opacity"
      >
          <span className="text-[11px] text-stone-600 font-bold tracking-widest bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-white">
            마지막 인사
          </span>
          <div className="w-8 h-8 rounded-full bg-stone-800/90 text-white flex items-center justify-center shadow-md">
            <ChevronDown size={18} />
          </div>
      </motion.button>
    </section>
  );
};

export default Section6_Gift;