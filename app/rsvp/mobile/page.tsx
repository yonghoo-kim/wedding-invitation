'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Lock, RefreshCw, LogOut, Users, Utensils, X, List, ChevronRight, Clock, Trash2 } from 'lucide-react';

interface RsvpData {
  id: number;
  created_at: string;
  name: string;
  side: string; // 'groom' | 'bride' | '신랑측' | '신부측'
  count: number;
  meal: string;
  privacy_consent: boolean;
}

export default function RsvpMobilePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvpList, setRsvpList] = useState<RsvpData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'groom' | 'bride'>('all');

  const [stats, setStats] = useState({
    totalGuests: 0,
    groomCount: 0,
    brideCount: 0,
    mealYes: 0,
    mealUnknown: 0,
    mealNo: 0,
  });

  // 데이터 불러오기
  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('데이터 로드 실패');
    } else {
      const list = data as RsvpData[];
      setRsvpList(list);
      calculateStats(list);
    }
    setIsLoading(false);
  };

  // 통계 계산
  const calculateStats = (data: RsvpData[]) => {
    const newStats = {
      totalGuests: 0,
      groomCount: 0,
      brideCount: 0,
      mealYes: 0,
      mealUnknown: 0,
      mealNo: 0,
    };

    data.forEach((item) => {
      const count = item.count || 1;
      newStats.totalGuests += count;

      if (item.side === 'groom' || item.side === '신랑측') newStats.groomCount += count;
      else newStats.brideCount += count;

      if (item.meal === 'yes') newStats.mealYes += count;
      else if (item.meal === 'no') newStats.mealNo += count;
      else newStats.mealUnknown += count;
    });

    setStats(newStats);
  };

  // 로그인 핸들러
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'wedding0418%$') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('비밀번호 불일치');
    }
  };

  // 전체 초기화 (기존 유지)
  const handleResetData = async () => {
    const confirmMsg = prompt("모든 데이터를 삭제하시겠습니까?\n삭제하려면 관리자 비밀번호를 입력하세요.");

    if (confirmMsg === 'wedding0418%$') {
      const doubleCheck = confirm("정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
      if (!doubleCheck) return;

      setIsLoading(true);
      const { error } = await supabase
        .from('rsvp')
        .delete()
        .neq('id', 0);

      if (error) {
        alert('삭제 실패: ' + error.message);
      } else {
        alert('모든 데이터가 초기화되었습니다.');
        fetchData();
      }
      setIsLoading(false);
    } else if (confirmMsg !== null) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // ----------------------------------------------------------------
  // [추가된 기능] 개별 아이템 삭제 핸들러 (이름 + 측 PK 기준)
  // ----------------------------------------------------------------
  const handleDeleteItem = async (item: RsvpData) => {
    const sideLabel = (item.side === 'groom' || item.side === '신랑측') ? '신랑측' : '신부측';
    
    // 삭제 확인
    const confirmed = confirm(`[${sideLabel}] "${item.name}" 님의 데이터를 삭제하시겠습니까?`);
    if (!confirmed) return;

    setIsLoading(true);

    // 요청하신 대로 'name'과 'side'를 조건으로 삭제 (Composite Key 개념)
    const { error } = await supabase
      .from('rsvp')
      .delete()
      .eq('name', item.name)
      .eq('side', item.side);

    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      // UI 즉시 반영 (다시 fetch하지 않고 로컬 필터링으로 성능 최적화)
      const updatedList = rsvpList.filter(
        (i) => !(i.name === item.name && i.side === item.side)
      );
      
      setRsvpList(updatedList);
      calculateStats(updatedList); // 통계 재계산
      alert('삭제되었습니다.');
    }
    setIsLoading(false);
  };
  // ----------------------------------------------------------------

  const openModal = (type: 'all' | 'groom' | 'bride') => {
    setFilterType(type);
    setShowModal(true);
  };

  const getFilteredList = () => {
    if (filterType === 'all') return rsvpList;
    return rsvpList.filter(item => {
      const isGroom = item.side === 'groom' || item.side === '신랑측';
      return filterType === 'groom' ? isGroom : !isGroom;
    });
  };

  const getModalTitle = () => {
    if (filterType === 'groom') return '신랑측 명단';
    if (filterType === 'bride') return '신부측 명단';
    return '전체 참석자 명단';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-neutral-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <div className="flex justify-center mb-8">
            <div className="relative p-3 bg-neutral-900 rounded-full mb-4 overflow-hidden">
              <Lock className="relative z-10 w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <style jsx>{`
                  @keyframes shimmer {
                      0% { transform: translateX(-100%) skewX(-20deg); }
                      100% { transform: translateX(200%) skewX(-20deg); }
                  }
                  .animate-shimmer {
                      animation: shimmer 2.0s infinite;
                  }
              `}</style>
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-neutral-900 mb-2">RSVP Mobile</h1>
          <p className="text-center text-neutral-400 text-sm mb-8">관리자 비밀번호를 입력하세요</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              inputMode="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-sm transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-base active:scale-[0.98] transition-transform shadow-md"
            >
              관리자 로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  const displayList = getFilteredList();

  return (
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-800 pb-safe">
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 sticky top-0 z-40 flex justify-between items-center h-14">
        <h1 className="text-lg font-bold tracking-tight text-neutral-900">웨딩 대시보드</h1>
        <div className="flex gap-2">
          <button
            onClick={handleResetData}
            className="p-2 text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <button onClick={fetchData} className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full active:bg-neutral-200 transition-colors">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full active:bg-neutral-200 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="p-4 space-y-4 pb-24">
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between h-28">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Users size={14} />
              <span className="text-[10px] font-bold uppercase">Total Guests</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-neutral-900">{stats.totalGuests}</span>
                <span className="text-xs font-medium text-neutral-500">명</span>
              </div>
              <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">Confirmed</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between h-28">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Utensils size={14} />
              <span className="text-[10px] font-bold uppercase">Meal Plan</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-emerald-600">{stats.mealYes}</span>
                <span className="text-xs font-medium text-neutral-500">명</span>
              </div>
              <span className="text-[10px] text-neutral-400">식사 예정 인원</span>
            </div>
          </div>
        </div>

        {/* 신랑/신부 비율 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Side Breakdown</span>
            <span className="text-xs font-mono text-neutral-500 font-bold">{stats.groomCount} vs {stats.brideCount}</span>
          </div>
          <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden flex mb-3">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(stats.groomCount / (stats.totalGuests || 1)) * 100}%` }}></div>
            <div className="bg-rose-400 h-full transition-all duration-500" style={{ width: `${(stats.brideCount / (stats.totalGuests || 1)) * 100}%` }}></div>
          </div>

          <div className="flex justify-between text-xs font-semibold">
            <button
              onClick={() => openModal('groom')}
              className="flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 px-2 py-1 -ml-2 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              신랑측 {stats.groomCount}명
              <ChevronRight size={12} className="text-blue-400" />
            </button>
            <button
              onClick={() => openModal('bride')}
              className="flex items-center gap-1.5 text-rose-500 hover:bg-rose-50 px-2 py-1 -mr-2 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              신부측 {stats.brideCount}명
              <ChevronRight size={12} className="text-rose-300" />
            </button>
          </div>
        </div>

        {/* 식사 상세 */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Meal Details</span>
          </div>
          <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden flex mb-3">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(stats.mealYes / (stats.totalGuests || 1)) * 100}%` }}></div>
            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${(stats.mealUnknown / (stats.totalGuests || 1)) * 100}%` }}></div>
            <div className="bg-neutral-300 h-full transition-all duration-500" style={{ width: `${(stats.mealNo / (stats.totalGuests || 1)) * 100}%` }}></div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            <div className="bg-emerald-50 p-1.5 rounded text-emerald-700 font-bold">예정 {stats.mealYes}</div>
            <div className="bg-amber-50 p-1.5 rounded text-amber-700 font-bold">미정 {stats.mealUnknown}</div>
            <div className="bg-neutral-100 p-1.5 rounded text-neutral-600 font-bold">안함 {stats.mealNo}</div>
          </div>
        </div>

        {/* 전체보기 버튼 */}
        <div className="pt-2">
          <button
            onClick={() => openModal('all')}
            className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <List size={18} /> 전체 명단 보기 ({rsvpList.length})
          </button>
        </div>
      </main>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col animate-in slide-in-from-bottom-10 duration-200">
          {/* 모달 헤더 */}
          <div className="bg-white px-4 py-3 border-b border-neutral-200 flex justify-between items-center shadow-sm shrink-0 h-14">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900">{getModalTitle()}</span>
              <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                {displayList.length}
              </span>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 -mr-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* 리스트 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-100">
            {displayList.length === 0 ? (
              <div className="text-center py-10 text-neutral-400">해당하는 명단이 없습니다.</div>
            ) : (
              displayList.map((item) => {
                const sideText = (item.side === 'groom' || item.side === '신랑측') ? '신랑측' : '신부측';
                const sideColor = sideText === '신랑측' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700';

                let mealText = '안함';
                let mealStyle = 'text-neutral-400 bg-neutral-100';

                if (item.meal === 'yes') {
                  mealText = '식사함';
                  mealStyle = 'text-emerald-700 bg-emerald-50 border border-emerald-100';
                } else if (item.meal === '미정' || item.meal === 'unknown') {
                  mealText = '미정';
                  mealStyle = 'text-amber-700 bg-amber-50 border border-amber-100';
                }

                return (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-neutral-900">{item.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${sideColor}`}>
                          {sideText}
                        </span>
                      </div>
                      
                      {/* [수정됨] 식사 뱃지와 삭제 버튼을 감싸는 div */}
                      <div className="flex items-center gap-2">
                        <div className={`text-xs px-2 py-1 rounded font-bold ${mealStyle}`}>
                          {mealText}
                        </div>
                        
                        {/* [추가됨] 개별 삭제 버튼 */}
                        <button 
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 -mr-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-neutral-50 pt-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock size={10} />
                        {new Date(item.created_at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-neutral-500">인원</span>
                        <span className="text-sm font-bold text-neutral-800 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                          {item.count}명
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {/* 하단 여백 */}
            <div className="h-8"></div>
          </div>
        </div>
      )}

    </div>
  );
}