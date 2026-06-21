import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '암호화폐 순위 - 실시간 가격 정보',
  description: '비트코인, 이더리움 등 주요 암호화폐의 실시간 가격, 시가총액, 거래량을 확인하세요',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
