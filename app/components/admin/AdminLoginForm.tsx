// app/components/admin/AdminLoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions/adminAuth';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginAdmin(password);
    
    if (result.success) {
      router.refresh(); // 로그인 성공 시 화면을 새로고침하여 리스트 화면으로 전환
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-stone-200">
        <h2 className="text-2xl font-bold text-center text-stone-800 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">비밀번호가 일치하지 않습니다.</p>}
          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-3 rounded-md font-bold hover:bg-stone-900 transition-colors"
          >
            접속하기
          </button>
        </form>
      </div>
    </div>
  );
}