import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

import "./globals.css";

export const metadata: Metadata = {
  title: "K-NOMAD | 한국 디지털 노마드 도시 탐색",
  description:
    "실제 사용자 평가로 한국 도시별 비용, 카페, 인터넷, 교통, 안전, 생활 만족도를 비교하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
