// app/actions/adminAuth.ts
'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    // 비밀번호가 맞으면 브라우저에 인증 쿠키 저장 (하루 동안 유지)
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'true', { maxAge: 60 * 60 * 24 });
    return { success: true };
  }

  return { success: false };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}