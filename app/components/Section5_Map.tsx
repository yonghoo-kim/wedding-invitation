// app/components/Section5_Map.tsx
'use client';

import { motion } from 'framer-motion';
import { MapPin, Train, Bus, Megaphone } from 'lucide-react';
import { Gowun_Batang, Playfair_Display } from 'next/font/google';
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

// 🌟 1. 공통 테마 불러오기
import { themeColors, SeasonTheme } from '@/lib/theme';

// 🌟 2. Props에 대중교통 정보와 테마 추가
interface Section5Props {
  locationName: string;
  address: string;
  lat: number | null;
  lng: number | null;
  transitSubway?: string;  // 지하철 정보
  transitBus?: string;     // 버스 정보
  transitParking?: string; // 주차/안내 정보
  theme?: SeasonTheme;     // 테마 컬러
}

const koreanFont = Gowun_Batang({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });
const englishFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' });

const Section5_Map = ({ 
  locationName, 
  address, 
  lat, 
  lng,
  transitSubway,
  transitBus,
  transitParking,
  theme = 'autumn'
}: Section5Props) => {
    const [loading, error] = useKakaoLoader({
        appkey: "a604d8920a0dd167831ffad84b10b2d3", // 본인의 API KEY 유지
    });

    // 현재 테마 가져오기
    const currentTheme = themeColors[theme];

    // DB에 좌표값이 비어있을 경우를 대비한 기본값
    const LOCATION_LAT = lat || 37.5665; 
    const LOCATION_LNG = lng || 126.9780;

    // 값이 없을 때 보여줄 기본(더미) 데이터
    const defaultSubway = "5호선 마포역 4번 출구 도보 3분";
    const defaultBus = "8600, 8601, G6005, M6751, 1002\n160, 260, 261, 463, 600, 7611, 7613";
    const defaultParking = "호텔 내 주차공간이 협소하오니,\n가급적 대중교통을 이용하여 주시기 바랍니다.";

    const displaySubway = transitSubway || defaultSubway;
    const displayBus = transitBus || defaultBus;
    const displayParking = transitParking || defaultParking;

    // 🌟 줄바꿈(\n)을 <br />로 변환해주는 헬퍼 함수
    const renderTextWithLineBreaks = (text: string) => {
        return text.split('\n').map((line, index, array) => (
            <span key={index}>
                {line}
                {index !== array.length - 1 && <br />}
            </span>
        ));
    };

    return (
        <section className={`snap-section relative w-full min-h-[100dvh] flex items-center justify-center p-6 overflow-hidden ${koreanFont.className}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[330px] bg-white/80 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/50 rounded-sm p-6"
            >
                <div className="text-center mb-5">
                    {/* 🎨 소제목에 테마 컬러 적용 */}
                    <p className={`${englishFont.className} ${currentTheme.textMuted} text-[10px] font-bold tracking-[0.3em] mb-2 uppercase`}>
                        Location
                    </p>
                    <h2 className="text-xl font-bold text-stone-800 tracking-widest">오시는 길</h2>
                </div>

                <div className="w-full mb-5">
                    <div className="text-center mb-3">
                        <h3 className="text-base font-bold text-[13px] text-stone-900 mb-1">{locationName}</h3>
                        <div className="flex items-center justify-center gap-1 text-stone-500 text-[11px] font-medium">
                            <MapPin size={12} className="text-stone-400" />
                            <span>{address}</span>
                        </div>
                    </div>

                    <div className="w-full h-40 bg-stone-100 rounded-sm mb-3 relative overflow-hidden border border-stone-200 shadow-inner">
                        {loading || error ? (
                            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-xs">
                                {error ? "지도 로드 실패" : "지도 불러오는 중..."}
                            </div>
                        ) : (
                            <Map
                                center={{ lat: LOCATION_LAT, lng: LOCATION_LNG }}
                                style={{ width: "100%", height: "100%" }}
                                level={5}
                                draggable={true}
                                zoomable={true}
                            >
                                <MapMarker position={{ lat: LOCATION_LAT, lng: LOCATION_LNG }} />
                            </Map>
                        )}
                    </div>

                    {/* 지도 앱 버튼 */}
                    <div className="grid grid-cols-3 gap-2">
                        <a href={`https://map.kakao.com/link/search/${locationName}`} target="_blank" className="py-2.5 bg-[#FEE500] hover:brightness-95 text-stone-900 rounded-[4px] font-bold text-[10px] flex items-center justify-center shadow-sm transition-all">카카오맵</a>
                        <a href={`https://map.naver.com/v5/search/${locationName}`} target="_blank" className="py-2.5 bg-[#03C75A] hover:brightness-95 text-white rounded-[4px] font-bold text-[10px] flex items-center justify-center shadow-sm transition-all">네이버지도</a>
                        <a
                            href={`tmap://search?name=${locationName}&lon=${LOCATION_LNG}&lat=${LOCATION_LAT}`}
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `tmap://search?name=${locationName}&lon=${LOCATION_LNG}&lat=${LOCATION_LAT}`;
                                setTimeout(() => {
                                    window.open('https://www.tmap.co.kr/tmap2/mobile/route.do', '_blank');
                                }, 1500);
                            }}
                            className="py-2.5 bg-[#FF4040] hover:brightness-95 text-white rounded-[4px] font-bold text-[10px] flex items-center justify-center shadow-sm transition-all"
                        >
                            티맵
                        </a>            
                    </div>
                </div>

                <div className="w-full h-[1px] bg-stone-300/50 my-4"></div>

                {/* 🌟 3. 커스텀 교통편 안내 영역 */}
                <div className="space-y-3 pl-1">
                    
                    {/* 지하철 */}
                    {displaySubway && (
                        <div className="flex gap-3 items-start">
                            <div className="mt-0.5 text-stone-400 min-w-[14px]"><Train size={13} /></div>
                            <div className="text-[11px] leading-relaxed text-stone-600 font-medium">
                                <strong className="text-stone-800 font-bold mr-1 block mb-0.5">지하철</strong>
                                {renderTextWithLineBreaks(displaySubway)}
                            </div>
                        </div>
                    )}

                    {/* 버스 */}
                    {displayBus && (
                        <div className="flex gap-3 items-start">
                            <div className="mt-0.5 text-stone-400 min-w-[14px]"><Bus size={13} /></div>
                            <div className="text-[11px] leading-relaxed text-stone-600 font-medium w-full">
                                <strong className="text-stone-800 font-bold mr-1 block mb-0.5">버스</strong>
                                <div className="text-stone-500 text-[10px] leading-snug tracking-tight break-keep mt-1">
                                    {renderTextWithLineBreaks(displayBus)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 주차/안내 */}
                    {displayParking && (
                        <div className="flex gap-3 items-start">
                            {/* 🎨 알림 아이콘에 테마 컬러 적용 */}
                            <div className={`mt-0.5 min-w-[14px] ${currentTheme.icon}`}><Megaphone size={13} /></div>
                            <div className={`text-[11px] leading-relaxed font-bold break-keep ${currentTheme.text}`}>
                                {renderTextWithLineBreaks(displayParking)}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default Section5_Map;