// app/actions/userAuth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma'; // 본인 경로에 맞게
import bcrypt from 'bcryptjs';

// 🌟 업데이트된 회원가입 로직
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { success: false, error: '모든 정보를 입력해주세요.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { success: false, error: '이미 가입된 이메일입니다.' };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,      // 🌟 이름 추가 저장
        email,
        password: hashedPassword,
      },
    });

    const cookieStore = await cookies();
    // 💡 maxAge를 제거하여 브라우저 종료 시 삭제되는 세션 쿠키로 생성
    cookieStore.set('user_token', newUser.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return { success: true };
  } catch (error) {
    console.error('회원가입 에러:', error);
    return { success: false, error: '회원가입 처리 중 오류가 발생했습니다.' };
  }
}

// 2. 로그인 로직
export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { success: false, error: '이메일과 비밀번호를 입력해주세요.' };

  try {
    // DB에서 이메일로 유저 찾기
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, error: '존재하지 않는 계정입니다.' };

    // 비밀번호 일치 여부 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return { success: false, error: '비밀번호가 일치하지 않습니다.' };

    const cookieStore = await cookies();
    // 💡 maxAge를 제거하여 브라우저 종료 시 삭제되는 세션 쿠키로 생성
    cookieStore.set('user_token', user.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });

    return { success: true };
  } catch (error) {
    console.error('로그인 에러:', error);
    return { success: false, error: '로그인 처리 중 오류가 발생했습니다.' };
  }
}

// 3. 로그아웃 로직
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('user_token');
  redirect('/');
}