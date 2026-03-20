import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSVP Admin",
  description: "관리자 전용 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "RSVP Admin",
    description: "관리자 전용 페이지입니다.",
    images: [], // 이미지 상속 차단
  },
};

export default function RsvpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}