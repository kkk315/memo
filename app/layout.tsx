import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Breadcrumb from "./components/Breadcrumb";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tech Memo | プロフェッショナルな技術ブログ",
  description: "技術的な知見とインサイトを共有する、洗練されたメモブログです。最新の技術トレンドから実践的なプログラミングテクニックまで、エンジニアに役立つ情報をお届けします。",
  keywords: ["技術ブログ", "プログラミング", "開発", "エンジニアリング", "Web開発", "ソフトウェア"],
  authors: [{ name: "Tech Memo" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="site-title">
              Tech Memo
            </Link>
            <nav className="site-nav">
              <Link href="/">ホーム</Link>
              <Link href="#about">概要</Link>
            </nav>
          </div>
        </header>
        
        <div className="site-container">
          <Breadcrumb />
          {children}
        </div>
        
        <footer className="site-footer">
          <div className="footer-inner">
            <p>&copy; 2025 Tech Memo | 技術的な知見を共有するプラットフォーム</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
