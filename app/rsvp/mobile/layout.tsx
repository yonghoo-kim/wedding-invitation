import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSVP Mobile Admin",
  description: "모바일 관리자 페이지",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "RSVP Mobile Admin",
    description: "모바일 관리자 페이지",
    images: [],
  },
};

export default function RsvpMobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}