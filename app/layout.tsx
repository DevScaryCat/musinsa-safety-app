import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // 예시 폰트

const inter = Inter({ subsets: ["latin"] }) // 예시 폰트

export const metadata: Metadata = {
  title: "무신사 안전 점검",
  description: "안전 점검 시스템",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // [수정] 여기에 suppressHydrationWarning={true}를 추가합니다.
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}