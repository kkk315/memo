import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Breadcrumb from "./components/Breadcrumb";
import Sidebar from "./components/Sidebar/Sidebar";
import { siteConfig } from "../lib/site-config";
import styles from "./layout.module.css";
import "./globals.css";
import Script from "next/script";

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

// メタデータ
export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: 'https://github.com/kkk315' }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://mkazu.net',
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: `@${siteConfig.author}`,
  },
  alternates: {
    canonical: 'https://mkazu.net',
  },
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
        {/* Google Analytics（gtag.js） */}
        {siteConfig.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="site-title">
              {siteConfig.title}
            </Link>
            <nav className="header-nav">
              <Link href="/" className="nav-link">ホーム</Link>
              <Link href="/categories" className="nav-link">カテゴリ</Link>
              <Link href="/articles" className="nav-link">記事一覧</Link>
            </nav>
          </div>
        </header>
        
        <div className={styles.siteContainer}>
          <div className={styles.breadcrumbArea}>
            <Breadcrumb />
          </div>
          <main className={styles.mainContentArea}>
            {children}
          </main>
          <aside className={styles.sidebarArea}>
            <Sidebar />
          </aside>
        </div>
        
        <footer className="site-footer">
          <div className="footer-inner">
            <p>{siteConfig.footer.copyright(2025)}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
