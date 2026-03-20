// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ❌ 기존 상수 파일 import 삭제

const inter = Inter({ subsets: ["latin"] });

// 플랫폼 전체의 기본 메타데이터 (개별 청첩장 정보가 없을 때 뜹니다)
export const metadata: Metadata = {
  title: "모바일 청첩장 플랫폼",
  description: "우리의 아름다운 시작을 알립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}