// app/components/create/Step3_MediaTheme.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // 본인 경로에 맞게 확인해주세요!
import { Loader2, UploadCloud, X, Star, Heart, GripHorizontal } from 'lucide-react';
import Image from 'next/image';

interface Step3Props {
  formData: any;
  handleFormChange: (e: any) => void;
  setFormData: (data: any) => void;
}

const THEMES = [
  { id: 'spring', name: '봄 (벚꽃)', emoji: '🌸' },
  { id: 'summer', name: '여름 (반딧불)', emoji: '✨' },
  { id: 'autumn', name: '가을 (단풍)', emoji: '🍁' },
  { id: 'winter', name: '겨울 (눈)', emoji: '❄️' },
];

export default function Step3_MediaTheme({ formData, handleFormChange, setFormData }: Step3Props) {
  const [isUploading, setIsUploading] = useState(false);
  
  // 🌟 DnD를 위한 상태 추가
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // 1. Supabase 이미지 업로드 로직
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('wedding-gallery').upload(filePath, file);

      if (error) {
        console.error('업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
        continue;
      }

      const { data } = supabase.storage.from('wedding-gallery').getPublicUrl(filePath);
      newUrls.push(data.publicUrl);
    }

    setFormData({
      ...formData,
      galleryImages: [...formData.galleryImages, ...newUrls],
    });

    setIsUploading(false);
  };

  // 2. 클라우드 영구 삭제 로직
  const removeImage = async (urlToRemove: string) => {
    try {
      let fileName = urlToRemove.split('/').pop();
      if (fileName) {
        fileName = decodeURIComponent(fileName.split('?')[0]);
        const fullPath = urlToRemove.includes('/uploads/') ? `uploads/${fileName}` : fileName;
        await supabase.storage.from('wedding-gallery').remove([fullPath]);
      }
    } catch (err) {
      console.error('삭제 처리 중 에러:', err);
    }

    const newGallery = formData.galleryImages.filter((url: string) => url !== urlToRemove);
    setFormData({ 
      ...formData, 
      galleryImages: newGallery,
      mainImage: formData.mainImage === urlToRemove ? '' : formData.mainImage,
      closingImage: formData.closingImage === urlToRemove ? '' : formData.closingImage,
    });
  };

  const setAsMain = (url: string) => setFormData({ ...formData, mainImage: url });
  const setAsClosing = (url: string) => setFormData({ ...formData, closingImage: url });

  // 🌟 3. Drag & Drop 이벤트 핸들러 추가
  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragEnter = (index: number) => {
    // 드래그 중인 아이템이 없거나, 자기 자신 위치에 들어왔을 땐 무시
    if (draggedIdx === null || draggedIdx === index) return;

    const newGallery = [...formData.galleryImages];
    const draggedItem = newGallery[draggedIdx];
    
    // 기존 위치에서 빼서 새로운 위치에 끼워넣기 (배열 순서 스왑)
    newGallery.splice(draggedIdx, 1);
    newGallery.splice(index, 0, draggedItem);

    setFormData({ ...formData, galleryImages: newGallery });
    setDraggedIdx(index); // 드래그 중인 인덱스 업데이트
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* 1. 테마 선택 */}
      <section>
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">1</span>
          디자인 테마 선택
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setFormData({ ...formData, theme: theme.id })}
              className={`p-4 rounded-xl border text-center transition-all ${
                formData.theme === theme.id 
                  ? 'border-amber-500 bg-amber-50 shadow-sm' 
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="text-2xl mb-2">{theme.emoji}</div>
              <div className={`text-sm font-bold ${formData.theme === theme.id ? 'text-amber-700' : 'text-stone-600'}`}>
                {theme.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. 갤러리 이미지 업로드 */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">2</span>
            갤러리 사진 업로드
          </h3>
          <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">
            {formData.galleryImages.length}장 업로드 됨
          </span>
        </div>

        {/* 업로드 버튼 */}
        <div className="relative border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors p-8 text-center cursor-pointer mb-6">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageUpload} 
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          {isUploading ? (
            <div className="flex flex-col items-center text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
              <p className="text-sm font-bold">사진을 업로드하는 중입니다...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-stone-500">
              <UploadCloud className="w-8 h-8 text-stone-400 mb-3" />
              <p className="text-sm font-bold text-stone-700 mb-1">여기를 클릭하거나 사진을 끌어다 놓으세요</p>
              <p className="text-xs text-stone-400">한 번에 여러 장 선택 가능 (JPG, PNG)</p>
            </div>
          )}
        </div>

        {/* 업로드된 썸네일 그리드 */}
        {formData.galleryImages.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-xs text-stone-500 font-bold flex items-center gap-1.5">
                💡 업로드된 사진 중 <strong className="text-amber-600">메인 화면(첫 장)</strong>과 <strong className="text-stone-800">마무리 화면(마지막 장)</strong>에 쓸 사진을 지정해주세요.
              </p>
              {/* 🌟 순서 변경 안내 문구 추가 */}
              <p className="text-xs text-blue-500 font-bold flex items-center gap-1.5">
                🖱️ 사진을 마우스로 드래그하여 갤러리 순서를 변경할 수 있습니다.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formData.galleryImages.map((url: string, index: number) => (
                <div 
                  key={url} // 🌟 DnD 시 리렌더링 버그 방지를 위해 index 대신 고유한 url을 key로 사용!
                  draggable // 🌟 HTML5 네이티브 드래그 활성화
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()} // 드롭 허용을 위해 필수
                  className={`relative group aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden border shadow-sm cursor-grab active:cursor-grabbing transition-transform ${
                    draggedIdx === index ? 'opacity-50 scale-95 border-amber-500 z-10' : 'border-stone-200'
                  }`}
                >
                  {/* DnD 핸들러 아이콘 (디자인 요소) */}
                  <div className="absolute top-2 left-2 z-10 p-1 bg-black/30 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <GripHorizontal className="w-3 h-3 text-white" />
                  </div>

                  <Image 
                    src={url} 
                    alt={`gallery-${index}`} 
                    fill 
                    className="object-cover pointer-events-none" // 드래그 시 이미지가 뜯어지는 고스트 현상 방지
                    unoptimized
                  />
                  
                  {/* 오버레이 메뉴 */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button type="button" onClick={() => setAsMain(url)} className={`w-full py-1.5 rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-1 ${formData.mainImage === url ? 'bg-amber-500 text-white' : 'bg-white/90 text-stone-700 hover:bg-white'}`}>
                      <Star className="w-3 h-3" /> 메인
                    </button>
                    <button type="button" onClick={() => setAsClosing(url)} className={`w-full py-1.5 rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-1 ${formData.closingImage === url ? 'bg-stone-800 text-white' : 'bg-white/90 text-stone-700 hover:bg-white'}`}>
                      <Heart className="w-3 h-3" /> 마무리
                    </button>
                  </div>

                  {/* 뱃지 표시 */}
                  <div className="absolute top-2 left-10 flex flex-col gap-1 pointer-events-none z-10">
                    {formData.mainImage === url && <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">메인</span>}
                    {formData.closingImage === url && <span className="bg-stone-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">마무리</span>}
                  </div>

                  {/* 삭제 버튼 */}
                  <button type="button" onClick={() => removeImage(url)} className="absolute top-2 right-2 z-20 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-sm">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}